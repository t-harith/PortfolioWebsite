/*
 *
 *  View for Tejas Harith portfolio
 *  Designed by: Tejas Harith (tsharith@umich.edu)
 * 
 *  Last Updated: August 1, 2019
 * 
 */

'use strict';

import { DEBUG, MAX_SCROLL_SPEED } from './modules/globals.js';
import { COLOR_DARK, COLOR_MILD, COLOR_LIGHT, COLOR_BOLD, COLOR_ACCENT } from './modules/globals.js';
import { Chunk } from './modules/Chunk.js';
import { Vista } from './modules/Vista.js';
import { 
        loadLead, 
        loadTitle, 
        loadTransTitleAbt, 
        loadAboutMe, 
        loadTransAbtProj, 
        loadProjects, 
        loadFuture 
        } from './modules/loaders.js'
import { AnimateTask } from './modules/AnimateTask.js'
import { GridHelper } from './modules/GridHelper.js'
import { mouseWheelListener } from './controller.js'


let scene, camera, renderer, road, roadMap, controls
let animation_queue = []
let scroll_plane

function initialize() {
    if (DEBUG == 1) console.log("In Init")
    
    sceneSetup()
    cameraSetup()
    renderSetup()

    initRoadMap()
    loadRoadGrid()
    loadScrollPlane()
    loadRoadMap()

    if (DEBUG == 1) console.log("Initial Render of Scene")
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    render()
}

function sceneSetup() {
    if (DEBUG == 1) console.log("Scene Setup")
    scene = new THREE.Scene()
    scene.background = new THREE.Color( COLOR_LIGHT )
}

function cameraSetup() {
    if (DEBUG == 1) console.log("Camera Setup")
    const camera_start = new THREE.Vector3( 0, 0, -1000 )
    let aspect = window.innerWidth/window.innerHeight
    camera = new THREE.OrthographicCamera(1000*(aspect/-2), 1000*(aspect/2), 1000/2, 1000/-2, -2000, 3000)
    camera.position.set(camera_start.x, camera_start.y, camera_start.z)
    if (DEBUG == 1) console.log(`Camera is at (${camera.position.x}, ${camera.position.y}, ${camera.position.z}).`)
}

function renderSetup() {
    if (DEBUG == 1) console.log("Renderer Setup")
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement ); // Add renderer to <body>
}

function initRoadMap() {
    if (DEBUG == 1) console.log("Initializing Chunks in Roadmap")
    roadMap = [];
    roadMap.end = 0;
    roadMap.push = function() {
        arguments[0].offset(roadMap.end);
        roadMap.end += arguments[0].length(); 
        return Array.prototype.push.apply(this, arguments);
    }
    
    // TODO: For now manually input new chunks here, later change to parsing a chunk file
    roadMap.push(new Chunk("Lead", 10, loadLead)) // Lead of runway
    roadMap.push(new Vista("Title", 5, 2.5, loadTitle)) // Name title
    roadMap.push(new Chunk("Title -> About Me", 50, loadTransTitleAbt)) // Transition: title -> about me
    roadMap.push(new Vista("About Me", 10, 5, loadAboutMe)) // About Me
    roadMap.push(new Chunk("About Me -> Projects", 20, loadTransAbtProj)) // Transition: about me -> projects
    roadMap.push(new Vista("Projects", 20, 10, loadProjects)) // Projects
    roadMap.push(new Chunk("Future", 100, loadFuture)) // Road work ahead 

    if (DEBUG == 1) console.log(`${Chunk.numChunks} chunks added to Roadmap`)
}

function loadRoadGrid() {
    if (DEBUG == 1) console.log("Loading Road")
    // Make a grid the size of all the chunks + some overflow

    if (DEBUG == 1) console.log(`Making Road ${Chunk.total_length} long`)
    road = GridHelper(window.innerWidth/100, Chunk.total_length, 100, COLOR_MILD);
    road.position.set(0, -window.innerHeight/2, 100*Chunk.total_length/2 ); 
    road.road_start = road.position.z - 100*Chunk.total_length/2;
    road.road_end = road.position.z + 100*Chunk.total_length/2;
    scene.add(road)
}

function loadScrollPlane() {
    if (DEBUG == 1) console.log("Loading Scroll Plane")
    let scroll_plane_material = new THREE.MeshBasicMaterial( 
        {
            color: COLOR_ACCENT, 
            transparent: true,  
            opacity: 0.31
        });
    scroll_plane = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth,window.innerHeight,10), scroll_plane_material)
    console.log(scroll_plane)
    scene.add(scroll_plane)
}

function loadRoadMap() {
    if (DEBUG == 1) console.log("Loading Roadmap")
   
    // TODO: Naive preloading all chunks here. In actuality should load when approaching them
    for (var i = 0; i < Chunk.numChunks; ++i) {
        if (DEBUG == 1) console.log(roadMap[i])
        roadMap[i].load()
    }
    
}

function animate() {
    if (animation_queue.length > 0 ) requestAnimationFrame(animate)
    
    for (var i = animation_queue.length-1; i >= 0 ; --i) {
        animation_queue[i].animateTask();
        if (animation_queue[i].getToPop()) {
            animation_queue[i].animationDone()
            animation_queue.splice(i, 1); //TODO: optimize from deleting middle of array
        }
    }

    render()
}

// Exportables

function moveScrollPlane( amt_z ) {
    // If scroll plane is outside road bounds, can only scroll it back in
    if (scroll_plane.position.z < road.road_start ) {
        if (amt_z > 0) scroll_plane.position.setZ(scroll_plane.position.z + amt_z)
        else return;
    }
    else if (scroll_plane.position.z > road.road_end ) {
        if (amt_z < 0) scroll_plane.position.setZ(scroll_plane.position.z + amt_z)
        else return;
    }

    // Animate return of scroll plane to bounds. Begin animation just as scroll plane is leaving road bounds
    if ( scroll_plane.position.z + amt_z < road.road_start) {
        window.removeEventListener("mousewheel", mouseWheelListener);
        scroll_plane.position.setZ( scroll_plane.position.z + amt_z)
        addToAnimationQueue(new AnimateTask(
            'scroll-plane-bounce-start', 
            Math.ceil(Math.abs(scroll_plane.position.z)) - 1, 
            0, 
            true, 
            (val) => { scroll_plane.position.setZ(scroll_plane.position.z+1) },
            () => { window.addEventListener("mousewheel", mouseWheelListener)}))
    }
    else if (scroll_plane.position.z + amt_z > road.road_end ) {
        window.removeEventListener("mousewheel", mouseWheelListener);
        scroll_plane.position.setZ(scroll_plane.position.z + amt_z)
        addToAnimationQueue(new AnimateTask(
            'scroll-plane-bounce-end', 
            Math.ceil(Math.abs(scroll_plane.position.z-road.road_end)) - 1, 
            0, 
            true, 
            (val) => { scroll_plane.position.setZ(scroll_plane.position.z-1) },
            () => { window.addEventListener("mousewheel", mouseWheelListener)}))
    } 
    else scroll_plane.position.setZ(scroll_plane.position.z + amt_z) 
}

function addToAnimationQueue( animate_task ) {
    let call_animate = false;
    if (animation_queue.length == 0) call_animate = true;
    if (DEBUG == 1) console.log(`Adding task ${animate_task.getName()} to animation_queue`);
    animation_queue.push(animate_task);
    if (call_animate) animate()
}

function render() {
    renderer.render(scene, camera);
}

$( document ).ready(initialize);

// EXPORT functionality for controller to modify this model
export { moveScrollPlane, addToAnimationQueue, render }