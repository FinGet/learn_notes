import { foo } from './utils.js'

foo({foo:'12312'})

/*#__PURE__*/ foo() // foo函数只是读取了对象属性，没有意思，可以添加pure，进行treeshaking

// npx rollup input.js -f esm -o bundle.js