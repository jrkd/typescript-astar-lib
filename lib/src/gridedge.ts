import { IGraphEdge } from "./graphedge";
import { GridNode } from ".";

export class GridEdge implements IGraphEdge {
    cost: number;
    prevNode: GridNode;
    nextNode:GridNode;//ignoring this for now.

    constructor(cost:number, prevNode:GridNode, nextNode:GridNode){
        this.cost = cost;
        this.prevNode = prevNode;
        this.nextNode = nextNode;
    }
}