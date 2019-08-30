'use strict';

import { DEBUG, GRID_STEP_SZ } from './globals.js';
import { loaderLoad, addToAnimationQueue, MeshType } from './model.js';
import { AnimateTask } from './AnimateTask.js';

export class Chunk {
    constructor(name, length, offset, onload) {
        this._length = length;
        this._name = name;
        this._load = onload;
        this._offset = offset; 
        this._assets_path = [];
        this._assets_names = [];
        this.gcode_mesh_array = []; // layer indexing
        this.gltf_mesh_array = [];
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

    addMeshes(new_meshes, mesh_type) {
        if (DEBUG == 1) console.log(`Adding meshes to chunk ${this._name}`)
        let mesh_array
        if ( mesh_type == MeshType.GCODE ) {
            mesh_array = this.gcode_mesh_array;
            let start_index = mesh_array.length
            mesh_array.push(...new_meshes)
            for (var i = start_index; i < mesh_array.length; ++i) {
                mesh_array[i].position.setZ(mesh_array[i].position.z + this._offset*GRID_STEP_SZ+i);
            }
        }
        else if ( mesh_type == MeshType.GLTF ) {
            mesh_array = this.gltf_mesh_array;
            let start_index = mesh_array.length
            mesh_array.push(...new_meshes)
            for (var i = start_index; i < mesh_array.length; ++i) {
                //TODO: Fix '+200' which is added to prevent objects being placed outside the chunk
                mesh_array[i].position.setZ(mesh_array[i].position.z + 200 + this._offset*GRID_STEP_SZ);
            }
        }
    }

    genDisplayMeshes(scene) {
        this.meshDisplay = function(scroll_plane) {
            //TODO: Support both GCODE and GLTF in same chunk [DONE]
            let sp_rel_pos = Math.abs(Math.floor(scroll_plane.position.z - GRID_STEP_SZ*this.offset()))
            if(this.gltf_mesh_array.length > 0 && this.gltf_mesh_array.active != true) {
                this.gltf_mesh_array.forEach((ea)=>{scene.add(ea)})
                this.gltf_mesh_array.active = true
            }
            if (this.gcode_mesh_array.length >  sp_rel_pos) {
                if ( this._prev_loc != undefined ) scene.remove(this.gcode_mesh_array[this._prev_loc])
                scene.add(this.gcode_mesh_array[ this._prev_loc = sp_rel_pos])
            } else
                if (this._prev_loc != undefined ){ 
                    scene.remove(this.gcode_mesh_array[this._prev_loc])
                    this._prev_loc = undefined
                }
        }
        return this.meshDisplay.bind(this)
    }

    clearLastMesh(scene) {
        if (this._prev_loc != undefined ){ 
            scene.remove(this.gcode_mesh_array[this._prev_loc])
            this._prev_loc = undefined
        }
        this.gltf_mesh_array.forEach((ea)=>{scene.remove(ea)})
        this.gltf_mesh_array.active = false;
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