# Vue 之 MVVM

![](http://ww3.sinaimg.cn/large/006tNc79gy1g62ogp8qumj30ri0ic3zj.jpg)


> 基于数据劫持的一种双向绑定。Angular基于脏检查的双向绑定。

1. 模版编译
2. 数据劫持（Object.defineProperty）观察数据变化
3. Watcher（连接视图与数据劫持）发布-订阅

## fragment

```javascript
let fragment = document.createDocumentFragment();
```

> DocumentFragments 是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。

> 因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。



```javascript
var element  = document.getElementById('ul'); // assuming ul exists
var fragment = document.createDocumentFragment();
var browsers = ['Firefox', 'Chrome', 'Opera', 
    'Safari', 'Internet Explorer'];

browsers.forEach(function(browser) {
    var li = document.createElement('li');
    li.textContent = browser;
    fragment.appendChild(li);
});

element.appendChild(fragment);
```





MVVM这个类，接收一个`options`，简易版接收一个`el`绑定的节点，`data`数据。



两件事：

1. 编译`model`

2. 劫持`data`



## 编译model - compile



判断传入el的类型。

```javascript
this.el = this.isElementNode(el)?el:document.querySelector(el); // #app document.queryselector
```



- 先把这些真实的DOM移入到内存中 fragment

这样页面中不会显示dom结构，一种优化的方案。

- 编译模版- fragment

`fragment.childNodes`是一个类数组，然后就是遍历这些节点，把`v-model`指令，`{{}}`找出来替换掉



两个重要的方法： `compileElement`和`compileText`

⚠️ 如果是元素节点还需要递归编译，因为`fragment.childNodes`拿到的是第一子级。

v-model是元素属性，attributes。



```javascript
CompileUtil['model']()   

// 骚操作
updater: {
    // 文本更新
    textUpdater(node, value) {
        node.textContent = value;
    },
    // 输入框更新
    modelUpdater(node, value) {
       node.value = value;
    }
},
```

```javascript
expr.replace(/\{\{([^}]+)\}\}/g, function(...arguments) => {console.log(arguments)})
["{{obj.a}}", "obj.a", 0, "{{obj.a}},哈哈哈,{{message}}"]
```



```javascript
// 骚操作
return expr.reduce((prev, next) => {
    return prev[next];
}, vm.$data)
```



## Observe - 劫持

Object.defineProperty

- `enumerable` 当且仅当该属性的 configurable 为 true 时，该属性`描述符`才能够被改变，同时该属性也能从对应的对象上被删除。**默认为 false**。
- `configurable` 当且仅当该属性的`enumerable`为`true`时，该属性才能够出现在对象的枚举属性中。**默认为 false**
- `writable` 当且仅当该属性的`writable`为`true`时，`value`才能被赋值运算符改变。**默认为 false**。



把data中的所有数据都做响应式处理，全部劫持，这样无论是get，还是set都能监听到。



## Watcher - 监听



获取oldVal 当 set的时候，判断newVal与oldVal是否相等，不相等就走upadte。

数据劫持 - > 编译模版

在 编译模版时，给每一个需要监听的数据，new Watcher,在cb中重新渲染数据

在数据劫持的时候，如果data有Dep.target,就将它存入Dep里面(订阅),当set一个新值，就发布订阅notify，就会执行每一个watcher的update方法，如果`newVal !== oldVal`就会执行在编译时给这个watcher的cb，也就是重新获取data中的数据，进行渲染。


刚开始劫持数据时，是没有订阅的，当编译模版时，再new Watcher,然后进入getter就会订阅。

如果先编译，再劫持，那么并不会订阅，不订阅也就没有发布。


## v-model



完成了上面的整个编译，数据劫持、发布订阅的流程，v-model就是给input加一个`input`事件，实时改变

data中的数据，然后就会出发setter -> watcher.update -> update页面。