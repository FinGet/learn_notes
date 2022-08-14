console.log('hello rollup!')

import {fna} from './fn'
import pkg from './package.json'
import png from './105.png'
import text from './1.txt';
console.log(png)
console.log(pkg)
console.log(text)
fna()

export {
  fna,
  pkg
}