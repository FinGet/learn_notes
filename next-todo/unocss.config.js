import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
} from 'unocss'

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons(),
	],
	shortcuts: [
		["flex-center", "flex justify-center items-center"],
		["flex-between", "flex justify-between items-center"],
		["flex-col-center", "flex flex-col justify-center items-center"],
		["cp", "cursor-pointer"],
	],
	rules: [
		
	],
});
