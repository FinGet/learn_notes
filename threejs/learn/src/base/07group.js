import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);
const colors = [0xff0000, 0x00ff00, 0x0000ff];
for (let i = 0; i < 10; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: colors[i % 3]});
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = Math.random() * 10 - 5;
  cube.position.y = Math.random() * 10 - 5;
  cube.position.z = Math.random() * 10 - 5;
  group.add(cube);
}

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

// 渲染
function animate(time) {

  group.rotation.x += 0.01;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


