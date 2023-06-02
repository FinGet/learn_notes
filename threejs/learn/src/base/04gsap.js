import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
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
controls.enableDamping = true; // 阻尼
// controls.addEventListener('change', function() {
//   renderer.render(scene, camera)
// });
const ani1 = gsap.to(cube.position, {
  duration: 1, 
  delay: 1, 
  x: 2, 
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true, // 反向 
  onComplete: () => {
    console.log('onComplete');
  }
});
gsap.to(cube.rotation, {
  duration: 1, 
  delay: 1, 
  x: Math.PI * 2, 
  ease: 'power1.in',
  repeat: -1, // 重复次数 -1 无限
});

window.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'a':
      ani1.pause(); // 暂停
      break;
    case 'b':
      ani1.resume(); // 恢复
      break;
    case 'c':
      ani1.reverse(); // 反向
      break;
    case 'd':
      ani1.restart(); // 重启
      break;
  }
});

window.addEventListener('dblclick', () => {
  // 进入/退出全屏
  const fullScreenElement = document.fullscreenElement
  if(fullScreenElement) {
    document.exitFullscreen()
  } else {
    renderer.domElement.requestFullscreen()
  }
})

// 渲染
function animate() {
  controls.update(); // 更新控制器, 阻尼更真实
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 防止高分屏模糊
})

