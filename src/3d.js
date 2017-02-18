// OG: https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_buffergeometry.html

const THREE = require('three')
const createNArray = require('./createNArray')

let container
let camera
let scene
let renderer
let raycaster
let mouse
let mesh
let line
let amount
let seed = []

function init (el, size = 100) {
  container = el
  amount = size
  camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500)
  camera.position.z = 2750

  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x050505, 2000, 3500)

  //

  scene.add(new THREE.AmbientLight(0x444444))

  const light1 = new THREE.DirectionalLight(0xffffff, 0.5)
  light1.position.set(1, 1, 1)
  scene.add(light1)

  const light2 = new THREE.DirectionalLight(0xffffff, 1.5)
  light2.position.set(0, -1, 0)
  scene.add(light2)
  mesh = drawTriangles(amount)
  scene.add(mesh)

  //
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  const geometry = new THREE.BufferGeometry()
  geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3))

  const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true })

  line = new THREE.Line(geometry, material)
  scene.add(line)

  //

  renderer = new THREE.WebGLRenderer({ antialias: false })
  renderer.setClearColor(scene.fog.color)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

function drawTriangles (triangles, size = 800) {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(triangles * 3 * 3)
  const normals = new Float32Array(triangles * 3 * 3)
  const colors = new Float32Array(triangles * 3 * 3)
  const color = new THREE.Color()
  const n = size
  const n2 = n / 2 // triangles spread in the cube
  const d = 120
  const d2 = d / 4 // individual triangle size

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  const cb = new THREE.Vector3()
  const ab = new THREE.Vector3()

  seed = createNArray(positions.length)
    .map(() => createNArray(12).map(() => Math.random()))

  for (let i = 0; i < positions.length; i += 9) {
    const x = seed[i][0] * n - n2
    const y = seed[i][1] * n - n2
    const z = seed[i][2] * n - n2

    const ax = x + seed[i][3] * d - d2
    const ay = y + seed[i][4] * d - d2
    const az = z + seed[i][5] * d - d2

    const bx = x + seed[i][6] * d - d2
    const by = y + seed[i][7] * d - d2
    const bz = z + seed[i][8] * d - d2

    const cx = x + seed[i][9] * d - d2
    const cy = y + seed[i][10] * d - d2
    const cz = z + seed[i][11] * d - d2

    positions[ i ] = ax
    positions[ i + 1 ] = ay
    positions[ i + 2 ] = az

    positions[ i + 3 ] = bx
    positions[ i + 4 ] = by
    positions[ i + 5 ] = bz

    positions[ i + 6 ] = cx
    positions[ i + 7 ] = cy
    positions[ i + 8 ] = cz

    // flat face normals

    pA.set(ax, ay, az)
    pB.set(bx, by, bz)
    pC.set(cx, cy, cz)

    cb.subVectors(pC, pB)
    ab.subVectors(pA, pB)
    cb.cross(ab)

    cb.normalize()

    const nx = cb.x
    const ny = cb.y
    const nz = cb.z

    normals[ i ] = nx
    normals[ i + 1 ] = ny
    normals[ i + 2 ] = nz

    normals[ i + 3 ] = nx
    normals[ i + 4 ] = ny
    normals[ i + 5 ] = nz

    normals[ i + 6 ] = nx
    normals[ i + 7 ] = ny
    normals[ i + 8 ] = nz

    // colors

    const vx = (x / n) + 0.5
    const vy = (y / n) + 0.5
    const vz = (z / n) + 0.5

    color.setRGB(vx, vy, vz)

    colors[ i ] = color.r
    colors[ i + 1 ] = color.g
    colors[ i + 2 ] = color.b

    colors[ i + 3 ] = color.r
    colors[ i + 4 ] = color.g
    colors[ i + 5 ] = color.b

    colors[ i + 6 ] = color.r
    colors[ i + 7 ] = color.g
    colors[ i + 8 ] = color.b
  }

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))

  geometry.computeBoundingSphere()

  var material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0xffffff,
    shininess: 250,
    side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors
  })

  mesh = new THREE.Mesh(geometry, material)
  return mesh
}

function updatePositions (geometry, size = 900, trianglesSize = 4) {
  const n = size
  const n2 = n / 2 // triangles spread in the cube
  const d = 120
  const d2 = d / trianglesSize // individual triangle size
  const positions = geometry.attributes.position.array

  for (let i = 0; i < positions.length; i += 9) {
    const x = (seed[i][0] * n) - n2
    const y = (seed[i][1] * n) - n2
    const z = (seed[i][2] * n) - n2

    const ax = x + (seed[i][3] * d) - d2
    const ay = y + (seed[i][4] * d) - d2
    const az = z + (seed[i][5] * d) - d2

    const bx = x + (seed[i][6] * d) - d2
    const by = y + (seed[i][7] * d) - d2
    const bz = z + (seed[i][8] * d) - d2

    const cx = x + (seed[i][9] * d) - d2
    const cy = y + (seed[i][10] * d) - d2
    const cz = z + (seed[i][11] * d) - d2

    positions[ i ] = ax
    positions[ i + 1 ] = ay
    positions[ i + 2 ] = az

    positions[ i + 3 ] = bx
    positions[ i + 4 ] = by
    positions[ i + 5 ] = bz

    positions[ i + 6 ] = cx
    positions[ i + 7 ] = cy
    positions[ i + 8 ] = cz
  }

  geometry.attributes.position.needsUpdate = true
}

function draw (freq) {
  const time = Date.now() * 0.001

  mesh.rotation.x = time * 0.40
  mesh.rotation.y = time * 0.22

  raycaster.setFromCamera(mouse, camera)

  // mesh.geometry.position.array
  updatePositions(mesh.geometry, Math.floor(freq * 1000), Math.floor(freq * 4))

  renderer.render(scene, camera)
}

module.exports = {
  init,
  draw
}
