'use strict';

// A function for sandwiching other functions between before and after functions
export function sandwichFn( middleFn, doBefore =()=>{}, doAfter =()=>{}) {
    if (middleFn == undefined) 
        return function() { 
            doBefore() 
            doAfter() 
        }
    else // Add the new arrival functionality after the 'b'ase arrival functionality
        return function() {
            doBefore()
            middleFn()
            doAfter()
        }
}