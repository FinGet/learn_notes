import * as THREE from 'three';
import {GUI} from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
// 1.创建3D场景对象Scene(创建一个3维世界)
const scene = new THREE.Scene();

// 2.创建一个模型
// a.创建一个几何图形
const geometry = new THREE.BoxGeometry(100, 100, 100);
console.log(geometry)
// b.创建一个材质,设置颜色
const material = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  shininess: 20, //高光部分的亮度，默认30
  specular: 0xf1f1f1, //高光部分的颜色
});

// c.创建一个网格模型(几何图形+材质=网格模型)
const mesh = new THREE.Mesh(geometry, material);
// d.设置网格模型的位置
mesh.position.set(0, 10, 0);
// 3.将网格模型添加到场景中
scene.add(mesh);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.position.set(400, 200, 200);
scene.add(pointLight);


// 4.创建相机对象
// a.定义相机渲染输出的画布大小
const width = 800;
const height = 600;
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 600);
camera.position.set(200, 200, 200);

// 5.相机镜头对准的位置
// camera.lookAt(0, 10, 0);
camera.lookAt(mesh.position);

// 6.创建渲染器对象
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 开启抗锯齿
})
renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
renderer.setClearColor(0x444444, 1); // 设置背景颜色
renderer.setSize(width, height);

// 7.执行渲染操作
// renderer.render(scene, camera);

// 8.将渲染器的输出（此处是Canvas元素）插入到body
document.body.appendChild(renderer.domElement);

 // 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
    // renderer.render(scene, camera); //执行渲染操作
});//监听鼠标、键盘事件

const gui = new GUI({
  name: 'CUB',
  width: 300
});

console.log(gui.domElement)


const ani = gsap.to(mesh.rotation, {
  duration: 1, 
  // delay: 1, 
  x: Math.PI * 2, 
  ease: 'power1.out',
  repeat: -1, // 重复次数 -1 无限
})
ani.pause()

const obj = {
  x:10,
  color:0x00ffff,
  scale: 1,
  bool: false,
  rotate: () => {
    if(ani.isActive()) {
      ani.pause()
    } else {
      ani.resume()
    }
  }
};
gui.addColor(obj, 'color').name('材质颜色').onChange(function(value){
  mesh.material.color.set(value);
});

gui.add(obj, 'x', 0, 180).onChange(function (value) {
  mesh.position.x = value;
});

// 参数3数据类型：数组(下拉菜单)
gui.add(obj, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
  mesh.position.y = value;
});

// 参数3数据类型：对象(下拉菜单)
gui.add(obj, 'scale', {
    left: -100,
    center: 0,
    right: 100
    // 左: -100,//可以用中文
    // 中: 0,
    // 右: 100
}).name('位置选择').onChange(function (value) {
    mesh.position.x = value;
});

gui.add(obj, 'bool').name('是否旋转');
gui.add(obj, 'rotate').name('点击旋转')
gui.add(mesh.material, 'wireframe')

// gui界面上增加交互界面，改变obj对应属性
const folder = gui.addFolder( 'Camera Options' )
folder.add(camera.position, 'x', 0, 500).step(0.1).name('position.x');
folder.add(camera.position, 'y', 0, 500).name('position.y');
folder.add(camera.position, 'z', 0, 500).name('position.z');


const folder1 = gui.addFolder( 'Light Options' )
folder1.add(pointLight, 'intensity', 0, 2.0);
folder1.add(pointLight.position, 'x', 0, 1000);
folder1.add(pointLight.position, 'y', 0, 1000);
folder1.add(pointLight.position, 'z', 0, 1000);


function render() {
  if (obj.bool) mesh.rotateY(0.01);
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}
render();