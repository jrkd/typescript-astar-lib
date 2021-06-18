import { IGraphNode } from "./graphnode";
import { IGraph } from "./graph";
import { IGraphEdge } from "./graphedge";
export declare class AStar {
    /**
  * Perform an A* Search on a graph given a start and end node.
  * @param {Graph} graph
  * @param {IGraphNode} start
  * @param {IGraphNode} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the
             path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see
  *          astar.heuristics).
  */
    static search(graph: IGraph, start: IGraphNode, end: IGraphNode, options: any): IGraphEdge[];
    static cleanNode(node: IGraphNode): void;
    static pathTo(startNode: IGraphNode, goalNode: IGraphNode): IGraphEdge[];
}
