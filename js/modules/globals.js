'use strict';

export const DEBUG = 1;
export const MAX_SCROLL_SPEED = 200;
export const GRID_STEP_SZ = 100;

const brown_palette = [0x372C2E, 0x563727, 0xFFFFFF, 0x7A431D, 0xDE9E48];
const pinkgray_palette = [0x2C2B30, 0x4F4F51, 0xD6D6D6, 0xF2C4CE, 0xF58F7C];
let palette = pinkgray_palette;
const COLOR_DARK = palette[0];
const COLOR_MILD = palette[1];
const COLOR_LIGHT = palette[2];
const COLOR_BOLD = palette[3];
const COLOR_ACCENT = palette[4]; 

export { COLOR_DARK, COLOR_MILD, COLOR_LIGHT, COLOR_BOLD, COLOR_ACCENT}