import { Chunk } from "./chunk.js"

'use strict';

export class Vista extends Chunk {
    constructor(name, length, stop_pos, onload, onArrival, onDeparture) {
        super(name, length, onload); 
        this.stop_pos = stop_pos;
        this.onArrival = onArrival;
        this.onDeparture = onDeparture;
        
    }

}