import { Chunk } from "./Chunk.js"
import { sandwichFn } from "./utility.js"
import { animateScrollPlane } from "./model.js"

'use strict';

export class Vista extends Chunk {
    constructor(name, length, stop_pos, _onLoad, _onArrival, _onDeparture) {
        super(name, length, _onLoad); 
        this._stop_pos = stop_pos;
        this.onArrival = sandwichFn( _onArrival, approachStopPos, ()=>{});
        this.onDeparture = sandwichFn( _onDeparture, ()=>{}, () => {console.log('JAJA')});
    }

}

function approachStopPos() {
    
}
