import { GridNode } from "./gridnode";
import { IGraph } from "./../graph";
import { GridEdge } from "./../gridedge";
export declare var heuristics: {
    manhattan: (pos0: GridNode, pos1: GridNode) => number;
    diagonal: (pos0: GridNode, pos1: GridNode) => number;
};
export declare class GridGraph implements IGraph {
    edges: GridEdge[];
    nodes: GridNode[];
    diagonal: boolean;
    grid: GridNode[][];
    dirtyNodes: GridNode[];
    constructor(gridIn: any, options: any);
    init(): void;
    calculateHeuristic(start: GridNode, end: GridNode): number;
    markDirty(node: GridNode): void;
    generateEdgesForNode(node: GridNode, grid: GridNode[][]): GridEdge[];
    neighborEdges(node: GridNode): GridEdge[];
    cleanDirty(): void;
    toString(): string;
    isAtGoal(currentNode: GridNode, goalNode: GridNode): boolean;
}
