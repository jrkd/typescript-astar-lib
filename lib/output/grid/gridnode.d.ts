import { IGraphNode } from "./../graphnode";
import { GridEdge } from "./../gridedge";
export declare class GridNode implements IGraphNode {
    x: number;
    y: number;
    weight: number;
    visited: boolean;
    f: number;
    g: number;
    h: number;
    closed: boolean;
    parent: GridNode;
    adjacentEdges: GridEdge[];
    parentEdge: GridEdge;
    constructor(x: number, y: number, weight: number);
    isWall(): boolean;
    toString(): string;
    getCost(fromNeighbor: GridNode): number;
}
