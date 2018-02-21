import { IGraphEdge } from "./graphedge";
import { GridNode } from ".";

export class GridEdge implements IGraphEdge {
    cost: number;
    prevNode: GridNode;
    nextNode:GridNode;//ignoring this for now.

    constructor(cost:number, nextNode:GridNode){
        this.cost = cost;
        this.prevNode = nextNode;
    }
}