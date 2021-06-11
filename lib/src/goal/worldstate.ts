import * as _ from "lodash";

export class WorldState{
    //GOAL specific properties
    //Descriptors of the world.
    hungry:boolean;
    moneyWithMe:number;
    moneyAtBank:number;
    numFoodRecipes:number;
    myPosX:number;
    myPosY:number;
    recipePosX:number;
    recipePosY:number;
    bankPosX:number;
    bankPosY:number;
    numBread:number;
    numCheese:number;
    numToastie:number;

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
    containedWithin(fullState:WorldState):boolean{
        //Get all of our properties. 
        let ourKeys:string[] = Object.keys(this).filter(key => this[key] !== undefined);

        //Check that all our keys exist in the fullState, 
        //and the values for ours match the fullstates version of them.
        return ourKeys.every(key => {
            if(key.startsWith("total") || key.startsWith("num") || key.startsWith("money")){
                return fullState[key] >= this[key]; 
            } 
            return fullState[key] === this[key];
        });
    } 

    applyTo(fullState:WorldState):WorldState{
        return _.mergeWith(_.cloneDeep(fullState), this, (objValue, srcValue, key, object, source, stack)=>{
            if(key.startsWith("total") || key.startsWith("num") || key.startsWith("money")){
                if(_.isNumber(objValue) && _.isNumber(srcValue)){
                    return Math.min(objValue + srcValue, 100);
                }
            }
            return undefined;
        });
        //return _.merge(_.cloneDeep(fullState), this);
    }
}