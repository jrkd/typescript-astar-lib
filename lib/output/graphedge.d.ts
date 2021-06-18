import { IGraphNode } from ".";
export interface IGraphEdge {
    cost: number;
    prevNode: IGraphNode;
    nextNode: IGraphNode;
}
