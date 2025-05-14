import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const skyboxTexture = textureLoader.load("./assets/textures/sky.jpg");
scene.background = skyboxTexture;

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 50, 100);
pointLight.position.set(10, 10, 0);
scene.add(pointLight);

const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeTexture = new THREE.TextureLoader().load(
  "./assets/textures/floor.jpg"
);
const planeMaterial = new THREE.MeshStandardMaterial({ map: planeTexture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const sandboxSize = 10;
const sandboxHeight = 0.5;
const sandboxColor = 0xc2b280;

const sandboxFloorGeometry = new THREE.BoxGeometry(
  sandboxSize,
  0.1,
  sandboxSize
);
const sandboxFloorMaterial = new THREE.MeshStandardMaterial({
  color: sandboxColor,
});
const sandboxFloor = new THREE.Mesh(sandboxFloorGeometry, sandboxFloorMaterial);
sandboxFloor.position.set(0, 0.05, 0);
scene.add(sandboxFloor);

const wallThickness = 0.5;
const wallMaterial = new THREE.MeshStandardMaterial({ color: sandboxColor });

const wall1 = new THREE.Mesh(
  new THREE.BoxGeometry(
    sandboxSize + wallThickness * 2,
    sandboxHeight,
    wallThickness
  ),
  wallMaterial
);
wall1.position.set(
  0,
  sandboxHeight / 2 + 0.1,
  sandboxSize / 2 + wallThickness / 2
);
scene.add(wall1);

const wall2 = new THREE.Mesh(
  new THREE.BoxGeometry(
    sandboxSize + wallThickness * 2,
    sandboxHeight,
    wallThickness
  ),
  wallMaterial
);
wall2.position.set(
  0,
  sandboxHeight / 2 + 0.1,
  -sandboxSize / 2 - wallThickness / 2
);
scene.add(wall2);

const wall3 = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, sandboxHeight, sandboxSize),
  wallMaterial
);
wall3.position.set(
  -sandboxSize / 2 - wallThickness / 2,
  sandboxHeight / 2 + 0.1,
  0
);
scene.add(wall3);

const wall4 = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, sandboxHeight, sandboxSize),
  wallMaterial
);
wall4.position.set(
  sandboxSize / 2 + wallThickness / 2,
  sandboxHeight / 2 + 0.1,
  0
);
scene.add(wall4);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);

const material1 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const material3 = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const shapesInSandbox = 30;
const sandboxInnerSize = sandboxSize - wallThickness * 2;

for (let i = 0; i < shapesInSandbox; i++) {
  let geometry, material, yOffset;
  const shapeType = Math.random();

  if (shapeType < 0.33) {
    geometry = cubeGeometry;
    material = material1;
    yOffset = 0.5;
  } else if (shapeType < 0.66) {
    geometry = sphereGeometry;
    material = material2;
    yOffset = 0.75;
  } else {
    geometry = cylinderGeometry;
    material = material3;
    yOffset = 0.5;
  }

  const shape = new THREE.Mesh(geometry, material);

  const x = Math.random() * sandboxInnerSize - sandboxInnerSize / 2;
  const z = Math.random() * sandboxInnerSize - sandboxInnerSize / 2;
  const y = sandboxHeight + yOffset;

  shape.position.set(x, y, z);
  scene.add(shape);
}

const texturedCubeTexture = textureLoader.load("./assets/textures/floor.jpg");
const texturedMaterial = new THREE.MeshStandardMaterial({
  map: texturedCubeTexture,
});
const texturedCube = new THREE.Mesh(cubeGeometry, texturedMaterial);
texturedCube.position.set(0, 5, 0);
scene.add(texturedCube);

let duckModel;
const loader = new GLTFLoader();
loader.load(
  "./assets/models/duck.glb",
  function (gltf) {
    duckModel = gltf.scene;
    duckModel.position.set(0, 0, -10);
    duckModel.rotation.set(0, -Math.PI / 2, 0);
    duckModel.scale.set(5, 5, 5);
    scene.add(duckModel);
  },
  undefined,
  function (error) {
    console.error("An error occurred loading the duck model:", error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  texturedCube.rotation.x += 0.01;
  texturedCube.rotation.y += 0.01;

  if (duckModel) {
    duckModel.rotation.y += 0.02;
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const newW = window.innerWidth;
  const newH = window.innerHeight;
  camera.aspect = newW / newH;
  camera.updateProjectionMatrix();
  renderer.setSize(newW, newH);
});
