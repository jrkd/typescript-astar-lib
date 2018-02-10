import { IGraphEdge } from "./graphedge";

export interface IGraphNode{
    visited:boolean;
    f:number;
    g:number;
    h:number;
    closed:boolean;
    parent:IGraphNode;
    adjacentEdges:IGraphEdge[];

    toString():string;
    getCost(fromNeighbor:IGraphNode):number;
}