"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binaryheap_1 = require("./binaryheap");
class AStar {
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
    static search(graph, start, end, options) {
        graph.cleanDirty();
        options = options || {};
        let closest = options.closest || false;
        let openHeap = new binaryheap_1.BinaryHeap((node) => { return node.f; });
        let closestNode = start; // set the start node to be the closest if required
        start.h = graph.calculateHeuristic(start, end);
        graph.markDirty(start);
        openHeap.push(start);
        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.pop();
            // End case -- result has been found, return the traced path.
            if (graph.isAtGoal(currentNode, end)) {
                return AStar.pathTo(start, currentNode);
            }
            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;
            // Find all neighbors for the current node.
            let neighborEdges = currentNode.adjacentEdges; //graph.neighborEdges(currentNode);
            for (let index = 0; index < neighborEdges.length; ++index) {
                let neighbor = neighborEdges[index].nextNode;
                if (neighbor.closed) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }
                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                let gScore = currentNode.g + neighborEdges[index].cost;
                let beenVisited = neighbor.visited;
                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parentEdge = neighborEdges[index];
                    neighbor.h = neighbor.h || graph.calculateHeuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);
                    if (true) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }
                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }
        if (closest) {
            return AStar.pathTo(start, closestNode);
        }
        // No result was found - empty array signifies failure to find path.
        return [];
    }
    static cleanNode(node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parentEdge = null;
    }
    static pathTo(startNode, goalNode) {
        let curr = goalNode;
        let path = [];
        while (curr.parentEdge != null) {
            path.push(curr.parentEdge);
            curr = curr.parentEdge.prevNode;
        }
        return path.reverse();
    }
}
exports.AStar = AStar;
//# sourceMappingURL=astar.js.map