import { IGraphEdge } from "./graphedge";
import { GridNode } from ".";

export class GridEdge implements IGraphEdge {
    cost: number;
    nextNode: GridNode;
    prevNode:GridNode;//ignoring this for now.

    constructor(cost:number, nextNode:GridNode){
        this.cost = cost;
        this.nextNode = nextNode;
    }
}