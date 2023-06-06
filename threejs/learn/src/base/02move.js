import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();

// 创建图形
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);


// 添加图形到场景
scene.add(cube);

// 坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
// controls.addEventListener('change', function() {
//   renderer.render(scene, camera)
// });


// 渲染
function animate(time) {
  // // 旋转
  // cube.rotation.x += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;


  // // cube.position.set(0, 0, 0);
  // // 移动
  // cube.position.x += 0.01;
  // if(cube.position.x > 4) {
  //   cube.position.x = 0;
  // }
  // // 缩放
  // cube.scale.x += 0.01;
  // cube.scale.y += 0.01;
  // if(cube.scale.x > 2) {
  //   cube.scale.x = 1;
  // }
  // if(cube.scale.y > 2) {
  //   cube.scale.y = 1;
  // }

  const t = time * 0.001; // 秒
  const radius = 1;
  const speed = 2;
  // cube.position.x = Math.cos(t * speed) * radius;
  
  // console.log('mesh', cube.position.length()); // 获取向量长度

  // console.log(cube.position.distanceTo(camera.position)); // 获取两个向量之间的距离

  // console.log(cube.position.normalize()); // 归一化 向量长度为1

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


