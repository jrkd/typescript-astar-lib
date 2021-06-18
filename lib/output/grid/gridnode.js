"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GridNode {
    constructor(x, y, weight) {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.x = x;
        this.y = y;
        this.weight = weight;
    }
    isWall() {
        return this.weight === 10000;
    }
    //Implementing from interface
    toString() {
        return "[" + this.x + " " + this.y + "]";
    }
    getCost(fromNeighbor) {
        // Take diagonal weight into consideration.
        if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421;
        }
        return this.weight;
    }
}
exports.GridNode = GridNode;
//# sourceMappingURL=gridnode.js.map