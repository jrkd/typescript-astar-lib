import { IGraphNode } from "./../graphnode";
import { GoalEdge } from "./action";
import { WorldState } from "./worldstate";
export declare class GoalNode implements IGraphNode {
    parentEdge: GoalEdge;
    adjacentEdges: GoalEdge[];
    visited: boolean;
    f: number;
    g: number;
    h: number;
    closed: boolean;
    parent: IGraphNode;
    state: WorldState;
    toString(): string;
}
