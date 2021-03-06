'use strict';

import { DEBUG,  GRID_STEP_SZ, setMAX_SCROLL_SPEED, STANDARD_CHUNK_SCROLL_SPEED } from './globals.js';
import { COLOR_DARK, COLOR_MILD, COLOR_LIGHT, COLOR_BOLD, COLOR_ACCENT } from './globals.js';
import { Chunk } from './Chunk.js';
import { Vista } from './Vista.js';
import { 
        initLead, 
        initTitle, 
        initTransTitleAbt, 
        initAboutMe, 
        initTransAbtProj, 
        initProjects, 
        initFuture 
        } from './loaders.js'
import { AnimateTask } from './AnimateTask.js'
import { GridHelper } from './GridHelper.js'
import { sandwichFn } from './utility.js'

const camera_start = new THREE.Vector3( 0, 0, -1000 )
const State = { TWO_D: 2, THREE_D: 3 }
const MeshType = { GLTF: 0, GCODE: 1}

let animation_queue = []
let scroll_plane
let scene, camera, renderer, road, roadMap, controls, state
let gltf_loader, gcode_loader

function sceneSetup() {
    if (DEBUG == 1) console.log("Scene Setup")
    scene = new THREE.Scene()
    scene.background = new THREE.Color( COLOR_DARK )
}

function cameraSetup() {
    if (DEBUG == 1) console.log("Camera Setup")
    let aspect = window.innerWidth/window.innerHeight
    camera = new THREE.OrthographicCamera(
        1000*(aspect/-2),
        1000*(aspect/2), 
        1000/2, 
        1000/-2, 
        -camera_start.z, 
        -camera_start.z + 5
        )
    camera.position.set(camera_start.x, camera_start.y, camera_start.z)
    camera.updateProjectionMatrix();
    if (DEBUG == 1) console.log(`Camera is at (${camera.position.x}, ${camera.position.y}, ${camera.position.z}).`)
    state = State.TWO_D;
}

function renderSetup() {
    if (DEBUG == 1) console.log("Renderer Setup")
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = false;
    document.body.appendChild( renderer.domElement ); // Add renderer to <body>
}

function loadLoader() {
    if (DEBUG == 1) console.log("Loading GLTF Loader")
    gltf_loader = new THREE.GLTFLoader()
    gcode_loader = new THREE.GCodeLoader()
    gcode_loader.splitLayer = true;
}

function initRoadMap() {
    if (DEBUG == 1) console.log("Initializing Chunks in Roadmap")
    roadMap = [];
    roadMap.end = 0;
    roadMap.push = function() {
        roadMap.end += arguments[0].length(); 
        return Array.prototype.push.apply(this, arguments);
    }
    
    // TODO: For now manually input new chunks here, later change to parsing a chunk file
    roadMap.push(new Chunk("lead", 10, roadMap.end, initLead)) // Lead of runway
    roadMap.push(new Vista("title", 20, 10, roadMap.end, initTitle)) // Name title
    roadMap.push(new Chunk("title-about-me", 50, roadMap.end, initTransTitleAbt)) // Transition: title -> about me
    roadMap.push(new Vista("about-me", 20, 5, roadMap.end, initAboutMe)) // About Me
    roadMap.push(new Chunk("about-me-projects", 20, roadMap.end, initTransAbtProj)) // Transition: about me -> projects
    roadMap.push(new Vista("projects", 20, 15, roadMap.end, initProjects)) // Projects
    roadMap.push(new Chunk("future", 100, roadMap.end, initFuture)) // Road work ahead 

    if (DEBUG == 1) console.log(`${Chunk.numChunks} chunks added to Roadmap`)
}

function loadRoadGrid() {
    if (DEBUG == 1) console.log("Loading Road")
    // Make a grid the size of all the chunks + some overflow
    // floor and ceil being used so that scroll plane meshes well with road grid and no broken grid squares
    if (DEBUG == 1) console.log(`Making Road ${Chunk.total_length} long`)
    road = GridHelper(Math.ceil(window.innerWidth/GRID_STEP_SZ), Chunk.total_length, GRID_STEP_SZ, COLOR_MILD);
    road.name = "road"
    road.position.set(0, GRID_STEP_SZ*Math.floor(-window.innerHeight/GRID_STEP_SZ)/2, GRID_STEP_SZ*Chunk.total_length/2 ); 
    road.road_start = road.position.z - GRID_STEP_SZ*Chunk.total_length/2;
    road.road_end = road.position.z + GRID_STEP_SZ*Chunk.total_length/2;
    road.visible = false;
    scene.add(road)
}

function loadScrollPlane() {
    if (DEBUG == 1) console.log("Loading Scroll Plane")
    setMAX_SCROLL_SPEED(STANDARD_CHUNK_SCROLL_SPEED);
    let scroll_plane_material = new THREE.MeshBasicMaterial( 
        {
            color: COLOR_ACCENT, 
            transparent: true,  
            opacity: 0.31
        });
    scroll_plane = new THREE.Mesh(new THREE.BoxGeometry(
        GRID_STEP_SZ*Math.ceil(window.innerWidth/GRID_STEP_SZ),
        GRID_STEP_SZ*Math.ceil(window.innerHeight/GRID_STEP_SZ)
        ,100), scroll_plane_material)
    scroll_plane.name = "scroll-plane"
    scroll_plane.road_map_idx = 0;
    scroll_plane.listeners = [];
    scroll_plane.addListener = (func) => { 
        if ( func != undefined ) {
            func.id = (scroll_plane.listeners.length == 0) ? 1 : 
                scroll_plane.listeners[scroll_plane.listeners.length-1].id + 1
            scroll_plane.listeners.push(func)
            return func.id;
        }
    }
    scroll_plane.removeListener = (func) => {
        if ( func == undefined ) return; 
        else { 
            for ( var i = 0; i < scroll_plane.listeners.length; ++i ) {
                if ( scroll_plane.listeners[i].id == func.id ) {
                    scroll_plane.listeners.splice(i,1)
                    return
                }
            }
        }
    }
    scroll_plane.addListener((sp) => {camera.position.z = sp.position.z + camera_start.z})
    scroll_plane.position.setZ = (val) => { 
        scroll_plane.position.z = val;
        for ( var i = 0; i < scroll_plane.listeners.length; ++i)
            if(scroll_plane.listeners[i] != undefined) scroll_plane.listeners[i](scroll_plane);
    }
    console.log(scroll_plane)
    scroll_plane.addAnimation = function ( anim_task ) {
        // Only one animation task for scroll_plane at a time
        if (this._anim_task != undefined) {
            // If an animation task already exists, kill it and add the new task when first task terminates
            this._anim_task.setToPop(true);
            this._anim_task.animationDone = () => {
                scroll_plane.removeAnimation();
                scroll_plane._anim_task = anim_task;
                addToAnimationQueue(scroll_plane._anim_task)
            }
        } else {
            this._anim_task = anim_task;
            addToAnimationQueue(this._anim_task)
        }
    }
    scroll_plane.removeAnimation = function () {
        this._anim_task = undefined;
    }
    scene.add(scroll_plane)
}

function loadRoadMap() {
    if (DEBUG == 1) console.log("Loading Roadmap")
   
    // TODO: Naive preloading all chunks here. In actuality should load when approaching them
    for (var i = 0; i < Chunk.numChunks; ++i) {
        if (DEBUG == 1) console.log(roadMap[i])
        roadMap[i].load()
    }
    
    scroll_plane.addListener((sp) => {
        if(sp.road_map_idx < (roadMap.length - 1) &&
            sp.position.z/GRID_STEP_SZ > roadMap[sp.road_map_idx].end()) {
            leaveRoadChunk(sp.road_map_idx++)
            enterRoadChunk(sp.road_map_idx)
        }
        else if (sp.road_map_idx > 0 &&
            sp.position.z/GRID_STEP_SZ < roadMap[sp.road_map_idx].offset()) {
            leaveRoadChunk(sp.road_map_idx--)
            enterRoadChunk(sp.road_map_idx)
        }
    })
    
}

function genControls() {
    if (DEBUG == 1) console.log("Initial Render of Scene")
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    controls.enabled = false;
}

function animate() {
    if (animation_queue.length > 0 ) requestAnimationFrame(animate)
    
    for (var i = animation_queue.length-1; i >= 0 ; --i) {
        if (animation_queue[i].getToPop()) {
            animation_queue[i].animationDone()
            animation_queue.splice(i, 1); //TODO: optimize from deleting middle of array
        } else {
            animation_queue[i].animateTask();
        }
    }
    render()
}

/*
 *  Helpers
 */

function grabMesh( _mesh, _mesh_type) {
    if (DEBUG == 1) console.log('Grabbing Mesh')
    // TODO: Implement GLTF Loading for 3D view
    if ( _mesh_type == MeshType.GLTF ) {
        let mesh_arr = [];
        _mesh.scene.traverse( function (node) { if(node.isMesh) { 
            node.material = new THREE.MeshBasicMaterial( 
                {
                    side: THREE.DoubleSide,
                    color: COLOR_ACCENT, 
                    wireframe: false
                } );
            //TODO: Some standardized approach to scaling and rotating meshes
            node.scale.set(2, 2, 2);
            node.rotation.x += -Math.PI/2
            node.position.y -= 650
            node.position.x += 150
            mesh_arr.push(node); 
        } });
        return mesh_arr;
    } else if ( _mesh_type == MeshType.GCODE ) {
        return _mesh.children;
    }
}

function leaveRoadChunk( road_map_idx ) {
    if (DEBUG == 1) console.log(`Leaving road chunk ${roadMap[road_map_idx].getName()}`)
    // load meshes
    scroll_plane.removeListener(roadMap[road_map_idx].meshDisplay)
    roadMap[road_map_idx].clearLastMesh(scene);
    //scroll_plane.removeListener(roadMap[road_map_idx].domDisplay)
    if (roadMap[road_map_idx].onDeparture != undefined) roadMap[road_map_idx].onDeparture();
}

function enterRoadChunk( road_map_idx ) {
    if (DEBUG == 1) console.log(`Entering road chunk ${roadMap[road_map_idx].getName()}`)
    // load meshes
    var id;
    id = scroll_plane.addListener(roadMap[road_map_idx].genDisplayMeshes(scene))
    roadMap[road_map_idx].meshDisplay.id  = id
    //if(roadMap[road_map_idx].genDOMElems != undefined) {
    //    id = scroll_plane.addListener(roadMap[road_map_idx].genDOMElems(window))
    //    roadMap[road_map_idx].domDisplay.id = id
    //}
    if (roadMap[road_map_idx].onArrival != undefined) roadMap[road_map_idx].onArrival();
}

function swooshEntry() {
    // TODO: Implement swoosh entry
    enterRoadChunk(0);
}

/*
 *  Controller+ Exportables
 */

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
    else if ( scroll_plane.position.z + amt_z < road.road_start) {
        scroll_plane.position.setZ( scroll_plane.position.z + amt_z)
        scroll_plane.addAnimation( new AnimateTask(
            'scroll-plane-bounce-start', 
            Math.ceil(Math.abs(scroll_plane.position.z)) - 1, 
            0, 
            true, 
            (frame_num) => { 
                scroll_plane.position.setZ(Math.ceil(scroll_plane.position.z)+1);
                if (scroll_plane.position.z > road.road_start) scroll_plane._anim_task.setToPop(true) 
                },
            () => { scroll_plane.removeAnimation() }))
    }
    else if (scroll_plane.position.z + amt_z > road.road_end ) {
        scroll_plane.position.setZ(scroll_plane.position.z + amt_z)
        scroll_plane.addAnimation( new AnimateTask(
            'scroll-plane-bounce-end', 
            Math.ceil(Math.abs(scroll_plane.position.z-road.road_end)) - 1, 
            0, 
            true, 
            (frame_num) => { 
                scroll_plane.position.setZ(Math.ceil(scroll_plane.position.z)-1) 
                if (scroll_plane.position.z < road.road_end) scroll_plane._anim_task.setToPop(true) 
                },
            () => { scroll_plane.removeAnimation() }))
    } 
    else scroll_plane.position.setZ(scroll_plane.position.z + amt_z) 
}

function updateCameraView(aspect) {
    camera.left = -1000 * aspect/2;
    camera.right = 1000 * aspect/2;
    camera.top = 1000/2;
    camera.bottom = -1000/2; 
    camera.updateProjectionMatrix();
}

function updateCameraClip(_near, _far) {
    camera.near = _near;
    camera.far = _far;
    camera.updateProjectionMatrix();
}

function updateRendererSize(width, height) {
    renderer.setSize( width, height);
}

function updateScrollPlaneDims(width, height, depth) {
    scroll_plane.scale.x = width/scroll_plane.geometry.parameters.width
    scroll_plane.scale.y = height/scroll_plane.geometry.parameters.height
    scroll_plane.scale.z = depth/scroll_plane.geometry.parameters.depth
}

function updateRoadDims(width, height) {
    scene.remove(road);
    road = GridHelper(width/GRID_STEP_SZ, Chunk.total_length, GRID_STEP_SZ, COLOR_MILD);
    road.name = "road"
    road.position.set(0, -height/2, GRID_STEP_SZ*Chunk.total_length/2 ); 
    road.road_start = road.position.z - GRID_STEP_SZ*Chunk.total_length/2;
    road.road_end = road.position.z + GRID_STEP_SZ*Chunk.total_length/2;
    for(var i = 0; i < roadMap.length; ++i) {
        roadMap[i].updateDims()
    }
    scene.add(road)
}

function addToAnimationQueue( animate_task) {
    let call_animate = false;
    if (animation_queue.length == 0) call_animate = true;
    if (DEBUG == 1) console.log(`Adding task ${animate_task.getName()} to animation_queue`);
    animation_queue.push(animate_task);
    if (call_animate) animate()
}

function animateScrollPlane(anim_task) {
    console.log(anim_task)
    anim_task.animationDone = sandwichFn(anim_task.animationDone.bind(anim_task), 
        ()=>{},
        scroll_plane.removeAnimation.bind(scroll_plane))

    scroll_plane.addAnimation(anim_task)
}

function getCurrentScrollPos() {
    return scroll_plane.position.z;
}

function toggleState() {
    if (state == State.TWO_D) {
        state = State.THREE_D;
        controls.enabled = false;
        updateCameraClip(-2000, 3000)
        road.visible = true;
    } else {
        state = State.TWO_D;
        controls.enabled = false;
        updateCameraClip(1000,1005)
        camera.position.set(camera_start.x, camera_start.y, getCurrentScrollPos() + camera_start.z); 
        camera.lookAt(scroll_plane.position)
        camera.updateProjectionMatrix();
        road.visible = false;
    }
    render()
}

function loaderLoad(path, caller) {
    let ftype = path.indexOf(".")
    if (path.substring(ftype) == ".gcode") {
        gcode_loader.load(
            path, 
            COLOR_ACCENT, 
            (_mesh) => { caller.addMeshes(grabMesh(_mesh, MeshType.GCODE), MeshType.GCODE) }, 
            undefined, 
            (err)=>{console.log(`Error in loaderLoad ${err}`)}
            )
    } else if ( path.substring(ftype) == ".glb" || path.substring(ftype) == ".gltf") {
        gltf_loader.load(
            path, 
            (_mesh) => { caller.addMeshes(grabMesh(_mesh, MeshType.GLTF), MeshType.GLTF) }, 
            undefined, 
            (err)=>{console.log(`Error in loaderLoad ${err}`)}
            )
    } else {
        console.error(`Unsupported File Type ${path.substring(ftype)}`)
    }
}

function render() {
    renderer.render(scene, camera);
}

// EXPORT functionality for controller to modify this model
export { addToAnimationQueue, moveScrollPlane, animateScrollPlane, getCurrentScrollPos, render, loaderLoad}
export { updateCameraView, updateRendererSize, updateScrollPlaneDims, updateRoadDims, updateCameraClip }
export { toggleState, MeshType }
export { 
        sceneSetup, 
        cameraSetup, 
        renderSetup, 
        initRoadMap, 
        loadRoadGrid, 
        loadScrollPlane, 
        loadRoadMap,
        loadLoader, 
        genControls, 
        swooshEntry
    }