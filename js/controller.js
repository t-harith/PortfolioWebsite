'use strict';

import { DEBUG, MAX_SCROLL_SPEED } from "./modules/globals.js"
import { moveScrollPlane, addToAnimationQueue, render } from "./tejas.js"
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

function scrollStep() {
    if(DEBUG) console.log("In scrollStep")
    addToAnimationQueue(new AnimateTask("scroll-plane", 50, 0, true, callScroll ))
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