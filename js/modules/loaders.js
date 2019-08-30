/*
 *  Populate these to customize Chunks
 */ 

 'use strict';

import { DEBUG } from "./globals.js"
import { sandwichFn } from "./utility.js"

function initLead()
{
    if (DEBUG == 1) console.log("Initializing Lead Chunk")
}

function initTitle()
{
    // TODO: Can set onArrival here, and for all other Vista blocks
    if (DEBUG == 1) console.log("Initializing Title Chunk")
    this.onArrival = sandwichFn(this.onArrival.bind(this), () => {console.log(`Arriving ${this.getName()}`)})
    this.onDeparture = sandwichFn(this.onDeparture.bind(this), ()=>{}, () => {console.log(`Departing ${this.getName()}`)})

    this.addAssetPath('3d_files/') 
    //this.addAsset('PPHBED_cup.gcode')
    this.addAsset('city.glb')
}

function initTransTitleAbt()
{

    if (DEBUG == 1) console.log("Initializing Title -> About Me Chunk")
}

function initAboutMe()
{

    if (DEBUG == 1) console.log("Initializing About Me Chunk")
}

function initTransAbtProj()
{

    if (DEBUG == 1) console.log("Initializing About Me -> Projects Chunk")
}

function initProjects()
{

    if (DEBUG == 1) console.log("Initializing Projects Chunk")
}

function initFuture()
{

    if (DEBUG == 1) console.log("Initializing Future Chunk")
}

export { initLead, initTitle, initTransTitleAbt, initAboutMe, initTransAbtProj, initProjects, initFuture }