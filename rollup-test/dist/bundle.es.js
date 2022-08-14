// tree shaking
var fna = function fna() {
  console.log('fna');
};
console.log("test");

var name = "rollup-test";
var version = "1.0.0";
var main = "index.js";
var license = "MIT";
var scripts = {
	build: "rollup -c rollup.config.js"
};
var dependencies = {
	"@rollup/plugin-json": "^4.1.0",
	rollup: "^2.77.3",
	"rollup-plugin-terser": "^7.0.2"
};
var devDependencies = {
	"@rollup/plugin-babel": "^5.3.1"
};
var pkg = {
	name: name,
	version: version,
	main: main,
	license: license,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies
};

console.log("test");

console.log('hello rollup!');
console.log(pkg);
fna();
console.log("test");

export { fna, pkg };
