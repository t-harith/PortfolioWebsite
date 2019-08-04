'use strict';

import { DEBUG, MAX_SCROLL_SPEED, GRID_STEP_SZ } from "./modules/globals.js"
import { moveScrollPlane, animateScrollPlane, render } from "./modules/model.js"
import { updateCameraView, updateRendererSize, updateScrollPlaneDims, updateRoadDims } from "./modules/model.js"
import { AnimateTask } from './modules/AnimateTask.js'

/*
 *  View Change Button
 */
document.querySelector("#view-button").addEventListener('click', viewChange)

function viewChange() {
    if(DEBUG) console.log("In viewChange")
}
 

/*
 *  Scroll Button
 */
document.querySelector("#scroll-button").addEventListener('click', scrollStep)
//TODO: Edge case where scroll button is clicked while in road end/ road start bounce animation
function scrollStep() {
    animateScrollPlane(new AnimateTask("scroll-button-clicked", 50, 0, true, callScroll ))
}

function callScroll( val ) {
    moveScrollPlane(1)
}

/*
 *  Mouse Wheel
 */
let mouse_wheel_text 
if (DEBUG) {
        mouse_wheel_text = document.body.appendChild(
            document.createElement("P").appendChild(
                document.createTextNode("Mouse Wheel Delta: --")))

        mouse_wheel_text.parentElement.id = "mouse-wheel-text";
} 

window.addEventListener('mousewheel',  mouseWheelListener);

export function mouseWheelListener( event ) {
        let delta = (event.wheelDelta > MAX_SCROLL_SPEED) ? MAX_SCROLL_SPEED : 
                    (event.wheelDelta < -MAX_SCROLL_SPEED) ? -MAX_SCROLL_SPEED: event.wheelDelta;
        moveScrollPlane(delta);
        if(DEBUG) mouse_wheel_text.textContent = `Mouse Wheel Delta: ${delta}`;
        render();
}

/*
 *  Window Resize
 */
window.addEventListener('resize', windowResizeListener , false);

export function windowResizeListener( event ) {
    const aspect = window.innerWidth/window.innerHeight;
    updateCameraView(aspect)
    updateRendererSize(window.innerWidth, window.innerHeight) 
    updateScrollPlaneDims(
        GRID_STEP_SZ*Math.ceil(window.innerWidth/GRID_STEP_SZ) ,
        GRID_STEP_SZ*Math.ceil(window.innerHeight/GRID_STEP_SZ),
        10)
    updateRoadDims(
        GRID_STEP_SZ*Math.ceil(window.innerWidth/GRID_STEP_SZ) ,
        GRID_STEP_SZ*Math.ceil(window.innerHeight/GRID_STEP_SZ))
    render()
}