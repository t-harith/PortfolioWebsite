/*
 *  Populate these to customize Chunks
 */ 

 'use strict';

import { DEBUG } from "./globals.js"
import { sandwichFn } from "./utility.js"

function loadLead()
{
    if (DEBUG == 1) console.log("Loading Lead Chunk")
}

function loadTitle()
{
    // TODO: Can set onArrival here, and for all other Vista blocks
    if (DEBUG == 1) console.log("Loading Title Chunk")
    this.onArrival = sandwichFn(this.onArrival.bind(this), () => {console.log(`Arriving ${this.getName()}`)})
    this.onDeparture = sandwichFn(this.onDeparture.bind(this), ()=>{}, () => {console.log(`Departing ${this.getName()}`)})
}

function loadTransTitleAbt()
{

    if (DEBUG == 1) console.log("Loading Title -> About Me Chunk")
}

function loadAboutMe()
{

    if (DEBUG == 1) console.log("Loading About Me Chunk")
}

function loadTransAbtProj()
{

    if (DEBUG == 1) console.log("Loading About Me -> Projects Chunk")
}

function loadProjects()
{

    if (DEBUG == 1) console.log("Loading Projects Chunk")
}

function loadFuture()
{

    if (DEBUG == 1) console.log("Loading Future Chunk")
}

export { loadLead, loadTitle, loadTransTitleAbt, loadAboutMe, loadTransAbtProj, loadProjects, loadFuture }