import { NodeWorldState } from "./world-state";
import { IGraphEdge } from "../graphedge";

export interface IAction { //should be an interface.
    preconditions:NodeWorldState;//Number of preconditions is number of changes to worldstate
    effects:NodeWorldState;//Number of effects is number of changes to worldstate
    cost:number;
    hasBeenConsidered:boolean; //a node structure bleeding into GOAP.

    checkAdditionalPreconditions(current:NodeWorldState):boolean // do additional processing where required.
    ActivateAction(current:NodeWorldState):void //Trigger animation or movement 
}

export class NodeAction implements IAction, IGraphEdge {
    public name:string;
    nextNode: NodeWorldState; //Surely this is the effects?
    prevNode: NodeWorldState;
    preconditions: NodeWorldState;
    get effects():NodeWorldState{ //just an alias for nextnode
        return this.nextNode;
    }
    set effects(val:NodeWorldState){
        this.nextNode = val;
    }
    cost: number;
    hasBeenConsidered: boolean;
    checkAdditionalPreconditions(current:NodeWorldState): boolean {
        return true; //check precondition against current world state
    }
    ActivateAction(current:NodeWorldState):NodeWorldState {
        return current;
        //current += this.effects; apply effects to world state.
    }
}