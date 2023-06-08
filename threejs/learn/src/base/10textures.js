import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';
import gsap from 'gsap';
// 创建场景
const scene = new THREE.Scene();

// 创建图形

const loadingManager = new THREE.LoadingManager() // 加载管理器

loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

const colorTexture = textureLoader.load('/textures/door/color.jpg')
const checkerboardTexture = textureLoader.load('/textures/checkerboard-8x8.png')
const minecraftTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// // 纹理重复
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3

// // colorTexture.wrapS = THREE.RepeatWrapping
// // colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// 纹理偏移
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5



const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// const geometry = new THREE.ConeGeometry(1, 1, 32) // 圆锥
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100) // 圆环

console.log(geometry.attributes.uv)

const material = new THREE.MeshBasicMaterial({ 
  map: colorTexture
});
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

const gui = new GUI({
  name: 'CUB',
  width: 300
});

const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(cube.rotation, {duration: 3, y: cube.rotation.y + Math.PI * 2})
  },
  reset: () => {
    gsap.to(cube.rotation, {duration: 1, x: 0, y: 0, z: 0})
  },
  currentMap: colorTexture,
  textures: ['colorTexture', 'checkerboardTexture', 'minecraftTexture', 'alphaTexture', 'heightTexture', 'normalTexture', 'ambientOcclusionTexture', 'metalnessTexture', 'roughnessTexture'],
  map: {
    colorTexture,
    checkerboardTexture,
    minecraftTexture,
    alphaTexture,
    heightTexture,
    normalTexture,
    ambientOcclusionTexture,
    metalnessTexture,
    roughnessTexture
  },
  wrap: ['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping'],
  minFilters: ['NearestFilter', 'LinearFilter', 'NearestMipMapNearestFilter', 'NearestMipMapLinearFilter', 'LinearMipMapNearestFilter', 'LinearMipMapLinearFilter'],
  magFilters: ['NearestFilter', 'LinearFilter'],
}

gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color)
})
gui.add(parameters,'currentMap', parameters.textures).onChange((key) => {
  material.map = parameters.map[key]
  parameters.currentMap = parameters.map[key]
  // material.needsUpdate = true
})

gui.add(parameters, 'spin')
gui.add(parameters, 'reset')


gui.add(parameters.currentMap, 'wrapS', parameters.wrap).onChange(key => {
  parameters.currentMap.wrapT = THREE[key]
  parameters.currentMap.needsUpdate = true
})
gui.add(parameters.currentMap, 'wrapT', parameters.wrap).onChange(key => {
  parameters.currentMap.wrapT = THREE[key]
  parameters.currentMap.needsUpdate = true
})
gui.add(parameters.currentMap.repeat, 'x', 1, 10).step(1).name('repeatX')
gui.add(parameters.currentMap.repeat, 'y', 1, 10).step(1).name('repeatY')
gui.add(parameters.currentMap.offset, 'x', 0, 1).step(0.01).name('offsetX')
gui.add(parameters.currentMap.offset, 'y', 0, 1).step(0.01).name('offsetY')
gui.add(parameters.currentMap.center, 'x', 0, 1).step(0.01).name('centerX')
gui.add(parameters.currentMap.center, 'y', 0, 1).step(0.01).name('centerY')
gui.add(parameters.currentMap, 'rotation', 0, Math.PI * 2).step(0.01).name('rotation')
gui.add(parameters.currentMap, 'minFilter', parameters.minFilters).onChange(key => {
  parameters.currentMap.minFilter = THREE[key]
  parameters.currentMap.needsUpdate = true
})
gui.add(parameters.currentMap, 'magFilter', parameters.magFilters).onChange(key => {
  console.log(parameters.currentMap)
  parameters.currentMap.magFilter = THREE[key]
  parameters.currentMap.needsUpdate = true
})

// 渲染
function animate() {
  controls.update(); // 更新控制器, 阻尼更真实
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('dblclick', () =>{
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

window.addEventListener('resize', () => {
  // 更新相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 防止高分屏模糊
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
})

