(() => {
  // fn.js
  var fna = () => {
    console.log("fna");
  };

  // package.json
  var package_default = {
    name: "rollup-test",
    version: "1.0.0",
    main: "index.js",
    license: "MIT",
    scripts: {
      build: "rollup -c rollup.config.js"
    },
    dependencies: {
      "@rollup/plugin-json": "^4.1.0",
      rollup: "^2.77.3",
      "rollup-plugin-terser": "^7.0.2"
    },
    devDependencies: {
      "@rollup/plugin-babel": "^5.3.1",
      esbuild: "^0.15.1"
    }
  };

  // 105.png
  var __default = "data:image/png;base64,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";

  // txt:./1.txt
  var __default2 = ["jasjdf", "\u54C8\u54C8\u54C8", "\u52A0\u5F3A\u6237\u5916"];

  // index.js
  console.log("hello rollup!");
  console.log(__default);
  console.log(package_default);
  console.log(__default2);
  fna();
})();
