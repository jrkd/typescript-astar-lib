import { IGraphNode } from "./../graphnode";
import { NodeAction, GoalEdge } from "./action";
import { WorldState } from "./worldstate";

export class GoalNode implements IGraphNode {
    parentEdge:GoalEdge;
    adjacentEdges: GoalEdge[];
    //from node interface
    visited: boolean = false;
    f: number = 0;
    g: number = 0;
    h: number = 0;
    closed: boolean = false;
    parent: IGraphNode; //Parent as in, the place in the graph i was before i was here
    
    state:WorldState;

    toString(): string {
        return "";
    }
    
}