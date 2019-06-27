"use strict";
var container;
var views, scene, scene01, scene02, renderer;
var windowWidth, windowHeight;
scene01 = new THREE.Scene();
scene02 = new THREE.Scene();
var views = [
  {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1.0,
      background: new THREE.Color( 0.5, 0.5, 0.7 ),
      eye: [ 0, 300, 1800 ],
      up: [ 0, 1, 0 ],
      fov: 30,
      sceneCam: scene01,
      updateCamera: function ( camera, scene, mouseX ) {

        camera.position.x += mouseX * 0.05;
        camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), - 2000 );
        camera.lookAt( scene.position );

      }
  },
  {
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 1,
      background: new THREE.Color( 0.5, 0.7, 0.7 ),
      eye: [ 1400, 800, 1400 ],
      up: [ 0, 1, 0 ],
      fov: 60,
      sceneCam: scene02,
      updateCamera: function ( camera, scene, mouseX ) {

        camera.position.y -= mouseX * 0.05;
        camera.position.y = Math.max( Math.min( camera.position.y, 1600 ), - 1600 );
        camera.lookAt( scene.position );

      }
  }
];

init();
animate();
controls();

function init() {

  container = document.getElementById( 'container' );

  //add a camera per view
  for ( var ii = 0; ii < views.length; ++ ii ) {

    var view = views[ ii ];
    var camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.fromArray( view.eye );
    camera.up.fromArray( view.up );
    view.camera = camera;

  }

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer( {canvas: document.querySelector("canvas"), antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  

  setEnvironment(scene01);
  setEnvironment(scene02);
  addObjects();
}

function updateSize() {

  if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;

      renderer.setSize( windowWidth, windowHeight );

  }

}

function animate() {

  render();

  requestAnimationFrame( animate );

}

function render() {

  updateSize();
  //resizeCanvasToDisplaySize();

  for ( var ii = 0; ii < views.length; ++ ii ) {

      var view = views[ ii ];
      var camera = view.camera;
      var viewScene = view.sceneCam;

      view.updateCamera( camera, viewScene, 0, 0 );

      var left = Math.floor( windowWidth * view.left );
      var bottom = Math.floor( windowHeight * view.bottom );
      var width = Math.floor( windowWidth * view.width );
      var height = Math.floor( windowHeight * view.height );

      renderer.setViewport( left, bottom, width, height );
      renderer.setScissor( left, bottom, width, height );
      renderer.setScissorTest( true );
      renderer.setClearColor( view.background );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.render( viewScene, camera );

  }
}

function controls() {
  var controls;
  var controlledCam = views[0].camera;
  controls = new THREE.OrbitControls( controlledCam, renderer.domElement );
  controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 1;
  controls.screenSpacePanning = false;
  controls.minDistance = 800;
  controls.maxDistance = 1100;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enablePan = false;
}

function addObjects() {
  var teapot;

  var loader = new THREE.GLTFLoader();
  var meshMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});

  const studioPosition = new THREE.Vector3(0,-50,0);
  loader.load('https://luisfranciscooliveira.github.io/max/studio.gltf', gltf => handle_load(gltf, studioPosition, false, scene02));
  loader.load('https://luisfranciscooliveira.github.io/max/studionogreen.gltf', gltf => handle_load(gltf, studioPosition, false, scene01));


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
}

function setEnvironment(scene) {
  const skyColor = new THREE.Color(0xA8FAFF);
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  const envLight = new THREE.HemisphereLight(skyColor, 0xDBE3E4, 0.9);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);
  scene.add(envLight);
  //scene.background = new THREE.Color(skyColor);
}
/*
//camera
const  camera = new THREE.PerspectiveCamera(30, 2, 1, 2000);
camera.position.set(500,500,500);
camera.lookAt(new THREE.Vector3(0,0,0));
*/

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

/*
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
*/
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
