import './style.css'
// import javascriptLogo from './javascript.svg'
// import { setupCounter } from './counter.js'

import * as THREE from 'three'
import gsap from "gsap"
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

//Scene
const scene = new THREE.Scene()

//Create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
    roughness: 0.5,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
light.intensity = 1.25
scene.add(light)

//Camera
/**
 * fov(field of view), > +/- 50 gives distortion  
 * ratio
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
//any units below. If house, can consider it 20 meters, a small item 20cm... 
camera.position.z = 20
scene.add(camera)

//Renderer, Render scene on screen
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas
})
//define how big camera is and where to render scene
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)


//Controls
/**
 * allow the camera to orbit around a target
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false //moving with right click
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener('resize', () => {
    //Update Sizes
    console.log(window.innerWidth)
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update camera
    camera.aspect = sizes.width / sizes.height
    //keep ratio of scene when resizeing
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

const animate = () => {
    // mesh.position.x += 0.2
    //keeps animation after letting go of click (moving)
    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
}

animate()

//Timeline magic, synchronize multiple animations together
const tl = gsap.timeline({
    defaults: {
        duration: 1
    }
})

tl.fromTo(mesh.scale, {
    z: 0,
    x: 0,
    y: 0
}, {
    z: 1,
    x: 1,
    y: 1
})
tl.fromTo('nav', {
    y: '-100%'
}, {
    y: '0%'
})
tl.fromTo('.title', {
    opacity: 0
}, {
    opacity: 1
})

//Mouse animation color
let mouseDown = false
let rgb = [] //0-255
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))
window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150 //blue
        ]

        //animate
        //rgb(0,100,150)
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
})