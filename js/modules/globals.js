'use strict';

export const DEBUG = 1;
export const STANDARD_CHUNK_SCROLL_SPEED = 50;
export let MAX_FORW_SCROLL_SPEED = 100;
export let MAX_BACK_SCROLL_SPEED = 100;
export const GRID_STEP_SZ = 100;

const brown_palette = [0x372C2E, 0x563727, 0xFFFFFF, 0x7A431D, 0xDE9E48];
const pinkgray_palette = [0x2C2B30, 0x4F4F51, 0xD6D6D6, 0xF2C4CE, 0xF58F7C];
let palette = brown_palette;
const COLOR_DARK = palette[0];
const COLOR_MILD = palette[1];
const COLOR_LIGHT = palette[2];
const COLOR_BOLD = palette[3];
const COLOR_ACCENT = palette[4]; 

export function setMAX_SCROLL_SPEED(val, dir=0) {
    if( dir < 0 ) MAX_BACK_SCROLL_SPEED = val
    else if (dir > 0) MAX_FORW_SCROLL_SPEED = val
    else MAX_BACK_SCROLL_SPEED = MAX_FORW_SCROLL_SPEED = val
}

export { COLOR_DARK, COLOR_MILD, COLOR_LIGHT, COLOR_BOLD, COLOR_ACCENT}