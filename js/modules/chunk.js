'use strict';

import { DEBUG, GRID_STEP_SZ } from './globals.js';
import { loaderLoad, addToAnimationQueue } from './model.js';
import { AnimateTask } from './AnimateTask.js';

export class Chunk {
    constructor(name, length, offset, onload) {
        this._length = length;
        this._name = name;
        this._load = onload;
        this._offset = offset; 
        this._assets_path = [];
        this._assets_names = [];
        this._mesh_array = [];
        this._prev_loc = undefined;
        
        Chunk.num_chunks++;
        Chunk.total_length += length;
    }

    load() {
        if (DEBUG == 1) console.log(`Loading chunk ${this._name}`)
        // TODO: Ideally would do parsing of a chunk file
        this._load()
        this.loadAssets()
    }

    addAssetPath(path) {
        this._assets_path.push(path)
    }
    
    addAsset(asset_fname) {
        this._assets_names.push(asset_fname)
    }

    loadAssets() {
        if (DEBUG == 1) console.log(`Loading chunk ${this._name} assets`)
        for (var i = 0; i < this._assets_names.length; ++i) {
            // TODO: functionality for multiple paths
            loaderLoad(this._assets_path[0].concat(this._assets_names[i]), this)  
        }
    }

    addMeshes(new_meshes) {
        if (DEBUG == 1) console.log(`Adding meshes to chunk ${this._name}`)
        this._mesh_array.push(...new_meshes)
        for (var i = 0; i < this._mesh_array.length; ++i) {
            this._mesh_array[i].position.setZ(this._mesh_array[i].position.z +200+ this._offset*GRID_STEP_SZ+i);
            console.log(this._mesh_array[i]) 
        }
    }

    genDisplayMeshes(scene) {
        this.meshDisplay = function(scroll_plane) {
            //TODO: Support both GCODE and GLTF in same chunk
            let sp_rel_pos = Math.abs(Math.floor(scroll_plane.position.z - GRID_STEP_SZ*this.offset()))
            if(this._mesh_array.length > 0 & this._mesh_array.parent != scene) 
                scene.add(this._mesh_array[0])
            if (this._mesh_array.length >  sp_rel_pos) {
                if ( this._prev_loc != undefined ) scene.remove(this._mesh_array[this._prev_loc])
                scene.add(this._mesh_array[ this._prev_loc = sp_rel_pos])
            } else
                this.clearLastMesh(scene)
        }
        return this.meshDisplay.bind(this)
    }

    clearLastMesh(scene) {
        if (this._prev_loc != undefined ){ 
            scene.remove(this._mesh_array[this._prev_loc])
            this._prev_loc = undefined
        }
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