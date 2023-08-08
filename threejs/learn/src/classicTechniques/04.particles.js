import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();

/*
// 球体几何体
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
// 点材质
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);
*/

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// 自定义几何体
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

// 材质颜色 会 影响顶点颜色
// particlesMaterial.color = new THREE.Color('#ff88cc');
// particlesMaterial.map = particleTexture;

// 解决前面的点遮挡后面的点的问题
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;

// 解决点的边缘锯齿问题
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending

// 顶点颜色
particlesMaterial.vertexColors = true;

scene.add(particles);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();
const animate = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update particles
  // particles.rotation.y = elapsedTime * 0.2

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particlesGeometry.attributes.position.array[i3]
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }

  particlesGeometry.attributes.position.needsUpdate = true

  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();