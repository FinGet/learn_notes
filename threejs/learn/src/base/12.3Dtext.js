import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// 创建场景
const scene = new THREE.Scene();

const fontLoader = new FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json',(font) =>{
  const textGeometry = new TextGeometry('Hello Three.js',{
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  })
  const textureLoader = new THREE.TextureLoader()
  const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

  const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
  const text = new THREE.Mesh(textGeometry, material)

  textGeometry.computeBoundingBox()

  textGeometry.translate(
    - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
    - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
    - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
  )

  textGeometry.center()

  scene.add(text)

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
  for(let i = 0; i < 100; i++){
    const donut = new THREE.Mesh(donutGeometry, material)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    scene.add(donut)
  }
})


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

const clock = new THREE.Clock()

// 渲染
function animate() {
  const elapsedTime = clock.getElapsedTime()

  camera.position.x = Math.sin(elapsedTime)
  camera.position.y = Math.cos(elapsedTime)
  camera.position.z = Math.cos(elapsedTime * 2)
  
  camera.lookAt(scene.position)

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