"use strict";

//renderer and scene
const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas"), antialias: true});
const scene01 = new THREE.Scene();
const scene02 = new THREE.Scene();
var currentScene = scene01;

//camera
const  camera = new THREE.PerspectiveCamera(30, 2, 1, 2000);
camera.position.set(500,500,500);
camera.lookAt(new THREE.Vector3(0,0,0));


// lights and environment
setEnvironment(scene01);
setEnvironment(scene02);

function setEnvironment(scene) {
  const skyColor = new THREE.Color(0xA8FAFF);
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  const envLight = new THREE.HemisphereLight(skyColor, 0xDBE3E4, 0.9);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);
  scene.add(envLight);
  scene.background = new THREE.Color(skyColor);
}

// controls
var controls;
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 1;
controls.screenSpacePanning = false;
controls.minDistance = 800;
controls.maxDistance = 1100;
controls.maxPolarAngle = Math.PI / 2;
controls.enablePan = false;

//load 3D models
var teapot;
var studio;
var malcom;

var loader = new THREE.GLTFLoader();
var meshMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});

const studioPosition = new THREE.Vector3(0,-50,0);
loader.load('https://luisfranciscooliveira.github.io/max/studio.gltf', gltf => handle_load(gltf, studioPosition, false, scene02));
loader.load('https://luisfranciscooliveira.github.io/max/studionogreen.gltf', gltf => handle_load(gltf, studioPosition, false, scene01));
//loader.load('max/testSkel.gltf', gltf => handle_load(gltf, studioPosition, false, scene01));

const teapotPosition = new THREE.Vector3(0,30,0);
loader.load('https://luisfranciscooliveira.github.io/max/teapot.gltf', gltf => handle_load(gltf, teapotPosition, true, scene01));

function handle_load(gltf, position, isTeapot, scene) {
  var scale = 100;
  const object = gltf.scene.children[1];
  object.position.copy(position);
  object.scale.set(scale, scale, scale);

  if(isTeapot == true) {
    teapot = object;
    teapot.material = meshMat;
    scene.add(teapot);
  } else {
    scene.add(object);
  }
}

//dynamic canvas resize
function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width ||canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

//frame update
function animate(time) {
  time *= 0.001;  // seconds
  resizeCanvasToDisplaySize();
  renderer.render(currentScene, camera);
  requestAnimationFrame(animate);
  teapot.rotation.x += 0.01;
  teapot.rotation.y += 0.01;
}
requestAnimationFrame(animate);

//functionality
function buttonClicked(button) {
  switch(button) {
    case "ar":
      currentScene = scene01;
      break;
    case "mixedreality":
      currentScene = scene02;
      break;
    default:
      currentScene = scene01;
  }
}
