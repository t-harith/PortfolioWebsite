'use strict';

import { DEBUG } from './globals.js';

export class Chunk {
    constructor(name, length, onload) {
        this._length = length;
        this._name = name;
        this._load = onload;
        this._offset = 0; 
        
        Chunk.num_chunks++;
        Chunk.total_length += length;
    }

    load() {
        if (DEBUG == 1) console.log(`Loading chunk ${this._name}`)
        // TODO: Ideally would do parsing of a chunk file
        this._load()
        this.loadAssets()
    }

    loadAssets() {
        if (DEBUG == 1) console.log(`Loading chunk ${this._name} assets`)
    }

    offset(new_offset) {
        if(new_offset != undefined) this._offset = new_offset;
        return this._offset;
    }

    end() {
        return this._offset + this._length;
    }

    length() {
        return this._length;
    }

    updateDims() {
        //TODO: Implement resize window updates
    }

    getName() {
        return this._name;
    }
    
    static get numChunks() {
        return Chunk.num_chunks;
    }
}

Chunk.num_chunks = 0;
Chunk.total_length = 0;