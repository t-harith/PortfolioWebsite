/*
 *
 *  @Description: View for Tejas Harith's portfolio
 *  @Designer: Tejas Harith (tsharith@umich.edu)
 * 
 *  @Date: August 4, 2019
 *
 *  TODO:
 *      [ ] Awareness of scroll plane location
 *      [ ] Scroll Damping on arrival at vista
 *      [ ] Scroll button should jump form vista to vista 
 *      [ ] Swoosh scroll entry 
 *      [ ] Chunk load on scroll arrival
 *      [ ] HTML text placement overlay
 */

'use strict';

import { DEBUG } from './modules/globals.js';
import { 
    sceneSetup, 
    cameraSetup, 
    renderSetup, 
    initRoadMap, 
    loadRoadGrid, 
    loadScrollPlane, 
    loadRoadMap, 
    loadLoader, 
    genControls, 
    render,
    swooshEntry
    } from './modules/model.js'


function initialize() {
    if (DEBUG == 1) console.log("In Init")
    
    sceneSetup()
    cameraSetup()
    renderSetup()
    loadLoader()

    initRoadMap()
    loadRoadGrid()
    loadScrollPlane()
    loadRoadMap()

    render()
    if (DEBUG ==1) genControls() 
    swooshEntry()
}

$( document ).ready(initialize);