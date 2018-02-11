import { IGraph } from "./../graph";
import { NodeWorldState } from "./world-state";
import { IAction, NodeAction } from "./action";

export class Planner implements IGraph {
    edges: NodeAction[] = []; //actions
    nodes:NodeWorldState[] = [];
    dirtyNodes:NodeWorldState[] = [];
    init(): void {
        //nothin
    }

    //
    // theres a conceptual issue here
    // If we have preconditions and effects as subsets of the entire worldstate
    // then thats no good.
    // 
    // If we assume the existing node contains the full world state, 
    // then we clone and augment that by the partial changes for the next node? 
    //
    // For merging see - https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
    // jQuery.extend

    //ooo heres a thought;
    //Since were using js -- you could find out what the whole world state is at the start by 
    //extending all at the start? though default values wouldnt exist 


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
    neighborEdges(node:NodeWorldState): NodeAction[] {
        return this.edges
            .filter(function(action:NodeAction) { //only select actions that have their precons met.
                return action.preconditions.containedWithin(node);
            });
    }
    calculateHeuristic(start: NodeWorldState, end: NodeWorldState):number {
        return 0;
    }
    markDirty(node:NodeWorldState): void {
        //throw new Error("Method not implemented.");
    }
    cleanDirty(): void {
        //throw new Error("Method not implemented.");
    }
    toString(): string {
        return "";
    }
}


// class Planner_old {
    
//     //Takes current world state and tries to find 
//     //a list of actions to get to a goal world state 
//     findPlan(current:WorldState, actions:IAction[], goal:IGoal):IAction[]{
//         return [];

//         //something like

//         let openList = [current];
//         let goalPlan:IAction[] = [];
//         openList.forEach(possibleWorld => {
            
//             //check for actions that have their preconditions matched here
//             let adjacentWorlds = actions.filter(function(action:IAction, index:number){
//                 return this.isActionValidFromCurrentState(possibleWorld, action.preconditions);
//             })
            
//             //do the standard process for adjacent nodes 
//             adjacentWorlds.forEach(adjacent => {
//                 let cost = adjacent.cost; 
//                 // if(adjacent.hasBeenConsidered){...}
//                 //check this cost vs old cost stuff in a*
//             });

//             //then as standard in a*, either you run out of adjancent nodes that havent been checked
//             //or you find your goal
//             if(this.isWorldStateMatch(possibleWorld, goal.desire)){
//                 //plan found, go back through list 
//                 //and activate each action 
//                 goalPlan = [];//something 
//             }
//         });

//         //Starting from the beginning action, towards the goal world state
//         //we activate each action. 
//         goalPlan.forEach(actionInPlan => {
//             actionInPlan.ActivateAction();
//         });

//     }

//     //check that preconditions are part of current world state
//     //possibly should be method against worldstate?
//     //isActionValidFromCurrentState-oldname
//     isWorldStateWithinState(current:WorldState, preconditions:WorldState):boolean{
//         return false;
//     }

//     isWorldStateMatch(current:WorldState, match:WorldState):boolean{
//         return false;
//     }
//     // - nodes are world states
//     // - edges are actions 
//     //generateNetwork() 
//     //Actually we dont generate a network beforehand


// }