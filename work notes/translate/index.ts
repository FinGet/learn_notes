import { EventEmitter } from '../eventEmitter';

import { bWt, gWt, vWt, xWt, yWt, standardizeLocale } from './config';
import TranslateService, { rm, MergedParagraph } from './translateService';

import InjectCss from '~public/utils/injectCss';
import { randomUUID, sleep } from '~public/utils';
import { throttle } from '~public/composables/useDebounce';
import { settingKey } from '~public/utils/logic';

// let browser: any;
// (async () => {
//   if (__ENV__ !== 'web') {
//     browser = await import('webextension-polyfill').then((browser) => browser);
//   }
// })();
// import { settingsState } from '~public/utils/storage';
interface TranslatableParagraph {
  merged?: boolean;
  commonParentEl: HTMLElement;
  detectLang: string;
  error?: Error,
  id: string;
  isBreakByBrTag: boolean;
  isNeedNewLine: boolean;
  replaceTagHtmlList: string[];
  result?: string;
  text: string;
  textNodeWrapperEls: HTMLElement[];
  translateEl: HTMLElement;
  translateElWrapper: HTMLElement;
}

interface TranslateResult {
  detectLang: string;
  error?: Error | null;
  id: string;
  result: string;
  text: string;
}

interface TranslateConfig {
  config: {
    area: string;
    mode: string;
    containerSelectors: string[];
    blockUrls: string[];
    excludeTags: string[];
    excludeSelectors: string[];
    specialRules: {
      matches: string[];
      excludeMatches: string[];
      selectors: string[];
      excludeTags: string[];
      excludeSelectors: string[];
      additionalSelectors: string[];
      additionalExcludeSelectors: string[];
    }[];
    keepStyleSelectors: string[];
  }
}

const translateConfig = {
  area: 'all',
  mode: 'dynamic',
  containerSelectors: [] as string[],
  blockUrls: gWt,
  excludeTags: vWt,
  excludeSelectors: bWt,
  specialRules: yWt,
  keepStyleSelectors: xWt
};


const CUSTOM_ATTR_PREFIX = 'arvin';
const CUSTOM_CONFIG = {
  CUSTOM_ATTR: {
    TRANSLATABLE_NODE_PARENT_EL: `${CUSTOM_ATTR_PREFIX}-translatable-node-parent-el`,
    EXCLUDE_EL: `${CUSTOM_ATTR_PREFIX}-exclude-el`,
    INJECT_STYLE_EL: `${CUSTOM_ATTR_PREFIX}-inject-style-el`,
    NO_TRANSLATE_EL: `${CUSTOM_ATTR_PREFIX}-no-translate-el`
  },
  CUSTOM_ATTR_VALUE: 'm',
  TRANSLATABLE_NODE_WRAPPER_TAG: `${CUSTOM_ATTR_PREFIX}-translatable`,
  TRANSLATE_EL_TAG: `${CUSTOM_ATTR_PREFIX}-translate`,
  TRANSLATE_EL_WRAPPER_TAG: `${CUSTOM_ATTR_PREFIX}-translate-wrapper`,
  SPACE_EL_TAG: `${CUSTOM_ATTR_PREFIX}-space`,
  PLACEHOLDER_TAG_FOR_WRAPPER: 'mw',
  PLACEHOLDER_TAG_FOR_TRANSLATABLE_EL: 'mt',
  PLACEHOLDER_TAG_FOR_UNTRANSLATABLE_EL: 'mu',
  LOADING_EL_CLASS: `${CUSTOM_ATTR_PREFIX}-translate-loading-spinner`,
  DASHED_THEME_CLASS: `${CUSTOM_ATTR_PREFIX}-translate-theme-dashed`
};

const injectCss = new InjectCss('translate');
const translateService = new TranslateService();

const onDOMReady = (callback: () => void) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

interface ParallelTranslation {
  settingsPanelVisible: boolean;
  translateStatus: 'waiting' | 'translating' | 'translated';
  isDislike: boolean;
  autoShowTranslateBtn: boolean;
  autoTranslateHosts: string[];
  autoTranslateLocales: string[];
  disableTranslateHosts: string[];
  applyDashedTheme: boolean;
  sameLangHintVisible: boolean;
}

export default class Translate extends EventEmitter {
  // translate setting options
  parallelTranslation: ParallelTranslation = {
    settingsPanelVisible: false,
    translateStatus: 'waiting', // translating, translated
    isDislike: false,
    autoShowTranslateBtn: false,
    autoTranslateHosts: [],
    autoTranslateLocales: [],
    disableTranslateHosts: [],
    applyDashedTheme: false, // underlined theme
    sameLangHintVisible: false,
  };
  pageLang: string | null = null;
  isBlockCurPage = false;
  sourceComposeLang = 'auto';
  targetComposeLang = 'auto';
  // targetLang = 'zh-CN';
  renderType = 'original';
  systemLang = 'en';
  mutationObserver: MutationObserver | null = null;
  translatableParagraphs: TranslatableParagraph[] = [];
  intersectionObserverList: IntersectionObserver[] = [];
  intersectionObserverParagraphList: TranslatableParagraph[] = [];
  intersectionObserverThrottleCall = throttle((e: TranslateConfig) => {
    this.translateParagraphs(this.intersectionObserverParagraphList, e),
      this.intersectionObserverParagraphList = [];
  }, 500, { trailing: true });
  mutationObserverThrottleCall = throttle(() => {
    this.doTranslate();
  }, 1000, { trailing: true });


  constructor() {
    super();
    this.init();
  }

  get sourceLang() {
    // return this.sourceComposeLang === 'auto' ? rm.AUTO_DETECT_LANG : this.standardizeLocale(this.getLocaleByComposeLanguage(this.sourceComposeLang));
    return this.sourceComposeLang === 'auto' ? rm.AUTO_DETECT_LANG : standardizeLocale(this.sourceComposeLang);
  }
  get targetLang() {
    // return this.targetComposeLang=== 'auto' ? this.systemLang : this.standardizeLocale(this.getLocaleByComposeLanguage(this.targetComposeLang));
    return this.targetComposeLang === 'auto' ? standardizeLocale(this.systemLang) : standardizeLocale(this.targetComposeLang);
  }

  init() {
    onDOMReady(() => {
      this.detectPageLang();
      this.checkIsBlockPage();
      if (__ENV__ !== 'web')  {
        this.initParallelTranslationData();
        this.systemLang = browser.default.i18n.getUILanguage();
      }
    });
  }

  async afterToggleTranslateLang() {
    if (this.parallelTranslation.translateStatus === 'translated') {
      this.toggleRenderType('original');
      this.parallelTranslation.settingsPanelVisible = false;
      await this.doTranslate();
      this.parallelTranslation.translateStatus = 'translated';
    }
  }
  initParallelTranslationData() {
    browser.default.storage.local.get(settingKey).then(data => {
      const settingData = JSON.parse(data[settingKey]);
      if (settingData) {
        this.setParallelTranslationData(settingData);
      }
      // if (this.pageLang) {
      //   this.tryAutoTranslate();
      // } else {
      //   this.on('pageLangDetected', () => {
      //     this.tryAutoTranslate();
      //   });
      // }
    });
    browser.default.storage.onChanged.addListener(n => {
      for (let [o, a] of Object.entries(n)) {
        if (o === settingKey) {
          const settingData = JSON.parse(a.newValue);
          if (settingData) {
            this.setParallelTranslationData(settingData);
            this.applyTranslationStyle();
          }
        }
      }
    });
  }

  setParallelTranslationData(data: any) {
    this.parallelTranslation.autoShowTranslateBtn = !!data.autoShowTranslateBtn;
    this.parallelTranslation.autoTranslateHosts = data.autoTranslateHosts || [];
    this.parallelTranslation.autoTranslateLocales = data.autoTranslateLocales || [];
    this.parallelTranslation.disableTranslateHosts = data.disableTranslateHosts || [];
    this.parallelTranslation.applyDashedTheme = !!data.applyDashedTheme;
    this.targetComposeLang = data.translateTargetLanguage || 'auto';
  }

  async translate() {
    if (this.parallelTranslation.translateStatus !== 'translating') {
      if (this.parallelTranslation.translateStatus === 'waiting') {
        this.parallelTranslation.translateStatus = 'translating';
        await this.doTranslate();
        this.parallelTranslation.translateStatus = 'translated';
      } else {
        const newRenderType = this.renderType === 'translated' ? 'original' : 'translated';
        this.toggleRenderType(newRenderType);
      }
    }
  }

  async doTranslate() {
    const e = this.getContext();
    const r = this.getContainers(e);
    // console.log('context', e, 'containers', r);
    this.markContainersExcludeEl(e, r);
    let { inViewportParagraphs, outViewportParagraphs } = await this.getParagraphs(e, r);
    // console.log('inViewportParagraphs', inViewportParagraphs, 'outViewportParagraphs', outViewportParagraphs, 'e', e);
    await this.translateParagraphs(inViewportParagraphs, e);
    this.addIntersectionObserver(outViewportParagraphs, e);
    this.addMutationObserver();
    this.renderType = 'translated';
  }

  tryAutoTranslate() {
    if (this.parallelTranslation.translateStatus !== 'waiting' || this.isBlockCurPage) return;
    let { autoTranslateHosts, disableTranslateHosts, autoTranslateLocales } = this.parallelTranslation;
    if (disableTranslateHosts.includes(location.hostname)) return;
    if (autoTranslateHosts.includes(location.hostname)) {
      // console.log('auto translate');
      this.translate();
      return;
    }
    if (this.pageLang && autoTranslateLocales.includes(this.pageLang)) {
      // console.log('auto translate');
      this.translate();
    }
  }

  addMutationObserver() {
    if (this.mutationObserver) return;
    const observer = new MutationObserver(r => {
      r.forEach(n => {
        n.addedNodes.forEach(i => {
          i.nodeName.indexOf(CUSTOM_ATTR_PREFIX.toUpperCase()) > -1 || i.nodeType === Node.ELEMENT_NODE && this.mutationObserverThrottleCall();
        });
      });
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true
    });
    this.mutationObserver = observer;
  }

  getContext(): TranslateConfig {
    let context = {
      config: translateConfig
    };

    let { specialRules } = translateConfig;
    let rule = specialRules.find(({ matches, excludeMatches }) => {
      let url = document.location.href;
      return this.checkUrlIsMatched(url, excludeMatches) || this.checkUrlIsMatched(url, matches);
    });

    if (rule) {
      let { excludeTags, additionalSelectors, excludeSelectors, additionalExcludeSelectors, selectors } = rule;
      if (selectors && selectors.length) {
        context.config.containerSelectors = selectors;
      }
      if (additionalSelectors && additionalSelectors.length) {
        context.config.containerSelectors = context.config.containerSelectors.concat(additionalSelectors);
      }
      if (excludeTags && excludeTags.length) {
        context.config.excludeTags = excludeTags;
      }
      // if (additionalExcludeTags && additionalExcludeTags.length) {
      //   context.config.excludeTags = context.config.excludeTags.concat(additionalExcludeTags);
      // }
      if (excludeSelectors && excludeSelectors.length) {
        context.config.excludeSelectors = excludeSelectors;
      }
      if (additionalExcludeSelectors && additionalExcludeSelectors.length) {
        context.config.excludeSelectors = context.config.excludeSelectors.concat(additionalExcludeSelectors);
      }
    }
    // @ts-ignore
    return context;
  }
  getContainers(e: any) {
    const body = document.body;
    const { config: { area: n, containerSelectors: i } } = e;
    if (n === 'all')
      return [body];
    let a: Element[] = [];
    const l = this.getElementsBySelectors(body, i);
    a = a.concat(...l);
    a.length === 0 && (a = [body]);
    return a as HTMLElement[];
  }
  addIntersectionObserver(paragraphs: TranslatableParagraph[], r: TranslateConfig) {
    // Iterate over each TranslatableParagraph object.
    paragraphs.forEach(paragraph => {
      // Create an IntersectionObserver for each paragraph.
      let observer = new IntersectionObserver((entries, observerSelf) => {
        // Go through each entry to check if it is intersecting.
        entries.some(entry => {
          if (entry.intersectionRatio > 0) {
            // If an element is intersecting, disconnect the observer.
            observerSelf.disconnect();
            // Add the paragraph to the intersection observer list.
            this.intersectionObserverParagraphList.push(paragraph);
            // @ts-ignore Throttle the translation call as specified by the config.
            this.intersectionObserverThrottleCall(r);
            return true; // Indicates that we've found an intersecting element.
          }
          return false; // Continue checking other entries.
        });
      });
      // Begin observing the "commonParentEl" of the paragraph.
      observer.observe(paragraph.commonParentEl);
      // Add observer to the list of all observers.
      this.intersectionObserverList.push(observer);
    });
  }
  async getParagraphs(e: TranslateConfig, r: HTMLElement[]): Promise<{
    inViewportParagraphs: TranslatableParagraph[],
    outViewportParagraphs: TranslatableParagraph[]
  }> {
    let n = this.createTextNodeWrapperEls(r)
      , i = this.createParagraphs(n);
    i = await this.processShouldTranslate(i),
      i = this.mergeParagraphs(i),
      i = this.processIsNeedNewLine(i),
      i = await this.processDetectedLang(i);
    let { inViewportParagraphs, outViewportParagraphs } = await this.processParagraphsIsInViewport(e, i);
    return {
      inViewportParagraphs,
      outViewportParagraphs
    };
  }
  async processDetectedLang(paragraphs: TranslatableParagraph[]) {
    return await Promise.all(paragraphs.map(async p => {
      let i = await this.detectTextLang(p.text);
      p.detectLang = i;
      return p;
    }));
  }
  async processParagraphsIsInViewport(e: TranslateConfig, r: TranslatableParagraph[]) {
    let { config: { mode: n } } = e;
    if (n === 'all') {
      return Promise.resolve({
        inViewportParagraphs: [...r],
        outViewportParagraphs: []
      });
    }

    const inViewportParagraphs: any[] = [];
    const outViewportParagraphs: any[] = [];
    await Promise.all(r.map(async l => {
      await this.checkElIsInViewport(l.commonParentEl) ? inViewportParagraphs.push(l) : outViewportParagraphs.push(l);
    }));
    return {
      inViewportParagraphs,
      outViewportParagraphs
    };
  }
  checkElIsInViewport(element: HTMLElement) {
    return new Promise((resolve) => {
      const observer = new IntersectionObserver((entries, observerInstance) => {
        // Check if any intersection ratio is greater than 0 - which means it is in the viewport.
        const isVisible = entries.some(entry => {
          if (entry.intersectionRatio > 0) {
            // Disconnect the observer if the element is in the viewport.
            observerInstance.disconnect();
            return true;
          }
          return false;
        });
        // Resolve the promise with the visibility status.
        resolve(isVisible);
      });
      // Start observing the given element.
      observer.observe(element);
    });
  }
  processIsNeedNewLine(paragraphs: TranslatableParagraph[]): TranslatableParagraph[] {
    return paragraphs.map(paragraph => {
      if (paragraph.isBreakByBrTag)
        return paragraph;

      let isNeedNewLine = false;

      if (this.isBlockEl(paragraph.commonParentEl)) {
        let blockParentEl = this.getBlockParentEl(paragraph.commonParentEl);
        isNeedNewLine = true;
        if (blockParentEl) {
          let { display, flexDirection } = window.getComputedStyle(blockParentEl);
          if (display === 'flex' && flexDirection === 'row') {
            isNeedNewLine = false;
          }
        }
      }
      let text = paragraph.text;
      let wordCountThreshold = 5;
      let charCountThreshold = 32;
      let newlineCountThreshold = 2;
      let wordCount = text.split(' ').length;
      let charCount = text.length;
      let newlineCount = text.split(`\n`).length;
      if (wordCount < wordCountThreshold && charCount < charCountThreshold && newlineCount < newlineCountThreshold) {
        isNeedNewLine = false;
      }
      if (wordCount > wordCountThreshold || charCount > charCountThreshold || newlineCount >= newlineCountThreshold) {
        isNeedNewLine = true;
      }
      paragraph.isNeedNewLine = isNeedNewLine;
      return paragraph;
    });
  }
  mergeParagraphs(paragraphs: TranslatableParagraph[]): TranslatableParagraph[] {
    let mergedParagraphs: TranslatableParagraph[] = [];

    paragraphs.forEach(paragraph => {
      let querySelector = `[${CUSTOM_CONFIG.CUSTOM_ATTR.TRANSLATABLE_NODE_PARENT_EL}=${CUSTOM_CONFIG.CUSTOM_ATTR_VALUE}]`;
      if (paragraph.commonParentEl.querySelector(querySelector)) {
        paragraph.textNodeWrapperEls.forEach(node => {
          let { translateEl, wrapperEl } = this.createTranslateEl();
          let newNode = node.cloneNode(true) as HTMLElement;
          this.setAttr(newNode, CUSTOM_CONFIG.CUSTOM_ATTR.TRANSLATABLE_NODE_PARENT_EL);
          mergedParagraphs.push({
            ...paragraph,
            id: randomUUID(),
            text: node.innerText,
            textNodeWrapperEls: [newNode],
            translateEl: translateEl,
            translateElWrapper: wrapperEl,
            commonParentEl: newNode
          });
        });
        this.removeAllCustomAttr(paragraph.commonParentEl);
      } else {
        mergedParagraphs.push(paragraph);
      }
    });

    let finalParagraphs: TranslatableParagraph[] = [];
    let createBreakParagraphs = (nodes: HTMLElement[], paragraph: TranslatableParagraph) => {
      if (nodes.length === 0)
        return;

      let { translateEl, wrapperEl } = this.createTranslateEl();
      let div = document.createElement('div');
      nodes.forEach(node => {
        div.appendChild(node.cloneNode(true));
      });
      finalParagraphs.push({
        ...paragraph,
        id: randomUUID(),
        text: div.innerText.trim().replace(/\n/g, ''),
        textNodeWrapperEls: nodes,
        translateEl: translateEl,
        translateElWrapper: wrapperEl,
        isBreakByBrTag: true
      });
    };

    mergedParagraphs.forEach(paragraph => {
      let brNodes = Array.from(paragraph.commonParentEl.querySelectorAll('br'));
      if (brNodes.length > 0) {
        let index = 0;
        let { textNodeWrapperEls } = paragraph;
        while (index < brNodes.length) {
          let brNode = brNodes[index];
          let followingNodes = textNodeWrapperEls.filter(node => node.compareDocumentPosition(brNode) & Node.DOCUMENT_POSITION_FOLLOWING);
          textNodeWrapperEls = textNodeWrapperEls.filter(node => !followingNodes.includes(node));
          createBreakParagraphs(followingNodes, paragraph);
          index++;
        }
        createBreakParagraphs(textNodeWrapperEls, paragraph);
      } else {
        finalParagraphs.push(paragraph);
      }
    });

    return [...finalParagraphs];
  }

  findTextNodeParentEl(e: HTMLElement, r: HTMLElement): HTMLElement | null {
    let n = e.parentElement;
    return n?.tagName === 'BODY' ? n : r === n ? r : r.textContent?.trim() === n?.textContent?.trim() ? n : this.findTextNodeParentEl(n!, r);
  }
  getBlockParentEl(e: HTMLElement): HTMLElement | null {
    try {
      if (e.tagName === 'BODY') return e;
      let r = e.parentElement;
      return this.isBlockEl(r!) || r?.tagName === 'BODY' ? r : this.getBlockParentEl(r!);
    } catch (err) {
      return null;
    }
  }
  async shouldTranslate(e: TranslatableParagraph) {
    if (!this.textIsValid(e.text))
      return !1;
    let n = await this.detectTextLang(e.text);
    return !(n && n === this.targetLang);
  }
  textIsValid(e: string) {
    let r = e.trim();
    if (!r || /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(r) || /^[0-9]*$/.test(r) || ['#', '@', '$'].includes(r[0]))
      return false;
    let a = 2;
    return !(r.length < a);
  }
  async processShouldTranslate(e: TranslatableParagraph[]) {
    let r: TranslatableParagraph[] = [];
    await Promise.all(e.map(async n => {
      n.text = n.text.trim(),
        n.text = n.text.replace(/\n/g, ''),
        await this.shouldTranslate(n) && r.push(n);
    }));
    this.cleanParagraphsEffect(e.filter(n => !r.includes(n)));
    return [...r];
  }
  cleanParagraphsEffect(paragraphs: TranslatableParagraph[]) {
    paragraphs.forEach(({ commonParentEl, textNodeWrapperEls, translateElWrapper }) => {
      // Remove all custom attributes from the common parent element.
      this.removeAllCustomAttr(commonParentEl);
      // Remove the translation element wrapper from the DOM.
      translateElWrapper.remove();
      // Iterate over text node wrapper elements.
      textNodeWrapperEls.forEach(a => {
        // Get the first (and probably only) child of the wrapper,
        // which is presumably the original text node.
        let l = a.firstChild;
        // Place the original text node after the wrapper in the DOM.
        a.after(l!);
        // Remove the wrapper element from the DOM.
        a.remove();
      });
    });
  }
  isInlineEl(e: HTMLElement) {
    try {
      let { display } = window.getComputedStyle(e);
      return !!['inline'].includes(display);
    } catch (err) {
      return true;
    }

  }
  isBlockEl(e: HTMLElement) {
    return !this.isInlineEl(e);
  }
  createTranslateEl() {
    let e = document.createElement(CUSTOM_CONFIG.TRANSLATE_EL_WRAPPER_TAG)
      , r = document.createElement(CUSTOM_CONFIG.TRANSLATE_EL_TAG);
    return r.classList.add(CUSTOM_CONFIG.LOADING_EL_CLASS),
      e.appendChild(r),
    {
      wrapperEl: e,
      translateEl: r
    };
  }
  createParagraphs(elements: HTMLElement[]): TranslatableParagraph[] {
    let paragraphs: TranslatableParagraph[] = [];

    for (let element of elements) {
      try {
        if (!element.checkVisibility()) {
          continue;
        }
      } catch {
        // to do
      }

      let textParent = this.findTextNodeParentEl(element, this.getBlockParentEl(element)!);
      let existingParagraph = paragraphs.find(p => p.commonParentEl === textParent);

      if (existingParagraph) {
        existingParagraph.textNodeWrapperEls.push(element);
        existingParagraph.text += element.innerText;
      } else {
        let text = element.innerText;
        const { translateEl, wrapperEl } = this.createTranslateEl();
        this.setAttr(textParent!, CUSTOM_CONFIG.CUSTOM_ATTR.TRANSLATABLE_NODE_PARENT_EL);

        paragraphs.push({
          id: randomUUID(),
          commonParentEl: textParent!,
          textNodeWrapperEls: [element],
          text: text,
          translateEl: translateEl,
          translateElWrapper: wrapperEl,
          isNeedNewLine: false,
          isBreakByBrTag: false,
          replaceTagHtmlList: [],
          detectLang: '',
        });
      }
    }

    return [...paragraphs];
  }
  createTextNodeWrapperEls(elements: HTMLElement[]) {
    let textNodeWrapperEls: HTMLElement[] = [];
    let textNodes: HTMLElement[] = [];

    elements.forEach(element => {
      let treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          let currentElement = node as HTMLElement;
          return (this.isMarkAttr(currentElement, CUSTOM_CONFIG.CUSTOM_ATTR.EXCLUDE_EL) || this.isMarkAttr(currentElement, CUSTOM_CONFIG.CUSTOM_ATTR.TRANSLATABLE_NODE_PARENT_EL)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      });

      let currentNode = treeWalker.nextNode();
      while (currentNode) {
        if (currentNode.textContent?.trim()) {
          textNodes.push(currentNode as HTMLElement);
        }
        currentNode = treeWalker.nextNode();
      }
    });

    textNodes.forEach(node => {
      let wrapper = this.createTranslatableNodeWrapper(node);
      textNodeWrapperEls.push(wrapper);
    });

    return textNodeWrapperEls;
  }
  createTranslatableNodeWrapper(e: HTMLElement) {
    let r = document.createElement(CUSTOM_CONFIG.TRANSLATABLE_NODE_WRAPPER_TAG);
    e.after(r);
    r.appendChild(e);
    return r;
  }
  markContainersExcludeEl(e: TranslateConfig, r: HTMLElement[]) {
    r.forEach(n => {
      this.markExcludeEl(e, n);
    });
  }
  markExcludeEl(e: TranslateConfig, r: HTMLElement) {
    let { excludeTags, excludeSelectors } = e.config;
    excludeTags.concat(excludeSelectors).forEach((tag: string) => {
      r?.querySelectorAll(tag)?.forEach((d: any) => {
        this.setAttr(d, CUSTOM_CONFIG.CUSTOM_ATTR.EXCLUDE_EL);
      });
    });
  }
  getElementsBySelectors(e: HTMLElement, r: string[]) {
    let result: Element[] = [];
    r.forEach(i => {
      let a = e.querySelector(i);
      a && result.push(a);
    });
    return result;
  }
  async translateParagraphs(paragraphs: TranslatableParagraph[], r: TranslateConfig) {
    this.injectCSS();
    paragraphs.forEach(n => {
      let { replaceTagHtmlList, commonParentEl, isBreakByBrTag } = n;
      if (isBreakByBrTag)
        return;
      let textContent = '';
      const treeWalker = document.createTreeWalker(commonParentEl, NodeFilter.SHOW_ELEMENT, o => {
        let c = o as HTMLElement;
        if (this.isMarkAttr(c, CUSTOM_CONFIG.CUSTOM_ATTR.EXCLUDE_EL) && r.config.keepStyleSelectors.includes(c.tagName)) {
          let f = replaceTagHtmlList.length;
          return replaceTagHtmlList.push(c.outerHTML),
            textContent += `<b${f}></b${f}>`,
            NodeFilter.FILTER_REJECT;
        }
        return c.nodeName === CUSTOM_CONFIG.TRANSLATABLE_NODE_WRAPPER_TAG.toUpperCase() ? (textContent += c.textContent,
          NodeFilter.FILTER_REJECT) : NodeFilter.FILTER_ACCEPT;
      });
      let currentNode = treeWalker.nextNode();
      while (currentNode) {
        currentNode = treeWalker.nextNode();
      }
      n.text = textContent.trim().replace(/\n/g, '');
      if (/<b\d+><\/b\d+>$/.test(n.text)) {
        n.text = `${n.text}.`;
      }
    });
    this.paragraphsToElement(paragraphs);

    await translateService.translate({
      paragraphs: paragraphs.map(({ id, text, detectLang }) => ({ id, text, detectLang })),
      taskUid: randomUUID(),
      originTitle: document.title,
      originUrl: location.href,
      from: this.sourceLang,
      to: this.targetLang
    }, (n:TranslateResult[]) => {
      const mergedResults = this.mergeResults(n, paragraphs);
      const translatableParagraphs = [];
      for (let l of mergedResults) {
        if (this.targetLang === l.detectLang) {
          translatableParagraphs.push(l);
        } else {
          requestAnimationFrame(() => {
            let { replaceTagHtmlList, result } = l;
            replaceTagHtmlList.forEach((h, o) => {
              result = result?.replace(`<b${o}></b${o}>`, h);
            });
            l.translateEl.innerHTML = result || '';
            l.translateEl.classList.remove(CUSTOM_CONFIG.LOADING_EL_CLASS);
          });
          this.translatableParagraphs.push(l);
        }
      }

      this.cleanParagraphsEffect(translatableParagraphs);
      this.applyTranslationStyle();
    });
  }
  mergeResults(existingResults: TranslateResult[], newResults: TranslatableParagraph[]) : TranslatableParagraph[] {
    let mergedResults: any = [];
    existingResults.forEach(existingResult => {
      let matchingResult = newResults.find(newResult => newResult.id === existingResult.id);
      if (matchingResult) {
        mergedResults.push({
          ...existingResult,
          ...matchingResult
        });
      }
    });

    return [...mergedResults];
  }
  mergeParagraph(paragraphs: TranslatableParagraph[]) {
    let mergedParagraphs: MergedParagraph[] = [];
    const addNewGroup = (paragraph: TranslatableParagraph) => {
      mergedParagraphs.push({
        merged: false,
        mergedText: paragraph.text,
        paragraphs: [paragraph],
        detectLang: paragraph.detectLang,
        textType: 'plain'
      });
    };

    paragraphs.forEach(paragraph => {
      let matchedGroup = this.findMatchedParagraphGroup(paragraph, mergedParagraphs);
      if (matchedGroup) {
        if (matchedGroup.paragraphs.length < 1000 && matchedGroup.mergedText.length + paragraph.text.length < 40000) {
          matchedGroup.paragraphs.push(paragraph);
          matchedGroup.mergedText += paragraph.text;
        } else {
          matchedGroup.merged = true;
          addNewGroup(paragraph);
        }
      } else {
        addNewGroup(paragraph);
      }
    });

    return mergedParagraphs;
  }
  findMatchedParagraphGroup(e: TranslatableParagraph, r: MergedParagraph[]) {
    return r.find(({ merged: n, detectLang: i }) => !n && i === e.detectLang);
  }

  // getLocaleByComposeLanguage(e: any) {
  //   // @ts-ignore
  //   return allLocals[e] ? allLocals[e].locale : e === 'Chinese (Traditional)' ? 'zh_TW' : e;
  // }

  paragraphsToElement(paragraphs: TranslatableParagraph[]) {
    paragraphs.forEach(paragraph => {
      let { isNeedNewLine, commonParentEl, translateElWrapper, translateEl, textNodeWrapperEls, isBreakByBrTag } = paragraph;

      if (isBreakByBrTag) {
        translateElWrapper.style.display = 'block';
        translateElWrapper.style.margin = '8px 0';
        textNodeWrapperEls[textNodeWrapperEls.length - 1].appendChild(translateElWrapper);
        return;
      }

      if (isNeedNewLine) {
        translateElWrapper.style.display = 'block';
        translateElWrapper.style.margin = '8px 0';
      } else {
        translateEl.before(this.createSpaceEl());
        translateEl.after(this.createSpaceEl());
      }

      if (textNodeWrapperEls.length > 1) {
        commonParentEl.appendChild(translateElWrapper);
      } else {
        textNodeWrapperEls[0].appendChild(translateElWrapper);
      }
    });
  }
  checkUrlIsMatched(url: string, patterns?: string | string[]) {
    const defaultPatterns = ['*://*/*', '*', '*://*'];
    const wildcardPlaceholder = 'arvin.chat';

    if (!url || !patterns || (typeof patterns === 'string' ? patterns = [patterns] : patterns = [...patterns], !patterns.length))
      return false;

    if (patterns.some(pattern => defaultPatterns.includes(pattern)))
      return true;

    try {
      const parsedUrl = new URL(url);
      parsedUrl.hash = '';
      parsedUrl.search = '';
      const sourceUrl = parsedUrl.href;
      const hostname = parsedUrl.hostname;

      return patterns.some(pattern => {
        if (pattern === hostname || defaultPatterns.includes(pattern))
          return true;

        if (!pattern.includes('*') && pattern.includes('://')) {
          const targetUrl = new URL(pattern);
          return targetUrl.pathname === '/' && !pattern.endsWith('/') ? targetUrl.hostname === hostname : this.isTwoUrlMatched(sourceUrl, pattern);
        }

        let protocol, targetPattern = pattern;
        if (pattern.includes('://')) {
          const parts = pattern.split('://');
          let prefix = parts[0];
          if (prefix === '*') {
            prefix = '*';
            pattern = `https://${parts[1]}`;
          }
        } else {
          protocol = '*';
          pattern = `https://${pattern}`;
        }

        let replacedPattern = pattern.replace(/\*/g, wildcardPlaceholder);
        let targetUrl = new URL(replacedPattern);
        let targetHostname = targetUrl.hostname;
        let targetPathname = targetUrl.pathname;

        if (targetPathname === '/' && targetPattern.replace('://', '').includes('/')) {
          targetPathname = '/*';
        }

        let regex = this.makeRegExp(`${protocol}:`, targetHostname.replaceAll(wildcardPlaceholder, '*'), targetPathname.replaceAll(wildcardPlaceholder, '*'));
        if (regex) {
          let sourceUrlObj = new URL(sourceUrl);
          sourceUrlObj.port = '';
          return regex.test(sourceUrlObj.href);
        }
        return false;
      });
    } catch {
      return false;
    }
  }
  makeRegExp(protocol: string, domain: string, path: string) {
    let regexPattern = domain ? '^' + protocol : '^';

    if (protocol === '*:') {
      regexPattern += '(http:|https:|file:)';
    } else {
      regexPattern += protocol;
    }
    regexPattern += '//';
    if (domain) {
      if (protocol === 'file:' || domain === '*') {
        regexPattern += '[^/]+?';
      } else {
        if (domain.startsWith('*.')) {
          regexPattern += '[^/]*?';
          domain = domain.substring(2);
        }
        regexPattern += domain.replace(/\./g, '\\.').replace(/\*/g, '[^/]*');
      }
    }
    if (path) {
      if (path === '*' || path === '/*') {
        regexPattern += '(/.*)?';
      } else if (path.includes('*')) {
        regexPattern += path.replace(/\*/g, '.*?') + '/?';
      } else {
        regexPattern += path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      }
    } else {
      regexPattern += '/?';
    }
    regexPattern += '$';
    return new RegExp(regexPattern);
  }
  isTwoUrlMatched(e: string, r: string) {
    let n = new URL(e);
    let i = new URL(r);
    return n.hostname === i.hostname && n.pathname === i.pathname && n.protocol === i.protocol && n.port === i.port;
  }
  toggleRenderType(e: string) {
    e === 'original' ? this.doReset() : this.doTranslate();
  }

  doReset() {
    this.cleanAllElEffect(this.translatableParagraphs || []);
    this.translatableParagraphs = [];
    this.intersectionObserverList.forEach(e => {
      e.disconnect();
    });
    this.intersectionObserverList = [];
    this.removeInjectCSS();
    this.removeMutationObserver();
    this.renderType = 'original';
  }
  cleanAllElEffect(e: TranslatableParagraph[]) {
    let r = `[${CUSTOM_CONFIG.CUSTOM_ATTR.TRANSLATABLE_NODE_PARENT_EL}=${CUSTOM_CONFIG.CUSTOM_ATTR_VALUE}]`;
    document.body.querySelectorAll(r).forEach(a => {
      this.removeAllCustomAttr(a);
    });
    let n = `[${CUSTOM_CONFIG.CUSTOM_ATTR.EXCLUDE_EL}=${CUSTOM_CONFIG.CUSTOM_ATTR_VALUE}]`;
    document.body.querySelectorAll(n).forEach(a => {
      this.removeAllCustomAttr(a);
    });
    let i = CUSTOM_CONFIG.TRANSLATABLE_NODE_WRAPPER_TAG;
    document.body.querySelectorAll(i).forEach(a => {
      let l = a.firstChild;
      a.after(l!);
      a.remove();
    });
    e.forEach(({ translateElWrapper }) => {
      translateElWrapper.remove();
    });
  }
  removeAllCustomAttr(e: HTMLElement | Element) {
    Array.from(e.attributes).forEach(({ name }) => {
      name.startsWith(CUSTOM_ATTR_PREFIX) && this.removeAttr(e, name);
    });
  }
  createSpaceEl() {
    const element = document.createElement(CUSTOM_CONFIG.SPACE_EL_TAG);
    element.innerHTML = '&nbsp;';
    return element;
  }
  isMarkAttr(e: HTMLElement | Element, r: string, n = CUSTOM_CONFIG.CUSTOM_ATTR_VALUE) {
    return e.getAttribute(r) === n;
  }
  setAttr(e: HTMLElement | Element, r: string, n = CUSTOM_CONFIG.CUSTOM_ATTR_VALUE) {
    e.setAttribute(r, n);
  }
  removeAttr(e: HTMLElement | Element, r: string) {
    e.removeAttribute(r);
  }
  injectCSS() {
    injectCss.inject(`
      .${CUSTOM_CONFIG.LOADING_EL_CLASS} {
				width: 12px;
				height: 12px;
				vertical-align: middle;
				display: inline-block;
				margin: 0 4px;
				border: 2px solid #6165F6;
				border-top-color: rgba(0, 0, 0, 0.1);
				border-right-color: rgba(0, 0, 0, 0.1);
				border-bottom-color: rgba(0, 0, 0, 0.1);
				border-radius: 100%;
				animation: monica-translate-loading-circle-animation infinite 0.75s linear;
				}
				@keyframes monica-translate-loading-circle-animation {
				0% {
					transform: rotate(0);
				}
				100% {
					transform: rotate(360deg);
				}
      }
      .${CUSTOM_CONFIG.DASHED_THEME_CLASS} {
				background-repeat: repeat-x;
				background: linear-gradient( to right, #6165F6 0%, #6165F6 50%, transparent 50%, transparent 100% ) repeat-x left bottom;
				background-size: 8px 2px;
				padding-bottom: 2px;
				}
      `);
  }
  removeInjectCSS() {
    injectCss.remove();
  }
  removeMutationObserver() {
    this.mutationObserver?.disconnect(),
      this.mutationObserver = null;
  }
  async detectPageLang() {
    let e = async (r: number) => {
      if (this.pageLang) {
        this.emit('pageLangDetected', this.pageLang);
        return;
      }
      if (r > 3)
        return;
      await sleep(r * 1000);
      let n = await this.detectTextLang(document.body.innerText);
      this.pageLang = n;
      e(r + 1);
    };
    e(0);
  }
  async detectTextLang(e: string) {
    let r = 'en';
    try {
      if (/^[\u3040-\u30FF0-9\s\p{P}]+$/gu.test(e))
        r = 'ja';
      else if (/^[\u4E00-\u9FFF0-9\s\p{P}]+$/gu.test(e))
        r = 'zh';
      else if (/^[\uac00-\ud7ff0-9\s\p{P}]+$/gu.test(e))
        r = 'ko';
      else if (/^[a-zA-Z0-9\s\p{P}]+$/gu.test(e))
        r = 'en';
      else {
        let { languages: n } = await browser.default.i18n.detectLanguage(e);
        n.length && (r = n.sort((a, l) => l.percentage - a.percentage)[0].language);
      }
      return standardizeLocale(r);
    } catch {
      return standardizeLocale(r);
    }
  }
  applyTranslationStyle() {
    console.log('applyTranslationStyle', this.parallelTranslation.applyDashedTheme);
    this.translatableParagraphs.forEach(e => {
      let r = e.translateEl;
      this.parallelTranslation.applyDashedTheme ? r.classList.add(CUSTOM_CONFIG.DASHED_THEME_CLASS) : r.classList.remove(CUSTOM_CONFIG.DASHED_THEME_CLASS);
    });
  }
  checkIsBlockPage() {
    let e = this.getContext()
      , r = location.protocol.indexOf('http') === -1
      , n = this.checkUrlIsMatched(location.href, e.config.blockUrls);
    this.isBlockCurPage = r || n;
  }
}
