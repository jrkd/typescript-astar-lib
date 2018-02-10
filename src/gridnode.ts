export class GridNode{
    x: number;
    y:number;
    weight:number;
    visited:boolean;
    f:number = 0;
    g:number = 0;
    h:number = 0;
    closed:boolean;
    parent:GridNode;

    constructor(x, y, weight) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    }

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

    isWall():boolean{
        return this.weight === 0;
    }
}