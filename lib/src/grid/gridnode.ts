import { IGraphNode } from "./../graphnode";
import { IGraphEdge } from "./../graphedge";
import { GridEdge } from "./../gridedge";

export class GridNode implements IGraphNode{
    x: number;
    y:number;
    weight:number;

    //implemented from IGraphNode
    visited:boolean;
    f:number = 0;
    g:number = 0;
    h:number = 0;
    closed:boolean;
    parent:GridNode;
    adjacentEdges:GridEdge[];
    parentEdge:GridEdge;

    constructor(x:number, y:number, weight:number) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    }
    
    isWall():boolean{
        return this.weight === 10000;
    }

    //Implementing from interface
    toString():string {
        return "[" + this.x + " " + this.y + "]";
    }

    getCost(fromNeighbor:GridNode):number{
        // Take diagonal weight into consideration.
        if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421;
        }
        return this.weight;
    }
}