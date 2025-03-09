/*Nguyen Vu 
npvu@ucsc.edu*/
// Credit
// 3D model: https://free3d.com/3d-model/giant-stone-765391.html
// Example images from Three js manual

import * as THREE from 'three';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/controls/OrbitControls.js';

// Scene + camera
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Add fog
scene.fog = new THREE.FogExp2(0xcccccc, 0.02); // Light gray

// Directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1); // White light
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
scene.add(dirLight);

// Ambient Light
let ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white light
scene.add(ambientLight);

// Point Light
let pointLight = new THREE.PointLight(0xff9000, 2, 50); // Orange light
pointLight.position.set(-8, 10, 3);
pointLight.castShadow = true;
scene.add(pointLight);

// Spotlight
let spotLight = new THREE.SpotLight(0x0000ff, 2, 30, Math.PI / 6, 0.5, 1); // Blue light
spotLight.position.set(0, 15, 0);
spotLight.castShadow = true;
scene.add(spotLight);

// Skybox
let skyboxLoader = new THREE.CubeTextureLoader();

let skyboxTexture = skyboxLoader.load([
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-x.jpg', // Right
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-x.jpg', // Left
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-y.jpg', // Top
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-y.jpg', // Bottom
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-z.jpg', // Front
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-z.jpg', // Back
]);

scene.background = skyboxTexture;

function createCube(x, y, z, color, texture = null) {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshStandardMaterial({ 
        color,
        map: texture
    });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    return cube;
}

function createSphere(x, y, z, color) {
    let geometry = new THREE.SphereGeometry(0.5, 32, 32);
    let material = new THREE.MeshStandardMaterial({ color });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    return sphere;
}

function createCylinder(x, y, z, color) {
    let geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    let material = new THREE.MeshStandardMaterial({ color });
    let cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(x, y, z);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);
    return cylinder;
}

// Textured cube
let textureLoader = new THREE.TextureLoader();

let textures = [
    textureLoader.load('https://threejs.org/manual/examples/resources/images/flower-1.jpg'), // Front
    textureLoader.load('https://threejs.org/manual/examples/resources/images/flower-2.jpg'), // Back
    textureLoader.load('https://threejs.org/manual/examples/resources/images/flower-3.jpg'), // Top
    textureLoader.load('https://threejs.org/manual/examples/resources/images/flower-4.jpg'), // Bottom
    textureLoader.load('https://threejs.org/manual/examples/resources/images/flower-5.jpg'), // Right
    textureLoader.load('https://threejs.org/manual/examples/resources/images/flower-6.jpg'), // Left
];

let cubeTexture = createCube(5, 1, 0, 0xffffff);

cubeTexture.material = new THREE.MeshStandardMaterial({
    map: textures[0], // Front
});

cubeTexture.material = new THREE.MeshStandardMaterial({
    map: textures[1], // Back
});

cubeTexture.material = new THREE.MeshStandardMaterial({
    map: textures[2], // Top
});

cubeTexture.material = new THREE.MeshStandardMaterial({
    map: textures[3], // Bottom
});

cubeTexture.material = new THREE.MeshStandardMaterial({
    map: textures[4], // Right
});

cubeTexture.material = new THREE.MeshStandardMaterial({
    map: textures[5], // Left
});

// OBJ/MTL Loader
let mtlLoader = new MTLLoader();

mtlLoader.load('Stone.mtl', (materials) => {
    materials.preload();

    let objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load('Stone.obj', (object) => {
        object.traverse((child) => {
            if (child.isMesh) {
                let normalMap = textureLoader.load('normal.png');
                child.material.normalMap = normalMap;
                child.material.needsUpdate = true;

                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        object.position.set(0, -4, 0);
        object.scale.set(1, 1, 1);
        scene.add(object);

        animatedObjects.push({ 
            mesh: object, 
            speed: 0.01, 
            axis: 'y' 
        });
    });
});

// Billboard texture
let billboardTexture = textureLoader.load('LOL.jpg');

let billboardMaterial = new THREE.MeshBasicMaterial({
    map: billboardTexture,
    transparent: false,
    side: THREE.DoubleSide
});

let billboardGeometry = new THREE.PlaneGeometry(5, 5);
let billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
billboard.position.set(10, 5, 5);
scene.add(billboard);

// Render scene
let renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
let renderScene = new THREE.Scene();
let renderCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderCamera.position.set(0, 5, 10);

// Object in render scene
let cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
let cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
renderScene.add(cube);

// Plane to display rendered texture
let planeGeometry = new THREE.PlaneGeometry(10, 10);
let planeMaterial = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(-15, 5, -10);
scene.add(plane);

function renderToTexture() {
    renderer.setRenderTarget(renderTarget);
    renderer.render(renderScene, renderCamera);
    renderer.setRenderTarget(null);
}

// OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;

let animatedObjects = [];
animatedObjects.push({ mesh: cubeTexture, speed: 0.01, axis: 'y' });

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    // Animate objects
    animatedObjects.forEach(obj => {
        obj.mesh.rotation[obj.axis] += obj.speed;
    });

    let time = Date.now() * 0.001;
    spotLight.position.x = -Math.sin(time) * 10;
    spotLight.position.z = Math.cos(time) * 10;

    renderToTexture();

    renderer.render(scene, camera);
}

// Create 20 objects
for (let i = 0; i < 20; i++) {
    let x = (Math.random() - 0.5) * 20;
    let y = (Math.random() - 0.5) * 10;
    let z = (Math.random() - 0.5) * 20;
    let color = Math.random() * 0xffffff;

    if (i % 3 === 0) {
        createCube(x, y, z, color);
    } else if (i % 3 === 1) {
        createSphere(x, y, z, color);
    } else {
        createCylinder(x, y, z, color);
    }
}

animate();
