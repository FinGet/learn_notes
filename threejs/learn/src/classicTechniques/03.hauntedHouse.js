import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui'
// 创建场景
const scene = new THREE.Scene();
const gui = new GUI()
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

// 创建地图
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
  })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
scene.add(floor)

const house = new THREE.Group()
scene.add(house)

// 创建墙壁
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
  })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
house.add(walls)

// 创建屋顶
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4), // 半径, 高度, 分段数 
  new THREE.MeshStandardMaterial({
      color: '#b35f45',
  })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 3
house.add(roof)

// 创建门
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.z = 2.01
door.position.y = 1
house.add(door)

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)


// 创建坟墓
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 50; i++){
  const angle = Math.random() * Math.PI * 2 // Random angle
  const radius = 3 + Math.random() * 6      // Random radius
  const x = Math.cos(angle) * radius        // Get the x position using cosinus
  const z = Math.sin(angle) * radius        // Get the z position using sinus

  // Create the mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.castShadow = true
  // Position
  grave.position.set(x, 0.3, z)                              

  // Rotation
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4

  // Add to the graves container
  graves.add(grave)
}

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

const clock = new THREE.Clock()
const ghostTick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = - elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = - elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
}


const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
// moonLight.castShadow = true
// moonLight.shadow.mapSize.width = 256
// moonLight.shadow.mapSize.height = 256
// moonLight.shadow.camera.far = 15
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
gui.add(doorLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(doorLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(doorLight.position, 'z').min(- 5).max(5).step(0.001)
house.add(doorLight)


// 雾
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

// 坐标轴
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
camera.lookAt(scene.position);
scene.add(camera)

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor('#262837')

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 阻尼


// 加阴影
renderer.shadowMap.enabled = true

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

floor.receiveShadow = true

// 减少阴影贴图渲染大小以提高性能
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7


ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7


ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7


renderer.shadowMap.type = THREE.PCFSoftShadowMap

let cameraRotation = 0;

const smallBallGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const smallBallMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial);
smallBall.position.set(3, 3, 3)
scene.add(smallBall);
// 渲染
function animate() {
  ghostTick();
  
  let speed = 0.01; //旋转速度
  cameraRotation += speed;

  // 模拟相机围绕场景旋转
  smallBall.position.set(Math.sin(cameraRotation) * 5, 3, Math.cos(cameraRotation) * 5)

  // 要旋转其实就是改变相机的位置，会根据相机的位置计算向量，
  // 围绕y轴旋转，所以只需要改变相机的x和z坐标即可  
  // 如果都用sin或者cos的话，会发现相机会在一个方向上改变(镜头拉远和推近)，所以需要用sin和cos组合
  // sin和cos 用在不同的坐标系，来确定不同的旋转方向
  camera.position.x = Math.sin(cameraRotation) * 10;  // 10为旋转半径
  camera.position.z = Math.cos(cameraRotation) * 10;  // 10为旋转半径
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

