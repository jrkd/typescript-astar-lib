import { IGraphEdge } from "./graphedge";
export interface IGraphNode {
    visited: boolean;
    f: number;
    g: number;
    h: number;
    closed: boolean;
    parentEdge: IGraphEdge;
    adjacentEdges: IGraphEdge[];
    toString(): string;
}
