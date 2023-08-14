import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';

const gui = new GUI();
// 场景
const scene = new THREE.Scene();

// 天空贴图
const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg')

const skydomeMaterial = new THREE.MeshBasicMaterial({
  map: skydomeTexture, // 设置纹理贴图
  side: THREE.DoubleSide // 双面可见
});

// 创建球体
const skydomeGeometry = new THREE.SphereGeometry(100, 50, 50); 

const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);

scene.add(skydome);

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(light)
}

// 新增點光
const addPointLight = () => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(10, 10, -10)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 5, 0xffff00)
	// scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
}

// 新增平行光
const addDirectionalLight = () => {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
	directionalLight.position.set(0, 0, 10)
	scene.add(directionalLight);
	directionalLight.castShadow = true // 产生阴影
	const d = 10;

	directionalLight.shadow.camera.left = - d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = - d;

	// 新增Helper
	const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xffff00)
	scene.add(lightHelper);
	// 更新位置
	directionalLight.target.position.set(0, 0, 0);
	directionalLight.target.updateMatrixWorld();
	// 更新Helper
	lightHelper.update();
}

addPointLight()
addAmbientLight()
addDirectionalLight()

const earthTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthmap2k.jpg')
// 灰階高度貼圖
const displacementTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/editedBump.jpg')
// 光滑度度貼圖
const roughtnessTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2kReversedLighten.png')
// 金属貼圖
const speculatMapTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2k.jpg')
// 凹凸貼圖
const bumpTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthbump2k.jpg')

const earthGeometry = new THREE.SphereGeometry(5, 600, 600); // 半径，水平分段数，垂直分段数
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture, // 设置纹理贴图
  side: THREE.DoubleSide, // 双面可见
  roughnessMap: roughtnessTexture, // 光滑度贴图
  roughness: 0.5, // 光滑度
  metalnessMap: speculatMapTexture, // 金属贴图
  metalness: 0.5, // 金属度
  displacementMap: displacementTexture, // 灰階高度贴图
  displacementScale: 0.9, // 高度
  bumpMap: bumpTexture, // 凹凸贴图
  bumpScale: 0.1, // 凹凸程度
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

gui.add(earthMaterial, 'roughness', 0, 1, 0.01);
gui.add(earthMaterial, 'metalness', 0, 1, 0.01);
gui.add(earthMaterial, 'displacementScale', 0, 1, 0.01);
gui.add(earthMaterial, 'bumpScale', 0, 1, 0.01);

// 云层
const cloudTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthhiresclouds2K.jpg')
const cloudGeometry = new THREE.SphereGeometry(5.6, 600, 600); // 半径，水平分段数，垂直分段数
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: cloudTexture, // 设置纹理贴图
  side: THREE.DoubleSide, // 双面可见
  transparent: true, // 透明
  opacity: 0.5, // 透明度
});
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloud);


const cities = [
	{ name: "Mumbai", id: 1356226629, lat: 19.0758, lon: 72.8775, country: "India" },
	{ name: "Moscow", id: 1643318494, lat: 55.7558, lon: 37.6178, country: "Russia" },
	{ name: "Xiamen", id: 1156212809, lat: 24.4797, lon: 118.0819, country: "China" },
	{ name: "Phnom Penh", id: 1116260534, lat: 11.5696, lon: 104.9210, country: "Cambodia" },
	{ name: "Chicago", id: 1840000494, lat: 41.8373, lon: -87.6862, country: "United States" },
	{ name: "Bridgeport", id: 1840004836, lat: 41.1918, lon: -73.1953, country: "United States" },
	{ name: "Mexico City", id: 1484247881, lat:19.4333, lon: -99.1333 , country: "Mexico" },
	{ name: "Karachi", id: 1586129469, lat:24.8600, lon: 67.0100 , country: "Pakistan" },
	{ name: "London", id: 1826645935, lat:51.5072, lon: -0.1275 , country: "United Kingdom" },
	{ name: "Boston", id: 1840000455, lat:42.3188, lon: -71.0846 , country: "United States" },
	{ name: "Taichung", id: 1158689622, lat:24.1500, lon: 120.6667 , country: "Taiwan" },
]

const geo = new THREE.RingGeometry( 0.1, 0.13, 32 );
const mat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
const ring = new THREE.Mesh( geo, mat );
scene.add( ring );


// 摄像机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10 , 15);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// 控制器
const control = new OrbitControls(camera, renderer.domElement);

const selectDom = document.createElement('select')
selectDom.style.position = 'absolute'
selectDom.style.top = '10px'
selectDom.style.left = '10px'

cities.forEach(city => {
  const optionDom = document.createElement('option')
  optionDom.value = city.id
  optionDom.innerText = city.name
  selectDom.appendChild(optionDom)
})

document.body.appendChild(selectDom)

const llaToEcef = (lat, lon, alt, rad) => {
	let f = 0
	let ls = Math.atan((1 - f) ** 2 * Math.tan(lat))
	let x = rad * Math.cos(ls) * Math.cos(lon) + alt * Math.cos(lat) * Math.cos(lon)
	let y = rad * Math.cos(ls) * Math.sin(lon) + alt * Math.cos(lat) * Math.sin(lon)
	let z = rad * Math.sin(ls) + alt * Math.sin(lat)
	return new THREE.Vector3(x, y, z)
}
const lonLauToRadian = (lon, lat, rad) => llaToEcef(Math.PI * (0 - lat) / 180, Math.PI * (lon / 180), 1, rad)
selectDom.addEventListener('change', (e) => {
  const seletedCity = cities.find(city => city.id === Number(e.target.value))
	// 用前面的函式所取得的座標
	const cityEciPosition = lonLauToRadian(seletedCity.lon, seletedCity.lat, 4.4)
	// 指定位置給圖釘
	ring.position.set(cityEciPosition.x, -cityEciPosition.z, -cityEciPosition.y)	
	const center = new THREE.Vector3(0,0,0)
  // 圖釘永遠都看像世界中心，所以不會歪斜。
	ring.lookAt(center)
  // control.lookAt(ring)
  control.target.copy(ring.position)
  control.update()
})
const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // earth.rotation.y +=0.005
	cloud.rotation.y +=0.004
  skydome.rotation.y += 0.001
}

animate();