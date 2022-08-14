import json from '@rollup/plugin-json'
import {terser} from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel';
import test from './plugins/test'
export default {
	input: 'index.js',
	output: [
		{
			// dir: 'dist',
			file: 'dist/bundle.um.js',
			format: 'umd',
			name: 'test', 
			// plugins: [terser()] // 压缩
		},
		{
			// dir: 'dist',
			file: 'dist/bundle.es.js',
			format: 'es',
			// plugins: [terser()]
		},
	],
	plugins: [
		json(),
		test(),
		babel({
			exclude: "node_modules/**",
			presets: ['@babel/preset-env'] // 转换为es5
		})
	]
}