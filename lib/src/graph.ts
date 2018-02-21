import { IGraphNode } from "./graphnode";
import { IGraphEdge } from "./graphedge";

export interface IGraph{
    nodes:IGraphNode[];
    dirtyNodes:IGraphNode[];

    init():void;
    neighborEdges(node:IGraphNode):IGraphEdge[];
    calculateHeuristic(start:IGraphNode, end:IGraphNode):number;
    markDirty(node:IGraphNode):void;
    cleanDirty():void;
    toString():string;
    isAtGoal(currentNode:IGraphNode, goalNode:IGraphNode):boolean;
}