
import CryptoJS from 'crypto-js';

import { standardizeLocale } from './config';

import { randomUUID, sleep } from '~public/utils';
import { translateByAzure } from '~public/apis';
import { isWeb } from '~public/hooks/useStore';

interface TranslateConfig {
	fromLang: string;
	taskType: string;
	taskUid: string;
	textList: string[];
	toLang: string;
	textType?: string;
	originUrl?: string;
	originTitle?: string;
}

interface Paragraph {
	detectLang: string;
	id: string;
	text: string;
}
export interface MergedParagraph {
	merged: boolean;
	mergedText: string;
	paragraphs: Paragraph[];
	detectLang: string;
	textType: string;
}

interface CacheParagraph {
	cacheData: string;
	p: Paragraph;
}

export const rm = {
	AUTO_DETECT_LANG: 'auto-detect',
	FREE_TRANSLATE_API_DEFAULT_TIMEOUT_MS: 2000,
	GOOGLE_TRANSLATE_UNSUPPORTED_LANGS: ['yue', 'ba', 'lzh']
};

// translate cache storage
export class Storage {
	prefix: string;
	defaultValues: Record<string, any>;
	constructor(prefix: string, defaultValues: Record<string, any>) {
		this.prefix = prefix;
		this.defaultValues = defaultValues;
	}
	async get(key: string) {
		let value: any = null;
		if (isWeb) {
      value = await localStorage.getItem(`${this.prefix}-${key}`) || '';
      return value && JSON.parse(value);
    } else {
			value = await browser.default.storage.local.get(`${this.prefix}-${key}`);
			return value;
		}
	}
	async set(key: string, value: any) {
		if (isWeb) {
			await localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(value));
		} else {
			await browser.default.storage.local.set({ [`${this.prefix}-${key}`]: value });
		}
	}
	async getAll() {
		let keys = Object.keys(this.defaultValues);
		let values:any;
		if (isWeb) {
			values = await Promise.all(keys.map(async key => {
				let value = await localStorage.getItem(`${this.prefix}-${key}`) || '';
				return { [key]: value && JSON.parse(value) || value };
			}));
		} else {
			values = await browser.default.storage.local.get(keys);
		}
		return values;
	}
	encodeKey(key: string) {
		return this.prefix ? `${this.prefix}-${key}` : key;
	}
	decodeKey(key: string) {
		return this.prefix ? key.replace(`${this.prefix}-`, '') : key;
	}
	addChangeListener(callback: (data: any) => void) {
		if (isWeb) {
			window.addEventListener('storage', (e) => {
				if (e.key && e.key.startsWith(this.prefix)) {
					let key = this.decodeKey(e.key);
					let value = JSON.parse(e.newValue || '');
					callback({ [key]: value });
				}
			});
		} else {
			browser.default.storage.onChanged.addListener(n => {
				let i: any = {};
				if (this.prefix) {
					for (let [o, a] of Object.entries(n)) {
						if (o.startsWith(this.prefix)) {
							i[this.decodeKey(o)] = a.newValue;
						}
					}
				} else {
					for (let [o, a] of Object.entries(n)) {
						i[o] = a.newValue;
					}
				}
				callback(i);
			});
		}

	}
}

export const translateApi = {
	translateByEdgeTranslate: async ({ fromLang, toLang, token, params }: {
		fromLang: string;
		toLang: string;
		token: string;
		params: string;
	}) => {
		const url = 'https://api-edge.cognitive.microsofttranslator.com/translate';
		return await (await translateApi.request(`${url}?from=${fromLang}&to=${toLang}&api-version=3.0`, {
			headers: {
				accept: '*/*',
				authorization: `Bearer ${token}`,
				'cache-control': 'no-cache',
				'content-type': 'application/json',
				pragma: 'no-cache',
				'sec-ch-ua': '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'Referrer-Policy': 'strict-origin-when-cross-origin'
			},
			body: params,
			method: 'POST'
		})).json();
		// return responseData;
	},
	translateByGoogleTranslate: async ({ fromLang, toLang, textList }: {
		fromLang: string;
		toLang: string;
		textList: string[];
	}) => {
		let url = 'https://translate.googleapis.com/translate_a/single';
		const urlParams = new URLSearchParams({
			client: 'gtx',
			dt: 't',
			dj: '1',
			sl: fromLang,
			tl: toLang,
			q: textList.join(`\n`)
		});
		return await (await translateApi.request(`${url}?${urlParams.toString()}`)).json();
	},
	request: async (url: string, params?: RequestInit) => {
		try {
			let response = await fetch(url, params);
			return response.ok && response.status >= 200 && response.status < 400 ? response : Promise.reject();
		} catch (error: any) {
			return Promise.reject(error);
		}
	}
};

export default class TranslateService {
	// meta = {
	//   key: 'translate',
	//   name: 'TranslateService'
	// };
	dependencies = ['user'];
	defaultStorageValues = {
		edgeTranslateAuthData: null
	};
	edgeTranslateAuthData: {
		accessToken: string,
		accessTokenExpiresAt: number
	} | null = null;
	userInfo = null;
	freeTranslateServerList = [{
		type: 'edge-translate-free',
		available: false,
		timeout: 0
	}, {
		type: 'google-translate-free',
		available: false,
		timeout: 0
	}];
	storage = new Storage('arvin-translate', this.defaultStorageValues);
	translatedTextCacheMap: Record<string, any> = {};
	translateFreeApiTimeoutMs = rm.FREE_TRANSLATE_API_DEFAULT_TIMEOUT_MS;

	constructor() {
		this.onInit();
	}

	async translate({ paragraphs, taskUid, originUrl, originTitle, from, to }: {
		paragraphs: any[];
		taskUid: string;
		originUrl: string;
		originTitle: string;
		from: string;
		to: string;
	}, callback: (data: any[]) => void) {
		(!paragraphs || paragraphs.length <= 0) && callback([]);
		// console.log('translate', paragraphs);
		let { cachedParagraphs, needServiceTranslateParagraphs } = this.tryGetCachedParagraphs({
			paragraphs: paragraphs,
			from,
			to
		});
		let p = this.getCachedResult({
			cachedParagraphs,
			from,
			to
		});
		callback(p);
		let h = this.mergeParagraph(needServiceTranslateParagraphs);
		await this.translateParagraphGroups({
			originTitle,
			originUrl,
			paragraphGroups: h,
			taskUid,
			from,
			to,
			callback
		});
	}

	async translateByServer(transConfig: TranslateConfig) {
		let activeServer = await this.getActiveTranslateServer(transConfig);
		console.log('ActiveTranslateServer', activeServer);
		switch (activeServer) {
			case 'edge-translate-free':
			case 'google-translate-free':
				return this.translateByFreeTranslateServer(activeServer, transConfig);
			default:
				return this.translateByAzureTranslate(transConfig);
		}
	}
	async onInit() {
		await this.initStorageData();
		await this.syncEdgeTranslateAuthData();
		this.updateFastestFreeTranslateServer();
		// this.initTranslateFreeApiTimeout();
	}
	async initStorageData() {
		//   let { user: e } = this.services
		let { edgeTranslateAuthData: r } = await this.storage.getAll();
		this.edgeTranslateAuthData = r;
		this.storage.addChangeListener(i => {
			i.edgeTranslateAuthData !== void 0 && (this.edgeTranslateAuthData = i.edgeTranslateAuthData);
		});
	}

	async translateByEdgeTranslate(transConfig: TranslateConfig, token: string, n = false) {
		try {
			const _transConfig = this.normalizeCmdLocale(transConfig, 'edge-translate-free');
			const { textList, fromLang, toLang } = _transConfig;
			const d = textList.map(m => ({ Text: m }));
			const params = JSON.stringify(d);
			let responseData: any;
			if (isWeb) {
				responseData = await translateApi.translateByEdgeTranslate({
					fromLang,
					toLang,
					token,
					params
				});
			} else {
				responseData = await browser.default.runtime.sendMessage({
					type: 'translate',
					api: 'translateByEdgeTranslate',
					params: {
						fromLang,
						toLang,
						token,
						params
					}
				});
			}
			return {
				code: 0,
				msg: '',
				data: responseData
			};
		} catch (error) {
			return this.handleFreeTranslateServerError('edge-translate-free'),
				n ? Promise.reject(error) : this.translateByAzureTranslate(transConfig);
		}
	}
	edgeTranslateAuthDataIsValid(e: any) {
		if (!e) return false;
		let r = Date.now();
		return e.accessTokenExpiresAt * 1000 - r > 30 * 1000;
	}
	async syncEdgeTranslateAuthData() {
		setTimeout(() => {
			this.syncEdgeTranslateAuthData();
		}, 5 * 60 * 1000),
			await this.tryUpdateEdgeTranslateAuthData();
	}
	async tryUpdateEdgeTranslateAuthData(e = false) {
		this.edgeTranslateAuthDataIsValid(this.edgeTranslateAuthData) && !e || await this.forceUpdateEdgeTranslateAuthData();
	}
	async forceUpdateEdgeTranslateAuthData() {
		try {
			let url = 'https://edge.microsoft.com/translate/auth';
			const responseData = await (await this.request(url, {
				headers: {
					accept: '*/*',
					'cache-control': 'no-cache',
					pragma: 'no-cache',
					'sec-ch-ua': '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"Windows"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'sec-mesh-client-arch': 'x86_64',
					'sec-mesh-client-edge-channel': 'beta',
					'sec-mesh-client-edge-version': '113.0.1774.23',
					'sec-mesh-client-os': 'Windows',
					'sec-mesh-client-os-version': '10.0.19044',
					'sec-mesh-client-webview': '0',
					Referer: 'https://appsumo.com/',
					'Referrer-Policy': 'strict-origin-when-cross-origin'
				},
				body: null,
				method: 'GET'
			})).text();
			const authData = this.parseJWT(responseData);
			if (authData) {
				this.edgeTranslateAuthData = authData,
				await this.storage.set('edgeTranslateAuthData', authData);
			}
		} catch {
			this.edgeTranslateAuthData = null;
			await this.storage.set('edgeTranslateAuthData', null);
		}
	}
	parseJWT(token: string) {
		let r = token.split('.');
		if (r.length <= 1)
			throw new Error('invalid token');
		let n = r[1];
		if (!n)
			throw new Error('invalid base64 url token');
		let i = n.replace(/-/g, '+').replace(/_/g, '/');
		const result = decodeURIComponent(globalThis.atob(i).split('').map(function (l) {
			return `%${`00${l.charCodeAt(0).toString(16)}`.slice(-2)}`;
		}).join(''));
		const parseResult = JSON.parse(result);
		return {
			accessToken: token,
			accessTokenExpiresAt: parseResult.exp
		};
	}
	async translateByGoogleTranslate(transConfig: TranslateConfig, r = !1) {
		try {
			let n = this.normalizeCmdLocale(transConfig, 'google-translate-free');
			const { textList, fromLang, toLang } = n;
			textList.forEach(f => {
				f.replace(/\n/g, '');
			});
			let responseData: any;
			if (isWeb) {
				responseData = await translateApi.translateByGoogleTranslate({
					fromLang,
					toLang,
					textList
				});
			} else {
				responseData = await browser.default.runtime.sendMessage({
					type: 'translate',
					api: 'translateByGoogleTranslate',
					params: {
						fromLang,
						toLang,
						textList,
					}
				});
			}

			const h = this.parseGoogleTranslateResult(responseData, toLang);
			return {
				code: 0,
				msg: '',
				data: h
			};
		} catch (n) {
			return this.handleFreeTranslateServerError('google-translate-free'),
				r ? Promise.reject(n) : this.translateByAzureTranslate(transConfig);
		}
	}
	parseGoogleTranslateResult(responseData: any, toLang: string) {
		let { paragraphGroup, sentences, src } = responseData;
		const result: {
			detectedLanguage: {
				language: string,
				score: number
			},
			translations: {
				text: string,
				to: string
			}[]
		}[] = [];

		(sentences || paragraphGroup).reduce((u: string, d: { trans: string }) => u + d.trans, '').split(`\n`).forEach((text: string) => {
			result.push({
				detectedLanguage: {
					language: src,
					score: 1
				},
				translations: [{
					text,
					to: toLang
				}]
			});
		});
		return result;
	}
	async translateByAzureTranslate(e: TranslateConfig) {
		let r = this.normalizeCmdLocale(e, 'azure');
		const { textList, fromLang, toLang } = r;
		const data = await translateByAzure({
			source_language_code: fromLang,
			target_language_code: toLang,
			sentences: textList
		});
		return {
			code: 0,
			msg: '',
			data
		};
	}
	async getActiveTranslateServer(e: TranslateConfig) {
		// if (!this.shouldUseFreeServerForParallelTranslate())
		// 	return 'azure';

		// get available free server
		const freeList = this.getFastFreeTranslateServerList();
		// console.log('available freeList', freeList);
		let type = freeList[0]?.type;
		if (type === 'google-translate-free') {
			try {
				let i = e.textList.join('');
				let languages:any[] = [];
				if (isWeb) {
					languages = [navigator.language];
				} else {
					const detectLang = await browser.default.i18n.detectLanguage(i);
					languages = detectLang.languages;
				}
				// google translate does not support some languages
				languages.length > 1 && (type = freeList[1]?.type);
			} catch {
				return 'azure';
			}
		}
		if (type === 'edge-translate-free') {
			return this.edgeTranslateAuthDataIsValid(this.edgeTranslateAuthData) ? type : 'azure';
		}
		if (type === 'google-translate-free') {
			let { toLang, fromLang } = this.normalizeCmdLocale(e, 'google-translate-free');
			return rm.GOOGLE_TRANSLATE_UNSUPPORTED_LANGS.includes(toLang) || rm.GOOGLE_TRANSLATE_UNSUPPORTED_LANGS.includes(fromLang) ? 'azure' : type;
		}
		return 'azure';
	}
	async handleFreeTranslateServerError(type: string) {
		if (type === 'edge-translate-free') {
			await this.storage.set('edgeTranslateAuthData', null);
			this.tryUpdateEdgeTranslateAuthData(!0);
		}
		this.freeTranslateServerList.some(r => {
			if (r.type === type) {
				r.available = false;
				return true;
			} else {
				return false;
			}
		});
	}
	getFastFreeTranslateServerList() {
		return this.freeTranslateServerList.filter(r => r.available && r.timeout < this.translateFreeApiTimeoutMs).sort((r, n) => r.timeout - n.timeout);
	}
	async updateFastestFreeTranslateServer() {
		let e = {
			fromLang: rm.AUTO_DETECT_LANG,
			toLang: 'fr',
			taskType: 'translation:translate',
			taskUid: randomUUID(),
			textList: ['A translation service should translate this text properly']
		};
		this.freeTranslateServerList.forEach(r => {
			let n = Date.now();
			this.translateByFreeTranslateServer(r.type, e, true).then(() => {
				let i = Date.now();
				r.timeout = i - n;
				r.available = true;
			}).catch(() => {
				r.available = false;
				r.timeout = -1;
			});
		});
		await sleep(5 * 60 * 1000);
		this.updateFastestFreeTranslateServer();
	}
	translateByFreeTranslateServer(activeServer: string, r: TranslateConfig, n = false) {
		switch (activeServer) {
			case 'edge-translate-free':
				return this.translateByEdgeTranslate(r, this.edgeTranslateAuthData?.accessToken || '', n);
			case 'google-translate-free':
				return this.translateByGoogleTranslate(r, n);
			default:
				return this.translateByAzureTranslate(r);
		}
	}
	// shouldUseFreeServerForParallelTranslate() {
	//   //   let e = this.userInfo?.disabledFeatures;
	//   //   return e ? !e.includes('sidebar_parallel_translate_use_free_server') : !1;
	//   return true;
	// }
	mergeParagraph(paragraphs: Paragraph[]) {
		let mergedParagraphs: MergedParagraph[] = [];
    
    const addParagraphToMerged = (paragraph: Paragraph) => {
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
					addParagraphToMerged(paragraph);
				}
			} else {
				addParagraphToMerged(paragraph);
			}
		});
		return mergedParagraphs;
	}
	findMatchedParagraphGroup(e: Paragraph, r: MergedParagraph[]) {
		return r.find(({ merged, detectLang }) => !merged && detectLang === e.detectLang);
	}
	tryGetCachedParagraphs({ paragraphs, from, to }: {
		paragraphs: any[];
		from: string;
		to: string;
	}) : {
		needServiceTranslateParagraphs: Paragraph[];
		cachedParagraphs: Paragraph[];
	} {
		let nonCachedParagraphs = [...paragraphs].filter(paragraph => !(this.getParagraphCacheKey({
			p: paragraph,
			from,
			to
		}) in this.translatedTextCacheMap));

		let cachedParagraphs = paragraphs.filter(paragraph => this.getParagraphCacheKey({
			p: paragraph,
			from,
			to
		}) in this.translatedTextCacheMap);

		return {
			needServiceTranslateParagraphs: nonCachedParagraphs,
			cachedParagraphs: cachedParagraphs
		};
	}
	async setTranslateToCache(e: CacheParagraph[], from: string, to: string) {
		e.forEach(({ p, cacheData }) => {
			this.translatedTextCacheMap[this.getParagraphCacheKey({
				p,
				from,
				to
			})] = cacheData;
		});
	}
	getParagraphCacheKey({ p, from, to }: {
		p: Paragraph;
		from: string;
		to: string;
	}) {
		return CryptoJS.HmacSHA256(`$ai-${to}-${from}-${p.text}`, 'arvin').toString().substring(8, 24);
	}
	getCachedResult({ cachedParagraphs, from, to }: {
		cachedParagraphs: any[];
		from: string;
		to: string;
	}) {
		let result = [];
		result.push(...cachedParagraphs.map(o => {
			let a = this.translatedTextCacheMap[this.getParagraphCacheKey({
				p: o,
				from,
				to
			})];
			return {
				...o,
				result: a,
				error: null
			};
		}));
		return	[...result];
	}
	async translateParagraphGroup({ originTitle, originUrl, paragraphGroup, taskUid, from, to, callback }: {
		originTitle: string;
		originUrl: string;
		paragraphGroup: MergedParagraph;
		taskUid: string;
		from: string;
		to: string;
		callback: (data: any[]) => void;
	}): Promise<void> {
		let results = [];
		let { textType, paragraphs } = paragraphGroup;

		try {
			let translations = await this.translateByServer({
				fromLang: from,
				taskType: 'translation:translate',
				taskUid: taskUid,
				textList: paragraphs.map(paragraph => paragraph.text),
				toLang: to,
				textType: textType,
				originUrl: originUrl,
				originTitle: originTitle
			});

			// console.log('Translations by server:', translations);

			let cacheDataArray: any = [];
			results.push(...translations.data.map((translation: any, index: number) => {
				let translatedText = translation.translations[0].text;
				let paragraph = paragraphs[index];
				cacheDataArray.push({
					p: paragraph,
					cacheData: translatedText
				});

				return {
					id: paragraph.id,
					text: paragraph.text,
					detectLang: paragraph.detectLang,
					result: translatedText,
					error: null
				};
			}));

			this.setTranslateToCache(cacheDataArray, from, to);
			callback(results);
		} catch (error) {
			results.push(...paragraphs.map(paragraph => ({
				id: paragraph.id,
				text: paragraph.text,
				detectLang: paragraph.detectLang,
				result: '',
				error: error
			})));

			callback(results);
		}
	}
	async translateParagraphGroups({ paragraphGroups: e, originTitle: r, originUrl: n, taskUid: i, from: o, to: a, callback: l }: {
		paragraphGroups: MergedParagraph[];
		originTitle: string;
		originUrl: string;
		taskUid: string;
		from: string;
		to: string;
		callback: (data: any[]) => void;
	}) {
		await Promise.all(e.map(async u => await this.translateParagraphGroup({
			originTitle: r,
			originUrl: n,
			paragraphGroup: u,
			taskUid: i,
			from: o,
			to: a,
			callback: l
		})));
	}
	async request(url: string, params?: RequestInit) {
		try {
			let response = await fetch(url, params);
			return response.ok && response.status >= 200 && response.status < 400 ? response : Promise.reject();
		} catch (error: any) {
			return Promise.reject(error);
		}
	}
	normalizeCmdLocale(e: TranslateConfig, freeTranslateType: string): TranslateConfig {
		// console.log('normalizeCmdLocale', e);
		let n = { ...e };
		n.fromLang = standardizeLocale(n.fromLang);
		n.fromLang === rm.AUTO_DETECT_LANG && (freeTranslateType === 'google-translate-free' ? n.fromLang = 'auto' : n.fromLang = '');
		n.fromLang = standardizeLocale(n.fromLang);
		n.toLang = standardizeLocale(n.toLang);
		return {
			...n
		};
	}
	// async initTranslateFreeApiTimeout() {
	//   //   let { user } = this.services;
	//   //   user.on('staticConfigChange', n=>{
	//   //       this.translateFreeApiTimeoutMs = n?.translateFreeApiTimeoutMs || rm.FREE_TRANSLATE_API_DEFAULT_TIMEOUT_MS;
	//   //   }
	//   //   );
	//   //   let r = await user.getStaticConfig();
	//   //   this.translateFreeApiTimeoutMs = r?.translateFreeApiTimeoutMs || rm.FREE_TRANSLATE_API_DEFAULT_TIMEOUT_MS;
	// }
}