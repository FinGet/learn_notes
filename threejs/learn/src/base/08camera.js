import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// 坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(cube.position);



// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);

const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (event) =>
{
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = - (event.clientY / window.innerHeight - 0.5)

  console.log(cursor.x, cursor.y)
})
// 渲染
function animate(time) {
  // camera.position.x = cursor.x
  // camera.position.y = cursor.y

  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
  camera.position.y = cursor.y * 3
  camera.lookAt(cube.position)
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


