"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class WorldState {
    // This works as a test for both 
    //1. all precondition props exist
    //2. that props match the values in the full 
    // let full = {
    //     isHungry: true,
    //     myPosX: 0,
    //     myPosY: 0,
    //     bankPosX: 100, 
    //     bankPosY: 100, 
    //     moneyOnMe: 0, 
    //     moneyAtBank: 100
    //   };
    // let preconditions = {
    //     bankPosX: 100,
    //     bankPosY: 100, 
    //     preconditionDoesntExist: true
    // };
    // let keys = Object.keys(preconditions).filter(key => preconditions[key] !== undefined);
    // let match = keys.every(key => full[key] === preconditions[key]);
    // console.log(match);
    // thats all that we need right? Dunno need to look again.
    // Check whether state's set properties match this state
    // Check whether this world state is contained within the state passed in.
    containedWithin(fullState) {
        //Get all of our properties. 
        // let ourKeys:string[] = Object.keys(this).filter(key => this[key] !== undefined);
        // //Check that all our keys exist in the fullState, 
        // //and the values for ours match the fullstates version of them.
        // return ourKeys.every(key => {
        //     if(key.startsWith("total") || key.startsWith("num") || key.startsWith("money")){
        //         return fullState[key] >= this[key]; 
        //     } 
        //     return fullState[key] === this[key];
        // });
        return _.isMatch(fullState, this);
    }
    applyTo(fullState) {
        return _.mergeWith(_.cloneDeep(fullState), this, (objValue, srcValue, key, object, source, stack) => {
            if (key.startsWith("total") || key.startsWith("num") || key.startsWith("money")) {
                if (_.isNumber(objValue) && _.isNumber(srcValue)) {
                    return Math.min(objValue + srcValue, 10);
                }
            }
            return undefined;
        });
        //return _.merge(_.cloneDeep(fullState), this);
    }
}
exports.WorldState = WorldState;
//# sourceMappingURL=worldstate.js.map