import { GoalNode } from "./goalnode";
import { IGraphEdge } from "../graphedge";
import { WorldState } from "./worldstate";
import { IGraphNode } from "..";

export interface IAction { //should be an interface.
    preconditions:WorldState;//Number of preconditions is number of changes to worldstate
    effects:WorldState;//Number of effects is number of changes to worldstate
    cost:number;

    checkAdditionalPreconditions(current:GoalNode):boolean // do additional processing where required.
    ActivateAction(current:GoalNode):void //Trigger animation or movement 
}

export class GoalEdge implements IGraphEdge {
    constructor(prevNode:GoalNode, action:NodeAction){
        this.prevNode = prevNode;
        this.action = action;
        this.nextNode = null;
    }

    generateNextNode():GoalNode{
        let node:GoalNode = new GoalNode();
        node.state = this.action.effects.applyTo(this.prevNode.state); 
        return node;
    }

    getNextNodeID():string{
        return JSON.stringify( 
            this.action.effects.applyTo(this.prevNode.state) 
        );
    }

    get cost():number {
        return this.action.cost;
    }
    prevNode: GoalNode;
    nextNode: GoalNode;

    action: NodeAction;
}

export class NodeAction implements IAction {
    public name:string;
    preconditions: WorldState;
    effects:WorldState;

    cost: number;
    checkAdditionalPreconditions(current:GoalNode): boolean {
        return true; //check precondition against current world state
    }
    ActivateAction(current:GoalNode):GoalNode {
        return current;
        //current += this.effects; apply effects to world state.
    }
}