console.log("Home frontend javascript file");

// ── Renderer ──────────────────────────────────────────────────
console.log("Home frontend javascript file");

// ── Target Container ──────────────────────────────────────────
const container = document.querySelector('.animation-frame') || document.body;
const getWidth = () => container.clientWidth || window.innerWidth;
const getHeight = () => container.clientHeight || window.innerHeight;

// ── Renderer ──────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(getWidth(), getHeight());
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Canvas body ga emas, animation-frame ichiga joylanadi:
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.055);

const camera = new THREE.PerspectiveCamera(55, getWidth() / getHeight(), 0.1, 80);
camera.position.set(0, 1.2, 5.5);
camera.lookAt(0, 0.8, 0);

// ── Room (box) ────────────────────────────────────────────────
const roomMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 1, metalness: 0, side: THREE.BackSide });
const room = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 22), roomMat);
room.position.y = 1;
room.receiveShadow = true;
scene.add(room);

// Floor slight gloss
const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.15, metalness: 0.6 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -6;
floor.receiveShadow = true;
scene.add(floor);

// ── Ambient ────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.18));

// ── Disco Ball Shader ─────────────────────────────────────────
const ballVert = `
  varying vec3 vNorm;
  varying vec3 vObj;
  varying vec3 vWorld;
  void main(){
    vObj   = position;
    vNorm  = normalize(normalMatrix * normal);
    vec4 w = modelMatrix * vec4(position,1.);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
  }
`;

const ballFrag = `
  #define PI 3.14159265359
  precision highp float;

  uniform vec3  uCam;
  uniform float uTime;
  uniform vec3  uSpots[8];    // 8 colored spot light directions
  uniform vec3  uSpotCols[8];

  varying vec3 vNorm;
  varying vec3 vObj;
  varying vec3 vWorld;

  // Mirror tile grid — returns face normal quantised per tile
  vec3 tileNormal(vec3 p, float tiles){
    vec3 n = normalize(p);
    float lat = asin(clamp(n.y,-1.,1.));
    float lon = atan(n.z, n.x);
    // Quantise to tile
    float dLat = PI / tiles;
    float latQ = floor(lat/dLat + 0.5)*dLat;
    float lonQ;
    float rowTiles = max(1., floor(cos(latQ)*tiles*2.));
    float dLon = 2.*PI/rowTiles;
    lonQ = floor(lon/dLon + 0.5)*dLon;
    // Reconstruct quantised normal
    return normalize(vec3(cos(latQ)*cos(lonQ), sin(latQ), cos(latQ)*sin(lonQ)));
  }

  // Tile edge mask
  float tileEdge(vec3 p, float tiles){
    vec3 n = normalize(p);
    float lat = asin(clamp(n.y,-1.,1.));
    float lon = atan(n.z, n.x);
    float dLat = PI/tiles;
    float rowTiles = max(1., floor(cos(floor(lat/dLat+.5)*dLat)*tiles*2.));
    float dLon = 2.*PI/rowTiles;
    float eLat = abs(fract(lat/dLat+.5)-.5)*2.;
    float eLon = abs(fract(lon/dLon+.5)-.5)*2.;
    float edge = max(eLat, eLon);
    return smoothstep(0.72, 0.98, edge);
  }

  void main(){
    float TILES = 28.;

    vec3 N    = normalize(vNorm);
    vec3 tN   = tileNormal(vObj, TILES);   // quantised mirror tile normal
    float edge = tileEdge(vObj, TILES);

    vec3 V    = normalize(uCam - vWorld);
    vec3 R    = reflect(-V, tN);            // mirror reflection dir per tile

    // --- Disco reflections: each spot gets a flash when tile reflects toward it ---
   vec3 col = vec3(0.15); 
    for(int i=0;i<8;i++){
      vec3 L    = normalize(uSpots[i]);
      // How closely does reflected ray point at this light?
      float refl = max(dot(R, L), 0.0);
      float flash = pow(refl, 180.0) * 6.0;   // very tight flash
      col += uSpotCols[i] * flash;
    }

    // Subtle base chrome sheen
    float d = max(dot(tN, normalize(vec3(0.9,8,0.9))), 0.);
    col += vec3(0.8,0.15,0.10) * d;

    // Specular hot spot from top key
    vec3 H = normalize(normalize(vec3(-0.4,1.5,0.5)) + V);
    float sp = pow(max(dot(tN,H),0.),200.)*9.5;
   col += vec3(0.6, 0.5, 0.2) * d;

   col = mix(col, vec3(0.005), edge);

    // Subtle rim
    float rim = pow(1.-max(dot(N,V),0.), 2.5)*0.15;
    col += vec3(0.1,0.15,0.25)*rim;

    gl_FragColor = vec4(col, 1.);
  }
`;

// Spot colors that cycle
const NUM_SPOTS = 8;
const spotDirs = [];
const spotCols = [];
const spotColsFlat = new Float32Array(NUM_SPOTS * 3);
const spotDirsFlat = new Float32Array(NUM_SPOTS * 3);

const hues = [0.0, 0.08, 0.18, 0.33, 0.50, 0.62, 0.75, 0.88]; // red orange yellow green cyan blue purple pink
for (let i = 0; i < NUM_SPOTS; i++) {
  const h = hues[i];
  const rgb = hsvToRgb(h, 1.0, 1.0);
  spotCols.push(new THREE.Vector3(rgb[0], rgb[1], rgb[2]));
  spotDirs.push(new THREE.Vector3());
}

function hsvToRgb(h, s, v) {
  let r, g, b, i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break; case 1: r = q, g = v, b = p; break; case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break; case 4: r = t, g = p, b = v; break; case 5: r = v, g = p, b = q; break;
  }
  return [r, g, b];
}

const ballMat = new THREE.ShaderMaterial({
  vertexShader: ballVert,
  fragmentShader: ballFrag,
  uniforms: {
    uCam: { value: camera.position },
    uTime: { value: 0.0 },
    uSpots: { value: spotDirs },
    uSpotCols: { value: spotCols },
  },
});

const ballGeo = new THREE.SphereGeometry(1.5, 256, 256);
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.set(0, 2.2, 0);
scene.add(ball);

// ── Hanging wire ──────────────────────────────────────────────
const wirePts = [new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, 3.2, 0)];
const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePts);
scene.add(new THREE.Line(wireGeo, new THREE.LineBasicMaterial({ color: 0x333333 })));

// ── Colored spot lights (actual Three lights for room illumination) ──
const spotLights = [];
const spotMeshes = [];
const SPOT_COLORS = [0xff2020, 0xff8800, 0xffee00, 0x00ff44, 0x00eeff, 0x2244ff, 0xcc00ff, 0xff00aa];

for (let i = 0; i < 8; i++) {
  const sl = new THREE.SpotLight(SPOT_COLORS[i], 0, 30, Math.PI / 14, 0.4, 1.5);
  sl.castShadow = false;
  scene.add(sl);
  scene.add(sl.target);
  spotLights.push(sl);

  // Visible lens disc at source
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.08, 16),
    new THREE.MeshBasicMaterial({ color: SPOT_COLORS[i], transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  scene.add(disc);
  spotMeshes.push(disc);
}

// ── Light beam cylinders (volumetric feel) ────────────────────
const beamMats = [];
const beams = [];
for (let i = 0; i < 8; i++) {
  const bm = new THREE.MeshBasicMaterial({
    color: SPOT_COLORS[i], transparent: true, opacity: 0.025,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
  });
  beamMats.push(bm);
  const bGeo = new THREE.CylinderGeometry(0.02, 0.35, 8, 8, 1, true);
  const beam = new THREE.Mesh(bGeo, bm);
  scene.add(beam);
  beams.push(beam);
}

// ── Floor light spots (projected circles) ─────────────────────
const floorSpots = [];
for (let i = 0; i < 8; i++) {
  const fs = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 32),
    new THREE.MeshBasicMaterial({
      color: SPOT_COLORS[i], transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  fs.rotation.x = -Math.PI / 2;
  fs.position.y = -5.95;
  scene.add(fs);
  floorSpots.push(fs);
}

// ── Floating particles ────────────────────────────────────────
const PCNT = 300;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(PCNT * 3);
const pC = new Float32Array(PCNT * 3);
for (let i = 0; i < PCNT; i++) {
  pPos[i * 3] = (Math.random() - 0.5) * 18;
  pPos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 1;
  pPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
  const rgb = hsvToRgb(Math.random(), 0.9, 1.0);
  pC[i * 3] = rgb[0]; pC[i * 3 + 1] = rgb[1]; pC[i * 3 + 2] = rgb[2];
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pC, 3));
scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
  size: 0.04, vertexColors: true, transparent: true, opacity: 0.55,
  blending: THREE.AdditiveBlending, depthWrite: false
})));

// ── Drag ──────────────────────────────────────────────────────
let rotY = 0, velX = 0.012, dragging = false, lastMX = 0;
renderer.domElement.addEventListener('mousedown', e => { dragging = true; lastMX = e.clientX; velX = 0; });
window.addEventListener('mousemove', e => { if (!dragging) return; velX = (e.clientX - lastMX) * 0.015; rotY += velX; lastMX = e.clientX; });
window.addEventListener('mouseup', () => dragging = false);
renderer.domElement.addEventListener('touchstart', e => { dragging = true; lastMX = e.touches[0].clientX; velX = 0; }, { passive: true });
window.addEventListener('touchmove', e => { e.preventDefault(); velX = (e.touches[0].clientX - lastMX) * 0.015; rotY += velX; lastMX = e.touches[0].clientX; }, { passive: false });
window.addEventListener('touchend', () => dragging = false);
window.addEventListener('resize', () => {
  const width = getWidth();
  const height = getHeight();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
// ── Animate ───────────────────────────────────────────────────
const clock = new THREE.Clock();
let t = 0;

(function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;

  // Ball spin
  if (!dragging) { velX += (0.012 - velX) * 0.03; rotY += velX; }
  ball.rotation.y = rotY;

  ballMat.uniforms.uTime.value = t;

  // Animate 8 spot lights orbiting outward from ball
  for (let i = 0; i < NUM_SPOTS; i++) {
    const base = (i / NUM_SPOTS) * Math.PI * 2;
    // Each spot slowly sweeps up/down and around
    const speed = 0.38 + i * 0.07;
    const phi = base + t * speed;               // azimuth
    const elev = Math.sin(t * 0.5 + i * 0.9) * 0.55;  // elevation swing

    // Direction from ball center outward
    const dx = Math.sin(phi) * Math.cos(elev);
    const dy = Math.sin(elev) - 0.3;
    const dz = Math.cos(phi) * Math.cos(elev);
    const dir = new THREE.Vector3(dx, dy, dz).normalize();

    // Spot source position (close to ball surface)
    const src = ball.position.clone().addScaledVector(dir, 1.05);

    // Update shader dirs
    spotDirs[i].copy(dir);

    // Three.js spot light
    const sl = spotLights[i];
    sl.position.copy(src);
    sl.intensity = 3.5 + Math.sin(t * 2 + i) * 1.0;
    // Target far in that direction
    sl.target.position.copy(ball.position).addScaledVector(dir, 12);
    sl.target.updateMatrixWorld();

    // Beam cylinder
    const beam = beams[i];
    const midPt = src.clone().addScaledVector(dir, 4);
    beam.position.copy(midPt);
    beam.lookAt(src);
    beam.rotateX(Math.PI / 2);
    beamMats[i].opacity = 0.022 + Math.sin(t * 3 + i) * 0.008;

    // Lens disc
    const disc = spotMeshes[i];
    disc.position.copy(src);
    disc.lookAt(camera.position);

    // Floor spot — project ray to y=-6
    const fs = floorSpots[i];
    const ty = (-5.95 - src.y) / dir.y;
    if (ty > 0 && ty < 30) {
      fs.position.x = src.x + dir.x * ty;
      fs.position.z = src.z + dir.z * ty;
      fs.material.opacity = 0.18 + Math.sin(t * 2 + i) * 0.06;
      const scale = 0.4 + ty * 0.04;
      fs.scale.set(scale, scale, scale);
    } else {
      fs.material.opacity = 0;
    }
  }

  renderer.render(scene, camera);
})();