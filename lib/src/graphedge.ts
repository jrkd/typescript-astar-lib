import { IGraphNode } from ".";

/// this shouldnt really imply direction right?
export interface IGraphEdge{
    cost:number;
    prevNode:IGraphNode; //and maybe other side of node?
    nextNode:IGraphNode;
}