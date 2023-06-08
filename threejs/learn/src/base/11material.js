import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';
// 创建场景
const scene = new THREE.Scene();


const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/4.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

// 不需要光照的材质

// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture

// material.transparent = true
// material.alphaMap = doorAlphaTexture

// const material = new THREE.MeshNormalMaterial()

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial() // near将简单地将几何体着色为白色，如果它接近far相机的值，则为黑色


// 需要光照的材质
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.position.set(400, 200, 200);
scene.add(pointLight);

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial({
//   color: 0xff0000,
//   shininess: 20, //高光部分的亮度，默认30
//   specular: 0xf1f1f1, //高光部分的颜色
// })

// const material = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture
// })

// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

// const material = new THREE.MeshStandardMaterial()
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture


// 立方体纹理加载器 加载6张图片，返回一个立方体纹理对象
const cubeTextureLoader = new THREE.CubeTextureLoader()


// 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
// 'py.jpg', 'ny.jpg'：y轴贴图
// 'pz.jpg', 'nz.jpg'：z轴贴图

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
})
material.envMap = environmentMapTexture


material.side = THREE.DoubleSide



// material.flatShading = true //平面着色

const sphere = new THREE.Mesh(
    // new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = - 1.5

const plane = new THREE.Mesh(
    // new THREE.PlaneGeometry(1, 1),
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    // new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// MeshStandardMaterial 需要uv2
// sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
// plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
// torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

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


const gui = new GUI()

const parameters = {
  color: 0xff0000,
  wireframe: false,
  opacity: 1,
  flatShading: false, // 平面着色 将使面变平，这意味着法线不会在顶点之间进行插值。
  metalness: 1, // 金属度  非金属材料,如木材或石材,使用0.0,金属使用1.0
  roughness: 1, // 粗糙度
}

gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color)
})
gui.add(parameters, 'wireframe').onChange(() => {
  material.wireframe = parameters.wireframe
})
gui.add(parameters, 'opacity', 0, 1, 0.01).onChange(() => {
  material.opacity = parameters.opacity
})
gui.add(parameters, 'flatShading').onChange(() => {
  material.flatShading = parameters.flatShading
  material.needsUpdate = true
})
gui.add(parameters, 'metalness', 0, 1, 0.01).onChange(() => {
  material.metalness = parameters.metalness
})
gui.add(parameters, 'roughness', 0, 1, 0.01).onChange(() => {
  material.roughness = parameters.roughness
})


const clock = new THREE.Clock();

// 渲染
function animate() {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update(); // 更新控制器, 阻尼更真实
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


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

