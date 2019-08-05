'use strict';


export class AnimateTask {
    constructor( name, num_keyframes, start_keyframe, one_shot, callback_fn, anim_done_fn) {
        this._name = name;
        this._num_keyframes = num_keyframes;
        this._one_shot = one_shot;
        this._callback_fn = callback_fn;
        this._current_frame = start_keyframe;
        this._to_pop = false;
        this._anim_done_fn = anim_done_fn;
    }

    animateTask() {
        this._callback_fn(this._current_frame++);
        if (this._current_frame == this._num_keyframes) {
            if (this._one_shot) this._to_pop = true;
            else this._current_frame = this._start_keyframe;
        }
    }

    animationDone() {
        if(this._anim_done_fn != undefined) this._anim_done_fn();
    }

    setToPop( pop ) {
        this._to_pop = pop;
    }

    getToPop() {
        return this._to_pop;
    }

    getName() {
        return this._name;
    }
}