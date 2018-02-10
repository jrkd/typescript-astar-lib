import { IGraphNode } from "./graphnode";

export interface IGraph{
    nodes:IGraphNode[];
    dirtyNodes:IGraphNode[];

    init():void;
    neighbors(node:IGraphNode):IGraphNode[];
    calculateHeuristic(start:IGraphNode, end:IGraphNode):number;
    markDirty(node:IGraphNode):void;
    cleanDirty():void;
    toString():string;
}