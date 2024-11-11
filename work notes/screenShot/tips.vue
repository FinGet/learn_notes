<template>
  <div ref="tipsRef" class="rect-tips" :style="tipStyle">
    {{Math.round(position.width)}} × {{ Math.round(position.height) }}
  </div>
</template>

<script setup lang="ts">
	import { RectInfo } from './type';

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
	});
	const tipsRef = ref(null);
	const tipStyle = ref<any>({
		top: '0px',
		left: '0px',
		visibility: 'hidden'
	});
	const computedPosition = () => {
		if (!tipsRef.value) return;
		const { x, y, height } = props.position;
		let { clientHeight: d } = tipsRef.value;
		const p = 8;
		let h = y - d - p;
		if (h<0) {
			h = y + height + p;
		}   
		tipStyle.value = {
			top: h + 'px',
			left: x + 'px',
			visibility: h < 0 ? 'hidden' : 'visible'
		};    
	};

	onMounted(() => {
		computedPosition();
	});
</script>

<style scoped>

</style>