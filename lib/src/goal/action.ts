import { GoalNode } from "./goalnode";
import { IGraphEdge } from "../graphedge";
import { WorldState } from "./worldstate";

export interface IAction { //should be an interface.
    preconditions:WorldState;//Number of preconditions is number of changes to worldstate
    effects:WorldState;//Number of effects is number of changes to worldstate
    cost:number;
    hasBeenConsidered:boolean; //a node structure bleeding into GOAP.

    checkAdditionalPreconditions(current:GoalNode):boolean // do additional processing where required.
    ActivateAction(current:GoalNode):void //Trigger animation or movement 
}

export class NodeAction implements IAction, IGraphEdge {
    public name:string;
    prevNode: GoalNode;
    preconditions: WorldState;
    effects:WorldState;

    get nextNode():GoalNode{
        let nextNode:GoalNode = new GoalNode();
        nextNode.state = this.effects.applyTo(this.prevNode.state);
        return nextNode;
    }

    cost: number;
    hasBeenConsidered: boolean;
    checkAdditionalPreconditions(current:GoalNode): boolean {
        return true; //check precondition against current world state
    }
    ActivateAction(current:GoalNode):GoalNode {
        return current;
        //current += this.effects; apply effects to world state.
    }
}