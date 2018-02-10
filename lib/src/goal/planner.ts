import { IGraph } from "..";
import { NodeWorldState } from "./world-state";
import { IAction } from "./action";

class Planner implements IGraph {
    nodes:NodeWorldState[];
    actions:IAction[];
    dirtyNodes:NodeWorldState[];
    init(): void {
        //nothin
    }
    neighbors(node:NodeWorldState): NodeWorldState[] {
        return this.actions.filter(function(action:IAction) {
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


class Planner_old {
    
    //Takes current world state and tries to find 
    //a list of actions to get to a goal world state 
    findPlan(current:WorldState, actions:IAction[], goal:IGoal):IAction[]{
        return [];

        //something like

        let openList = [current];
        let goalPlan:IAction[] = [];
        openList.forEach(possibleWorld => {
            
            //check for actions that have their preconditions matched here
            let adjacentWorlds = actions.filter(function(action:IAction, index:number){
                return this.isActionValidFromCurrentState(possibleWorld, action.preconditions);
            })
            
            //do the standard process for adjacent nodes 
            adjacentWorlds.forEach(adjacent => {
                let cost = adjacent.cost; 
                // if(adjacent.hasBeenConsidered){...}
                //check this cost vs old cost stuff in a*
            });

            //then as standard in a*, either you run out of adjancent nodes that havent been checked
            //or you find your goal
            if(this.isWorldStateMatch(possibleWorld, goal.desire)){
                //plan found, go back through list 
                //and activate each action 
                goalPlan = [];//something 
            }
        });

        //Starting from the beginning action, towards the goal world state
        //we activate each action. 
        goalPlan.forEach(actionInPlan => {
            actionInPlan.ActivateAction();
        });

    }

    //check that preconditions are part of current world state
    //possibly should be method against worldstate?
    //isActionValidFromCurrentState-oldname
    isWorldStateWithinState(current:WorldState, preconditions:WorldState):boolean{
        return false;
    }

    isWorldStateMatch(current:WorldState, match:WorldState):boolean{
        return false;
    }
    // - nodes are world states
    // - edges are actions 
    //generateNetwork() 
    //Actually we dont generate a network beforehand


}