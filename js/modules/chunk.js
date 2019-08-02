'use strict';

import { DEBUG } from './globals.js';

export class Chunk {
    constructor(name, length, onload) {
        this.length = length;
        this.name = name;
        this.load = onload;
        
        
        Chunk.num_chunks++;
    }

    load() {
        if (DEBUG == 1) console.log(`Loading chunk ${this.name}`)
        // TODO: Ideally would do parsing of a chunk file
        this.loadAssets()
    }

    loadAssets() {
        if (DEBUG == 1) console.log(`Loading chunk ${this.name} assets`)
    }

    static get numChunks() {
        return Chunk.num_chunks;
    }
}

Chunk.num_chunks = 0;