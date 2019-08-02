'use strict';

import { DEBUG } from "./modules/globals.js"

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

window.addEventListener('mousewheel',  function (event)
    {
        if(DEBUG) mouse_wheel_text.textContent = `Mouse Wheel Delta: ${event.wheelDelta}`;
    });