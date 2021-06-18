import { IGraphEdge } from "./graphedge";
import { GridNode } from ".";
export declare class GridEdge implements IGraphEdge {
    cost: number;
    prevNode: GridNode;
    nextNode: GridNode;
    constructor(cost: number, prevNode: GridNode, nextNode: GridNode);
}
