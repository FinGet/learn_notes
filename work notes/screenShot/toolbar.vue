<template>
  <div ref="toolbar" class="arvin-screen-shot-toolbar" :style="toolBarStyle">
    <div class="arvin-screen-shot-tools">
      <template v-for="item in tools" :key="item">
        <Tooltip :content="$t(`screen_shot.${item}`)" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool(item)">
          <button :class="['arvin-screen-shot-tool-btn', controller.currentTool === item ? 'active' : '']">
            <svg-icon :size="16" :name="item === 'arrow' ? 'arrow-line' : item"></svg-icon>
          </button>
        </Tooltip>
      </template>
      <template v-if="scene === 'screenShot'">
        <div class="divide-line"></div>
        <Tooltip :content="$t('screen_shot.chat_tip')" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool('chat')">
          <div class="arvin-screen-shot-action">
            <icon-custom-message class="tool-icon"/>
            <span>{{ $t('screen_shot.chat') }}</span>
          </div>
        </Tooltip>
        <Tooltip :content="$t('screen_shot.extract_tip')" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool('extract')">
          <div class="arvin-screen-shot-action">
            <icon-custom-ocr-light class="tool-icon"/>
            <span>{{ $t('screen_shot.extract') }}</span>
          </div>
        </Tooltip>
      </template>
      <div class="divide-line"></div>
      <Tooltip :content="$t('btn.undo') + ` (${getUndoKey()})`" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool('undo')">
        <button :class="['arvin-screen-shot-tool-btn', !controller.canUndo ? 'disabled' : '']" :disable="!controller.canUndo">
          <icon-custom-redo class="tool-icon"/>
        </button>
      </Tooltip>
      <Tooltip :content="$t('btn.download')" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool('download')">
        <button class="arvin-screen-shot-tool-btn">
          <icon-custom-download class="tool-icon"/>
        </button>
      </Tooltip>
      <Tooltip :content="$t('btn.close') + ' (esc)'" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool('close')">
        <button class="arvin-screen-shot-tool-btn">
          <icon-custom-close class="tool-icon"/>
        </button>
      </Tooltip>
      <Tooltip :content="$t('btn.copy') + ' (⏎)'" :handleClose="closeTooltip" :is-icon="false" @click="handleClickTool('copy')">
        <button class="arvin-screen-shot-tool-btn">
          <icon-custom-ok class="tool-icon"/>
        </button>
      </Tooltip>
    </div>
    <div v-if="controller.currentTool" class="arvin-screen-setting-panel">
      <div class="setting-panel-arrow" :style="{left: arrowLeftPos}"></div>
      <div class="setting-panel-inner">
        <div class="size-adn-color-setting" :style="{marginLeft: controller.currentTool === 'mosaic' ? '112px' : '0'}">
          <template v-if="controller.currentTool === 'text'">
            <el-dropdown :teleported="false" trigger="click" popper-class="arvin-font-size-select" @command="handleConfigChange($event, 'size')" @visible-change="handleVisibleChange">
              <div :class="['font-size-select', isSelecting ? 'active' : '']">
                <span>{{ controller.currentToolConfig.size }}</span>
                <icon-custom-arrow/>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="font-size-select-wrapper">
                  <el-dropdown-item v-for="size in fontSizes" :key="size" :command="size" :class="['font-size-select-item',  controller.currentToolConfig.size === size ? 'active' : '']">
                    {{ size }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <template v-for="size in sizeOptions" :key="size">
              <div class="action-btn" @click="handleConfigChange(size, 'size')">
                <div :class="['size-btn', controller.currentToolConfig.size === size ? 'active' : '']" :style="{width: size + 'px', height: size + 'px', borderRadius: size/2 + 'px'}"></div>
              </div>
            </template>
          </template>
          <template v-if="controller.currentTool !== 'mosaic'">
            <div class="divide-line"></div>
            <template v-for="c in colors" :key="c">
              <div class="action-btn" @click="handleConfigChange(c, 'color')">
                <div :class="['color-btn', c === '#ffffff' ? 'white-btn' : '']" :style="{background: c}">
                  <icon-custom-ok v-if="controller.currentToolConfig.color === c"/>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
	import { ElDropdown } from 'element-plus';


	import { RectInfo } from './type';
	import { tools, colors, fontSizes, sizeOptions } from './config';

	import { getUndoKey } from '~public/utils';
	import Tooltip from '~public/components/Tooltip.vue';
	
	const props = defineProps({
		position: {
			type: Object as PropType<RectInfo>,
			default: () => ({
				x: 0,
				y: 0,
				with: 0,
				height: 0
			})
		},
		scene: {
			type: String,
			default: 'screenShot'
		},
		disabledTools: {
			type: Array as PropType<string[]>,
			default: () => []
		},
		controller: {
			type: Object as PropType<any>,
			default: null
		},
		onToolClick: {
			type: Function as PropType<(tool: string, check?: boolean) => void>,
			default: () => ({})
		},
	});

	// tooltip mount arvinComponent, so we need to handle the close event
	const closeTooltip = ref(false);
	const handleClickTool = (tool: string) => {
		let check = true; 
		if (tools.includes(tool)) {
			check = tool !== props.controller.currentTool;
		}
		props.onToolClick(tool, check);
	};

	const toolbar = ref(null);
	const toolBarStyle: any = ref({
		top: '0px',
		right: '0px',
		opacity: 0,
		visibility: 'hidden',
		pointerEvents: 'none'
	});
	const computedPosition = () => {
		const { x, y, width, height } = props.position;
		if (!toolbar.value) return;
		const { innerWidth, innerHeight } = window;
		const { clientWidth, clientHeight } = toolbar.value;
		const offset = 8;
		let z = y + height + offset;
		if (z + clientHeight > innerHeight) {
			let Q = y - clientHeight - offset;
			Q > 0 ? z = Q : width > clientWidth && (z = y + height - clientHeight - offset);
		}
		let j = innerWidth - (x + width);
		j < 0 ? j = clientWidth : j > innerWidth - clientWidth && (j = innerWidth - clientWidth);
		toolBarStyle.value.top = z + 'px';
		toolBarStyle.value.right = j + 'px';
		toolBarStyle.value.visibility = 'visible';
		toolBarStyle.value.pointerEvents = 'auto';
	};

	watch(() => props.controller?.highlightAreaDragging, (val) => {
		toolBarStyle.value.opacity = val ? 0 : 1;
	}, { immediate: true });

	const arrowLeftPos = computed(() => {
		const index = tools.indexOf(props.controller.currentTool);
		return index === -1 ? '0px' : `${20 + index * 36}px`;
	});

	const isSelecting = ref(false);
	const handleVisibleChange = (visible: boolean) => {
		isSelecting.value = visible;
	};
	const handleConfigChange = (configValue: string | number, configKey: string) => {
		props.controller.setToolConfig({
			...props.controller.currentToolConfig,
			[configKey]: configValue
		});
	};

	onMounted(() => {
		computedPosition();
	});

	onBeforeUnmount(() => {
		closeTooltip.value = true;
	});
</script>

<style scoped>

</style>