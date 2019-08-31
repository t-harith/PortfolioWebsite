import { Chunk } from "./Chunk.js"
import { sandwichFn } from "./utility.js"
import { moveScrollPlane, animateScrollPlane, getCurrentScrollPos, addToAnimationQueue } from "./model.js"
import { AnimateTask } from "./AnimateTask.js";
import { mouseWheelListener } from "../controller.js";
import { GRID_STEP_SZ,  setMAX_SCROLL_SPEED, STANDARD_CHUNK_SCROLL_SPEED } from "./globals.js";

'use strict';

export class Vista extends Chunk {
    constructor(name, length, stop_pos, offset, _onLoad, _onArrival, _onDeparture) {
        super(name, length, offset, _onLoad); 
        this._stop_pos = stop_pos;
        this.onArrival = sandwichFn( _onArrival, arrivalSlowDown(name, GRID_STEP_SZ*(offset + stop_pos)), genLaunchDOMs(name));
        this.onDeparture = sandwichFn( _onDeparture, departSlowDown(name, GRID_STEP_SZ*(offset + stop_pos)), genClearDOMs(name));
        //this.boot = false;
    }

    genDOMElems(window) {
        this.domDisplay = function(scroll_plane) {
            if ( this.boot == false && Math.abs(getCurrentScrollPos() - GRID_STEP_SZ*(this._offset + this._stop_pos)) < 100 ) {
                //console.log("<_@@#@#@#>")
                //$("#test").delay(1000).animate({"opacity": "1"}, 700);
                //this.boot = true;
            }
        }
        return this.domDisplay.bind(this)
    }

}

function arrivalSlowDown(name, abs_pos) {
    return ()=> {
        let func = ( getCurrentScrollPos() < abs_pos ) ? 
            (val)=>{
                let arr = [1,2,3]
                setMAX_SCROLL_SPEED(Math.floor(STANDARD_CHUNK_SCROLL_SPEED/arr[val]), 1)
            } :
            (val)=>{
                let arr_bck =[1,2,2]
                let arr_frw =[1,2,3]
                setMAX_SCROLL_SPEED(Math.floor(STANDARD_CHUNK_SCROLL_SPEED/arr_bck[val]), -1)
                setMAX_SCROLL_SPEED(Math.floor(STANDARD_CHUNK_SCROLL_SPEED/arr_frw[val]), 1)
            }
        addToAnimationQueue(new AnimateTask(
            `approach-${name}`,
            3,
            0,
            true,
            func
       ))
    }
}

function departSlowDown(name) {
    return ()=> {
        addToAnimationQueue(new AnimateTask(
            `depart-${name}`,
            3,
            0,
            true,
            (val)=>{ 
                setMAX_SCROLL_SPEED(Math.floor(STANDARD_CHUNK_SCROLL_SPEED/(3-val)))
            }
        ))
    }
}

function approachStopPos(name, stop_pos, offset) {
    return ()=> {
        let num_keyframes = getCurrentScrollPos() - GRID_STEP_SZ*(offset + stop_pos)
        let dir = (num_keyframes > 0) ? -1 : 1
        if (dir < 0) return;
        window.removeEventListener("mousewheel", mouseWheelListener )              
        animateScrollPlane(new AnimateTask(
            `approach-${name}`,
            Math.floor(Math.abs(num_keyframes)/5),
            0,
            true,
            ()=>{ moveScrollPlane(5*dir); },
            ()=>{window.addEventListener("mousewheel", mouseWheelListener)}
            ))
    }
}

function genLaunchDOMs(_name) {
    return ()=>{
        $(`#${_name}`).scrollTop($(`#${_name}`).attr('last-scroll'))
        $(`#${_name}`).delay(200).animate({"opacity": "1"}, 
            700,
            "swing",
            ()=>{$(`#${_name}`).attr('class', `scrollable`);}
        );
        
    }
}

function genClearDOMs(_name) {
    return ()=>{
        $(`#${_name}`).delay(200).animate({"opacity": "0"}, 
            700,
            "swing",
            ()=>{$(`#${_name}`).attr('class', `not-scrollable`);}
        );
        $(`#${_name}`).attr('last-scroll',$(`#${_name}`).scrollTop());
    }

}
