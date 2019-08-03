'use strict';

import { DEBUG } from "./globals.js"

export function GridHelper( numx, numy, step, col ) {
    if (DEBUG == 1) console.log("In GridHelper")
    const halfSizeX = (numx*step) / 2;
    const halfSizeY = (numy*step) / 2;
    let color = new THREE.Color(col);
    let vertices = [], colors = [];

    for ( var i = 0, j = 0, k = - halfSizeY; i <= numy; i ++, k += step ) {

        vertices.push( - halfSizeX, 0, k, halfSizeX, 0, k);


        color.toArray( colors, j ); j += 3;
        color.toArray( colors, j ); j += 3;
        color.toArray( colors, j ); j += 3;
        color.toArray( colors, j ); j += 3;

    }

    for ( var i = 0, k = - halfSizeX; i <= numx; i ++, k += step ) {

        vertices.push( k, 0, - halfSizeY, k, 0, halfSizeY );

        color.toArray( colors, j ); j += 3;
        color.toArray( colors, j ); j += 3;
        color.toArray( colors, j ); j += 3;
        color.toArray( colors, j ); j += 3;

    }

    let geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    let material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

    return new THREE.LineSegments(geometry, material);

}

GridHelper.prototype = Object.assign( Object.create( THREE.LineSegments.prototype ), {

    constructor: GridHelper, 

    copy: function ( source ) {

        THREE.LineSegments.prototype.copy.call( this, source );

        this.geometry.copy( source.geometry );
        this.material.copy( source.material );

        return this;

    },

    clone: function () {

        return new this.constructor().copy( this );

    }

} );