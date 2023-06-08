import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
const twoPi = Math.PI * 2;

class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1) {

    super();

    this.scale = scale;

  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {

    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}

function updateGroupGeometry(mesh, geometry) {
  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new THREE.WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;

  // these do not update nicely together if shared

}

// heart shape

const x = 0, y = 0;

const heartShape = new THREE.Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

const guis = {

  BoxGeometry: function (mesh) {

    const data = {
      width: 15,
      height: 15,
      depth: 15,
      widthSegments: 1,
      heightSegments: 1,
      depthSegments: 1
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.BoxGeometry(
          data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments
        )
      );

    }

    const folder = gui.addFolder('THREE.BoxGeometry');

    folder.add(data, 'width', 1, 30).onChange(generateGeometry);
    folder.add(data, 'height', 1, 30).onChange(generateGeometry);
    folder.add(data, 'depth', 1, 30).onChange(generateGeometry);
    folder.add(data, 'widthSegments', 1, 10).step(1).onChange(generateGeometry);
    folder.add(data, 'heightSegments', 1, 10).step(1).onChange(generateGeometry);
    folder.add(data, 'depthSegments', 1, 10).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  CapsuleGeometry: function (mesh) {

    const data = {
      radius: 5,
      length: 5,
      capSegments: 10,
      radialSegments: 20
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.CapsuleGeometry(data.radius, data.length, data.capSegments, data.radialSegments),
      );

    }

    const folder = gui.addFolder('THREE.CapsuleGeometry');

    folder.add(data, 'radius', 1, 30).onChange(generateGeometry);
    folder.add(data, 'length', 1, 30).onChange(generateGeometry);
    folder.add(data, 'capSegments', 1, 32).step(1).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 1, 64).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  CylinderGeometry: function (mesh) {

    const data = {
      radiusTop: 5,
      radiusBottom: 5,
      height: 10,
      radialSegments: 8,
      heightSegments: 1,
      openEnded: false,
      thetaStart: 0,
      thetaLength: twoPi
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.CylinderGeometry(
          data.radiusTop,
          data.radiusBottom,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength
        )
      );

    }

    const folder = gui.addFolder('THREE.CylinderGeometry');

    folder.add(data, 'radiusTop', 0, 30).onChange(generateGeometry);
    folder.add(data, 'radiusBottom', 0, 30).onChange(generateGeometry);
    folder.add(data, 'height', 1, 50).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 3, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'heightSegments', 1, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'openEnded').onChange(generateGeometry);
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);


    generateGeometry();

  },

  ConeGeometry: function (mesh) {

    const data = {
      radius: 5,
      height: 10,
      radialSegments: 8,
      heightSegments: 1,
      openEnded: false,
      thetaStart: 0,
      thetaLength: twoPi
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.ConeGeometry(
          data.radius,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength
        )
      );

    }

    const folder = gui.addFolder('THREE.ConeGeometry');

    folder.add(data, 'radius', 0, 30).onChange(generateGeometry);
    folder.add(data, 'height', 1, 50).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 3, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'heightSegments', 1, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'openEnded').onChange(generateGeometry);
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);


    generateGeometry();

  },

  CircleGeometry: function (mesh) {

    const data = {
      radius: 10,
      segments: 32,
      thetaStart: 0,
      thetaLength: twoPi
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.CircleGeometry(
          data.radius, data.segments, data.thetaStart, data.thetaLength
        )
      );

    }

    const folder = gui.addFolder('THREE.CircleGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'segments', 0, 128).step(1).onChange(generateGeometry);
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);

    generateGeometry();

  },

  DodecahedronGeometry: function (mesh) {

    const data = {
      radius: 10,
      detail: 0
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.DodecahedronGeometry(
          data.radius, data.detail
        )
      );

    }

    const folder = gui.addFolder('THREE.DodecahedronGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  IcosahedronGeometry: function (mesh) {

    const data = {
      radius: 10,
      detail: 0
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.IcosahedronGeometry(
          data.radius, data.detail
        )
      );

    }

    const folder = gui.addFolder('THREE.IcosahedronGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  LatheGeometry: function (mesh) {

    const points = [];

    for (let i = 0; i < 10; i++) {

      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));

    }

    const data = {
      segments: 12,
      phiStart: 0,
      phiLength: twoPi
    };

    function generateGeometry() {

      const geometry = new THREE.LatheGeometry(
        points, data.segments, data.phiStart, data.phiLength
      );

      updateGroupGeometry(mesh, geometry);

    }

    const folder = gui.addFolder('THREE.LatheGeometry');

    folder.add(data, 'segments', 1, 30).step(1).onChange(generateGeometry);
    folder.add(data, 'phiStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'phiLength', 0, twoPi).onChange(generateGeometry);

    generateGeometry();

  },

  OctahedronGeometry: function (mesh) {

    const data = {
      radius: 10,
      detail: 0
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.OctahedronGeometry(
          data.radius, data.detail
        )
      );

    }

    const folder = gui.addFolder('THREE.OctahedronGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  PlaneGeometry: function (mesh) {

    const data = {
      width: 10,
      height: 10,
      widthSegments: 1,
      heightSegments: 1
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.PlaneGeometry(
          data.width, data.height, data.widthSegments, data.heightSegments
        )
      );

    }

    const folder = gui.addFolder('THREE.PlaneGeometry');

    folder.add(data, 'width', 1, 30).onChange(generateGeometry);
    folder.add(data, 'height', 1, 30).onChange(generateGeometry);
    folder.add(data, 'widthSegments', 1, 30).step(1).onChange(generateGeometry);
    folder.add(data, 'heightSegments', 1, 30).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  RingGeometry: function (mesh) {

    const data = {
      innerRadius: 5,
      outerRadius: 10,
      thetaSegments: 8,
      phiSegments: 8,
      thetaStart: 0,
      thetaLength: twoPi
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.RingGeometry(
          data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength
        )
      );

    }

    const folder = gui.addFolder('THREE.RingGeometry');

    folder.add(data, 'innerRadius', 1, 30).onChange(generateGeometry);
    folder.add(data, 'outerRadius', 1, 30).onChange(generateGeometry);
    folder.add(data, 'thetaSegments', 1, 30).step(1).onChange(generateGeometry);
    folder.add(data, 'phiSegments', 1, 30).step(1).onChange(generateGeometry);
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);

    generateGeometry();

  },

  SphereGeometry: function (mesh) {

    const data = {
      radius: 15,
      widthSegments: 32,
      heightSegments: 16,
      phiStart: 0,
      phiLength: twoPi,
      thetaStart: 0,
      thetaLength: Math.PI
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.SphereGeometry(
          data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength
        )
      );

    }

    const folder = gui.addFolder('THREE.SphereGeometry');

    folder.add(data, 'radius', 1, 30).onChange(generateGeometry);
    folder.add(data, 'widthSegments', 3, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'heightSegments', 2, 32).step(1).onChange(generateGeometry);
    folder.add(data, 'phiStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'phiLength', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);

    generateGeometry();

  },

  TetrahedronGeometry: function (mesh) {

    const data = {
      radius: 10,
      detail: 0
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.TetrahedronGeometry(
          data.radius, data.detail
        )
      );

    }

    const folder = gui.addFolder('THREE.TetrahedronGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  TorusGeometry: function (mesh) {

    const data = {
      radius: 10,
      tube: 3,
      radialSegments: 16,
      tubularSegments: 100,
      arc: twoPi
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.TorusGeometry(
          data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc
        )
      );

    }

    const folder = gui.addFolder('THREE.TorusGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'tube', 0.1, 10).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 2, 30).step(1).onChange(generateGeometry);
    folder.add(data, 'tubularSegments', 3, 200).step(1).onChange(generateGeometry);
    folder.add(data, 'arc', 0.1, twoPi).onChange(generateGeometry);

    generateGeometry();

  },

  TorusKnotGeometry: function (mesh) {

    const data = {
      radius: 10,
      tube: 3,
      tubularSegments: 64,
      radialSegments: 8,
      p: 2,
      q: 3
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.TorusKnotGeometry(
          data.radius, data.tube, data.tubularSegments, data.radialSegments,
          data.p, data.q
        )
      );

    }

    const folder = gui.addFolder('THREE.TorusKnotGeometry');

    folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
    folder.add(data, 'tube', 0.1, 10).onChange(generateGeometry);
    folder.add(data, 'tubularSegments', 3, 300).step(1).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 3, 20).step(1).onChange(generateGeometry);
    folder.add(data, 'p', 1, 20).step(1).onChange(generateGeometry);
    folder.add(data, 'q', 1, 20).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  TubeGeometry: function (mesh) {

    const data = {
      segments: 20,
      radius: 2,
      radialSegments: 8
    };

    const path = new CustomSinCurve(10);

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new THREE.TubeGeometry(path, data.segments, data.radius, data.radialSegments, false)
      );

    }

    const folder = gui.addFolder('THREE.TubeGeometry');

    folder.add(data, 'segments', 1, 100).step(1).onChange(generateGeometry);
    folder.add(data, 'radius', 1, 10).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 1, 20).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  ShapeGeometry: function (mesh) {

    const data = {
      segments: 12
    };

    function generateGeometry() {

      const geometry = new THREE.ShapeGeometry(heartShape, data.segments);
      geometry.center();

      updateGroupGeometry(mesh, geometry);

    }

    const folder = gui.addFolder('THREE.ShapeGeometry');
    folder.add(data, 'segments', 1, 100).step(1).onChange(generateGeometry);

    generateGeometry();

  },

  ExtrudeGeometry: function (mesh) {

    const data = {
      steps: 2,
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    };

    const length = 12, width = 8;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    function generateGeometry() {

      const geometry = new THREE.ExtrudeGeometry(shape, data);
      geometry.center();

      updateGroupGeometry(mesh, geometry);

    }

    const folder = gui.addFolder('THREE.ExtrudeGeometry');

    folder.add(data, 'steps', 1, 10).step(1).onChange(generateGeometry);
    folder.add(data, 'depth', 1, 20).onChange(generateGeometry);
    folder.add(data, 'bevelThickness', 1, 5).step(1).onChange(generateGeometry);
    folder.add(data, 'bevelSize', 0, 5).step(1).onChange(generateGeometry);
    folder.add(data, 'bevelOffset', - 4, 5).step(1).onChange(generateGeometry);
    folder.add(data, 'bevelSegments', 1, 5).step(1).onChange(generateGeometry);

    generateGeometry();

  }

};

function chooseFromHash(mesh, geometry) {
  if (guis[geometry] !== undefined) {

    guis[geometry](mesh);

  }

}

//

// const selectedGeometry = window.location.hash.substring(1);

// if (guis[selectedGeometry] !== undefined) {
//   document.getElementById('newWindow').href += '#' + selectedGeometry;
// }

const gui = new GUI();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

const lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(- 100, - 200, - 100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

const group = new THREE.Group();

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const meshMaterial = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });

group.add(new THREE.LineSegments(geometry, lineMaterial));
group.add(new THREE.Mesh(geometry, meshMaterial));

chooseFromHash(group, 'BoxGeometry');

scene.add(group);

const parameters = {
  geometry: Object.keys(guis)
}

gui.add(parameters, 'geometry', parameters.geometry).onChange((val) => {
  console.log(val)
  chooseFromHash(group, val);
})


function render() {

  requestAnimationFrame(render);

  group.rotation.x += 0.005;
  group.rotation.y += 0.005;

  renderer.render(scene, camera);

}

window.addEventListener('resize', function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

render();


