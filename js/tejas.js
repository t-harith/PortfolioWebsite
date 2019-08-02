/*
 *
 *  View for Tejas Harith portfolio
 *  Designed by: Tejas Harith (tsharith@umich.edu)
 * 
 *  Last Updated: August 1, 2019
 * 
 */

'use strict';

import { DEBUG } from './modules/globals.js';
import { COLOR_DARK, COLOR_MILD, COLOR_LIGHT, COLOR_BOLD, COLOR_ACCENT } from './modules/globals.js';
import { Chunk } from './modules/chunk.js';
import { Vista } from './modules/vista.js';
import { 
        loadLead, 
        loadTitle, 
        loadTransTitleAbt, 
        loadAboutMe, 
        loadTransAbtProj, 
        loadProjects, 
        loadFuture 
        } from './modules/loaders.js'


let scene, camera, renderer, roadMap

function initialize() {
    if (DEBUG == 1) console.log("In Init")
    
    sceneSetup()
    cameraSetup()
    renderSetup()
    loadRoadMap()
}

function sceneSetup() {
    if (DEBUG == 1) console.log("Scene Setup")
    scene = new THREE.Scene()
    scene.background = new THREE.Color( COLOR_LIGHT )
}

function cameraSetup() {
    if (DEBUG == 1) console.log("Camera Setup")
    const camera_start = new THREE.Vector3( 0, 0, 1000 )
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

function loadRoadMap() {
    if (DEBUG == 1) console.log("Loading Roadmap")
    roadMap = [];

    // TODO: For now manually input new chunks here, later change to parsing a chunk file
    roadMap.push(new Chunk("Lead", 10, loadLead)) // Lead of runway
    roadMap.push(new Vista("Title", 5, 2.5, loadTitle)) // Name title
    roadMap.push(new Chunk("Title -> About Me", 50, loadTransTitleAbt)) // Transition: title -> about me
    roadMap.push(new Vista("About Me", 10, 5, loadAboutMe)) // About Me
    roadMap.push(new Chunk("About Me -> Projects", 20, loadTransAbtProj)) // Transition: about me -> projects
    roadMap.push(new Vista("Projects", 20, 10, loadProjects)) // Projects
    roadMap.push(new Chunk("Future", 100, loadFuture)) // Road work ahead 

    if (DEBUG == 1) console.log(`${Chunk.numChunks} chunks added to Roadmap`)
   
    // TODO: Naive preloading all chunks here. In actuality should load when approaching them
    for (var i = 0; i < Chunk.numChunks; ++i) {
        console.log(roadMap[i])
        roadMap[i].load()
    }
    
}

$( document ).ready(initialize);