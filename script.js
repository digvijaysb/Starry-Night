import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

let stars = []; 
let messages = [];
let fortunes = [];

// Load messages and fortunes
fetch('assets/messages.json')
  .then(response => response.json())
  .then(data => messages = data);

fetch('assets/fortune.json')
  .then(response => response.json())
  .then(data => fortunes = data);

// Three.js setup for starry sky
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('starrySky') });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

// Add starry background
const textureLoader = new THREE.TextureLoader();
const starryTexture = textureLoader.load('assets/starry-sky.jpg'); 
scene.background = starryTexture;

// Add moving stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const x = Math.random() * 2000 - 1000;
  const y = Math.random() * 2000 - 1000;
  const z = Math.random() * 2000 - 1000;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.5,
  transparent: true,
  opacity: 0.8,
});

const starsMesh = new THREE.Points(starGeometry, starMaterial);
scene.add(starsMesh);

function animate() {
  requestAnimationFrame(animate);

  starsMesh.rotation.x += 0.001;
  starsMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
}
animate();

// Add static shiny objects
function createStaticObjects() {
  for (let i = 0; i < 14; i++) {
    const div = document.createElement('div');
    div.classList.add('staticObject');
    div.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    div.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
    div.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      const { photo, message } = messages[randomIndex];
      document.getElementById('popupImage').src = `assets/${photo}`;
      document.getElementById('popupMessage').textContent = message;
      document.getElementById('popup').style.display = 'block';
    });
    document.body.appendChild(div);
  }
}

createStaticObjects();

// Close popup
document.getElementById('closePopup').addEventListener('click', () => {
  document.getElementById('popup').style.display = 'none';
});

// Show fortune card
function showFortune() {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  document.getElementById('fortuneMessage').textContent = randomFortune;
  document.getElementById('fortuneCard').style.display = 'block';
}

// Draw new fortune
document.getElementById('newFortune').addEventListener('click', showFortune);
