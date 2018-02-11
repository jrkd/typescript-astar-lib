import { IGraphNode } from ".";

export interface IGraphEdge{
    cost:number;
    nextNode:IGraphNode; //and maybe other side of node?
    prevNode:IGraphNode;
}