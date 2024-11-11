<template>
  <div class="min-h-320px relative h-full bg-deep-0 p-12px rounded-12px flex-column-between" border="1px solid transparent hover:primary focus-within:primary">
    <div class="relative text-14px flex-1 h-full overflow-auto mini-scroll-bar" @scroll="handleScroll">
      <div v-if="!currentText" class="absolute c-deep-40 leading-20px">{{ placeholder }}</div>
      <div
        ref="element"
        v-stop
        class="div-input fs-14 relative min-h-full z-10 whitespace-pre-wrap"
        :contenteditable="browserName === 'Firefox' ? true : 'plaintext-only'"
        @input="handleInput"
        @paste="handlePaste"
        @keydown="handleKeydown"
        @mousemove="handleMouseMove"
      >
      </div>
      <div v-if="currentContent()" ref="errorRef" class="absolute w-full top-0 left-0 z-[1]" :style="{height: element?.clientHeight + 'px'}">
        <template v-for="(err, i) in grammarErrors" :key="i">
          <div :id="`highlight-div-${i+1}`">
            <div v-for="item in err.domRect" :key="item.x" class="absolute error-mark-element cursor-text pointer-events-auto" :style="computedErrStyle(item)"></div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="currentError && currentContent()" ref="errorWrapper"
         class="absolute z-[999] error-suggest bg-deep-0"
         :style="computedErrSuggestStyle(currentError.highlighRect)">
      <div class="c-deep-60 fs-12 px-6px mb-8px whitespace-nowrap">{{ $t('grammar.correct') }}</div>
      <template v-for="item in currentError.errorInfo.suggestions" :key="item">
        <div class="cp c-deep-80 fs-14 px-6px py-4px rounded-6px hover:bg-deep-20" @click="handleClickSuggest(item)">{{ item }}</div>
      </template>
      <div class="h-1px bg-deep-30 my-8px mx-6px"></div>
      <div class="cp flex items-center c-deep-80 fs-14 px-6px py-4px rounded-6px hover:bg-deep-20" @click="handleDismiss">
        <icon-custom-delete class="w-14px h-14px mr-6px"/>
        <span>{{ $t('btn.dismiss') }}</span>
      </div>
    </div>
    <div class="flex justify-between items-end">
      <div>
        <slot></slot>
      </div>
      <div v-if="props.maxLength > 0" class="c-deep-40 text-12px text-right"> <span :class="currentContent().length > maxLength ? 'c-danger-60' : ''">{{ currentContent().length }}</span>/{{ props.maxLength }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
	import { useDebounceFn } from '@vueuse/core';

	import { reportEventToAll } from '~public/composables/useSentry';
	import { getBrowserName } from '~public/utils';
	import { useFocus } from '~public/composables/useFocus';
	import { useMoveCursorToEnd } from '~public/composables/useMoveCursorToEnd';

	const props = defineProps({
		noHtml : {
			type : Boolean,
			default : true,
		},
		noNl : {
			type : Boolean,
			default : false,
		},
		placeholder: {
			type: String,
			default: '',
		},
		maxLength: {
			type: Number,
			default: -1,
		},
		errors: {
			type: Array as PropType<GrammarError[]>,
			default: () => [],
		}
	});

	const emit = defineEmits(['change', 'fix']);
	const element = ref<HTMLDivElement | null>(null);
	const currentText = ref<any>('');
	const browserName = getBrowserName();
	useFocus(element, 'grammar');
	useMoveCursorToEnd(element);
	const currentContent = () => {
		if (!element.value) return '';
		return element.value.innerText.trim();
	};
	const updateContent = (newContent: string) => {
		if (!element.value) return;
		element.value.innerText = newContent;
		currentText.value = newContent;
		element.value!.innerHTML = element.value!.innerHTML.replace(/<br>/g, '\n');
	};

	const handlePaste = (e: ClipboardEvent) => {
		if (browserName === 'Firefox') {
			e.preventDefault();
			let text = e.clipboardData?.getData('text/plain') || '';
			//insert text manually
			insertTextAtSelection(element.value!, text);
			handleInput();
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (browserName === 'Firefox') {
			if (e.key === 'Enter') {
				e.preventDefault();
				e.stopPropagation();
				//insert newline
				insertTextAtSelection(element.value!, '\n');
				handleInput();
			}
		}
	};

	const insertTextAtSelection = (div: HTMLDivElement, txt: string) => {
		//get selection area so we can position insert
		const sel = window.getSelection();
		const text = div.textContent;
		if (!sel || !text) return;
		let before = Math.min(sel.focusOffset, sel.anchorOffset);
		let after = Math.max(sel.focusOffset, sel.anchorOffset);
		//ensure string ends with \n so it displays properly
		let afterStr = text.substring(after);
		if (afterStr == '') afterStr = '\n';
		console.log(before, after);
		//insert content
		div.textContent = text.substring(0, before) + txt + afterStr;
		//restore cursor at correct position
		sel.removeAllRanges();
		let range = document.createRange();
		//childNodes[0] should be all the text
		range.setStart(div.childNodes[0], before + txt.length);
		range.setEnd(div.childNodes[0], before + txt.length);
		sel.addRange(range);
	};

	const handleInput = () => {
		currentError.value = null;
		if (element.value?.innerText.trim() === '') {
			emit('change', '');
			currentText.value = '';
			clearContent();
			return;
		}
		if (grammarErrors.value.length) {
			const selection = window.getSelection();
			if (!selection) return;
			const offset = selection.focusOffset;
			for (let i = 0; i < grammarErrors.value.length; i++) {
				const err = grammarErrors.value[i];
				const { offset: errOffset, endOffset: errEndOffset } = err.errorInfo;
				if (errOffset <= offset && offset <= errEndOffset) {
					grammarErrors.value.splice(i, 1);
					emit('fix', i, currentContent());
					break;
				}
			}
		}
		currentText.value = currentContent();
		emit('change', currentContent());
	};


	const currentError = ref<{
		highlighRect: { x1: number, x2: number, y1: number, y2: number },
		errIndex: number,
		errorInfo: GrammarError
	} | null>(null);

	const errorRef = ref<HTMLElement | null>(null);
	const currentErrorRef = ref<HTMLElement | null>(null);

	const changeActiveStatus = (i: number, j: number) => {
		clearAllErrorActive();
		currentErrorRef.value = errorRef.value?.querySelector(`#highlight-div-${i + 1}`)?.querySelectorAll('.error-mark-element')[j] as HTMLElement;
		currentErrorRef.value?.classList.add('active');
	};

	const clearAllErrorActive = () => {
		const activeErrors = errorRef.value?.querySelectorAll('.active');
		activeErrors?.forEach((err) => {
			err.classList.remove('active');
		});
	};
	
	const computedRelativePosition = (event: MouseEvent) => {
		const targetRect = element.value?.getBoundingClientRect();
		if (!targetRect) return { offsetX: event.offsetX, offsetY: event.offsetY };
		const offsetX = event.clientX - targetRect.left;
		const offsetY = event.clientY - targetRect.top;
		return { offsetX, offsetY };
	};

	const handleMouseMove = useDebounceFn((event: MouseEvent) => {
		const errors = [...grammarErrors.value];
		if (!errors.length) return;
		const { offsetX, offsetY } = computedRelativePosition(event);
		for (let i = 0; i < errors.length; i++) {
			const err = errors[i];
			const { highlightRangeRects } = err;
			for (let j = 0; j < highlightRangeRects.length; j++) {
				const { x1, x2, y1, y2 } = highlightRangeRects[j];
				if (x1 <= offsetX && offsetX <= x2 && y1 <= offsetY && offsetY <= y2) {
					changeActiveStatus(i, j);
					if (!currentError.value || currentError.value.errIndex !== i ) {
						currentError.value = {
							highlighRect: highlightRangeRects[j],
							errIndex: i,
							errorInfo: err.errorInfo
						};
						reportEventToAll({
							ap: {
								event_name: 'app',
								params: {
									grammar_fix_suggest_popup_show: null
								}
							},
							metaBase: {
								event_name: 'Grammar_Fix_Suggest_Popup_Show'
							}
						});
					}

					break;
				} else {
					clearAllErrorActive();
					currentError.value = null;
				}
			}
			if (currentError.value) {
				break;
			}
		}
	}, 100);

	const calculateRange = (offset: number, endOffset: number): DOMRect[] => {
		const range = new Range(); // Initialize a new Range object
		const { firstChild, childNodes } = element?.value || {} as HTMLDivElement;
		if (!firstChild || !childNodes) return [new DOMRect()];
		let cumulativeLength = 0; // Initialize the cumulative length of processed child nodes
		// Initialize objects to hold the start and end nodes and their respective positions
		const startInfo = {
			node: firstChild,
			startOffset: 0
		};
		const endInfo = {
			node: firstChild,
			endOffset: 0
		};
		// Iterate over each child node to find the start and end nodes for the range
		for (let child of Array.from(childNodes)) {
			// Calculate the new cumulative length of child nodes
			let nodeEndIndex = cumulativeLength + (child.textContent?.length || 0);
			// Check if the current node contains the start offset
			if (nodeEndIndex >= offset && cumulativeLength <= offset) {
				startInfo.node = child;
				startInfo.startOffset = offset - cumulativeLength;
			}
			// Check if the current node contains the end offset
			if (nodeEndIndex >= endOffset && cumulativeLength <= endOffset) {
				endInfo.node = child;
				endInfo.endOffset = endOffset - cumulativeLength;
			}
			// Update the cumulative length for the next iteration
			cumulativeLength = nodeEndIndex;
		}
		// Set the range start and end positions
		range.setStart(startInfo.node, startInfo.startOffset);
		range.setEnd(endInfo.node, endInfo.endOffset);
		return Array.from(range.getClientRects());
	};
	const grammarErrors = ref<{
		domRect: DOMRect[],
		errorInfo: GrammarError,
		// styles: any,
		highlightRangeRects: { x1: number, x2: number, y1: number, y2: number }[]
	}[]>([]);
	const computedErrStyle = (domRect: DOMRect) => {
		const boundRect = element.value?.getBoundingClientRect();
		return {
			left: domRect.left - boundRect!.left + 'px',
			top: domRect.top - boundRect!.top + 'px',
			height: domRect.height + 'px',
			width: domRect.width + 'px',
			zIndex: 1
		};
	};
	const errorWrapper = ref<HTMLElement | null>(null);
	const adjustWidth = (width: number) => {
		const errClientWidth = errorWrapper.value?.clientWidth || 0;
		const boxWidth = element.value?.clientWidth || 0;
		if (!(errorWrapper.value && errClientWidth === 0)) {
			if (errorWrapper.value && element.value && (width + errClientWidth) > boxWidth) {
				let dw = width + errClientWidth - boxWidth;
				return width - dw;
			}
			return width;
		}
	};

	const scrollTop = ref(0);
	const handleScroll = (event: UIEvent) => {
		const targetElement = event.target as HTMLElement;
		scrollTop.value = targetElement.scrollTop,
		currentError.value = null;
	};

	const computedErrSuggestStyle = (highlighRect: any) => {
		return {
			left: adjustWidth(highlighRect.x1 + 8) + 'px',
			top: highlighRect.y2 - scrollTop.value + 8 + 'px',
		};
	};
	watch(() => props.errors, (newVal) => {
		grammarErrors.value = [];
		newVal.forEach((err) => {
			const rangeRect = calculateRange(err.offset, err.endOffset);
			grammarErrors.value.push({
				domRect: rangeRect,
				errorInfo: err,
				highlightRangeRects: rangeRect.map(computedHighlightRect)
			});
		});
	}, { deep: true });

	const computedHighlightRect = (rect: DOMRect) => {
		const boundRect = element.value?.getBoundingClientRect();
		return {
			x1: rect.left - (boundRect?.left || 0),
			x2: rect.right - (boundRect?.left || 0),
			y1: rect.top - (boundRect?.top || 0),
			y2: rect.bottom - (boundRect?.top || 0)
		};
	};

	const handleResize = () => {
		if (!grammarErrors.value.length) return;
		currentError.value = null;
		grammarErrors.value.forEach((err) => {
			err.domRect = calculateRange(err.errorInfo.offset, err.errorInfo.endOffset);
			err.highlightRangeRects = err.domRect.map(computedHighlightRect);
		});
	};

	const handleClickSuggest = (suggestion: string) => {
		if (!currentError.value) return;
		reportEventToAll({
			ap: {
				event_name: 'app',
				params: {
					grammar_fix_suggest_popup_apply: null
				}
			},
			metaBase: {
				event_name: 'Grammar_Fix_Suggest_Popup_Apply'
			}
		});
		const { errIndex, errorInfo } = currentError.value;
		const { offset, endOffset } = errorInfo;
		const oldContent = currentContent();
		const newContent = oldContent.slice(0, offset) + suggestion + oldContent.slice(endOffset);
		const diff = newContent.length - oldContent.length;
		updateContent(newContent);
		if (diff !== 0) {
			for (let i = errIndex + 1 ; i < grammarErrors.value.length; i++) {
				const err = grammarErrors.value[i];
				err.errorInfo.offset += diff;
				err.errorInfo.endOffset += diff;
				err.domRect = calculateRange(err.errorInfo.offset, err.errorInfo.endOffset);
				err.highlightRangeRects = err.domRect.map(computedHighlightRect);
			}
		}
		grammarErrors.value.splice(errIndex, 1);
		currentError.value = null;
		emit('fix', errIndex, newContent);
	};

	const handleDismiss = () => {
		if (!currentError.value) return;
		reportEventToAll({
			ap: {
				event_name: 'app',
				params: {
					grammar_fix_suggest_popup_dismiss: null
				}
			},
			metaBase: {
				event_name: 'Grammar_Fix_Suggest_Popup_Dismiss'
			}
		});
		const { errIndex } = currentError.value;
		grammarErrors.value.splice(errIndex, 1);
		currentError.value = null;
		emit('fix', errIndex, currentContent());
	};

	const handleFixAll = () => {
		if (!grammarErrors.value.length) return;
		let newContent = currentContent();

		// Sort errors by offset in descending order to avoid offset change
		const sortedErrors = [...grammarErrors.value].sort((a, b) => b.errorInfo.offset - a.errorInfo.offset);
		sortedErrors.forEach(error => {
			console.log(newContent);
			const { offset, endOffset, suggestions } = error.errorInfo;
			newContent = newContent.substring(0, offset) + suggestions[0] + newContent.substring(endOffset);
			console.log(newContent);
		});
		updateContent(newContent);
		grammarErrors.value = [];
		emit('fix', -1, newContent);
	};


	const clearContent = () => {
		currentText.value = '';
		updateContent('');
		grammarErrors.value = [];
	};

	const observer = ref<ResizeObserver | null>(null);
	onMounted(() => {
		observer.value = new ResizeObserver(handleResize);
		observer.value.observe(element.value!);
	});

	onBeforeUnmount(() => {
		observer.value?.disconnect();
	});

	defineExpose({
		handleFixAll,
		clearContent,
	});
</script>

<style lang="less" scoped>
.div-input {
  outline: none;
}
.error-mark-element {
	border-bottom: 2px solid var(--danger-color-6);
	&.active {
		background-color: var(--danger-color-1);
	}
}
.error-suggest {
	padding: 16px;
	border-radius: 8px;
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
}
</style>
