import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
const scene = new THREE.Scene();

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

// Lights
// 环境光  new THREE.AmbientLight(color, intensity)
// 在场景的所有几何体上应用全向照明
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// 定向光  new THREE.DirectionalLight(color, intensity)
// 将具有类似太阳的效果，就好像太阳光线平行传播一样
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.position.set(2, 2, - 2)
// scene.add(directionalLight)

// 半球光 new THREE.HemisphereLight(skyColor, groundColor, intensity)
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
// scene.add(hemisphereLight)

// 点光源 new THREE.PointLight(color, intensity, distance, decay)
// 从一个点向所有方向发射光线
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
// scene.add(pointLight)

// 矩形区域光 new THREE.RectAreaLight(color, intensity, width, height)
// 类似于您在照片拍摄集中看到的大矩形灯。它是定向光和漫射光之间的混合
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

// 聚光灯 new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
// color： 颜色
// intensity：强度
// distance：强度下降到的距离0
// angle: 光束有多大
// penumbra：光束轮廓的扩散程度
// decay：光线变暗的速度
// 就像手电筒一样工作。它是一个从一点开始并朝向一个方向的光锥
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)


const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// 坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
const animate = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

