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
const axesHelper = new THREE.AxesHelper(2);
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

const clock = new THREE.Clock();
// 渲染
function animate() {
  const elapsedTime = clock.getElapsedTime(); // 从开始到现在的时间
  console.log(elapsedTime);
  const delta = clock.getDelta(); // 间隔时间
  console.log('delta time', delta);

  const t = elapsedTime % 5;
  cube.position.x = Math.cos(t) * 2;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


