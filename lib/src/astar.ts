import {IGraphNode} from "./graphnode";
import {IGraph} from "./graph";
import {BinaryHeap} from "./binaryheap";
import { IGraphEdge } from "./graphedge";

export class AStar{

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
  static search(graph:IGraph, start:IGraphNode, end:IGraphNode, options:any):IGraphEdge[] {
    graph.cleanDirty();
    options = options || {};
    let closest = options.closest || false;

    let openHeap:BinaryHeap<IGraphNode> = new BinaryHeap<IGraphNode>((node:IGraphNode) => {return node.f});
    let closestNode:IGraphNode = start; // set the start node to be the closest if required

    start.h = graph.calculateHeuristic(start, end);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      let currentNode:IGraphNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (graph.isAtGoal(currentNode, end))  {
        return AStar.pathTo(start, currentNode);
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node.
      let neighborEdges:IGraphEdge[] = graph.neighborEdges(currentNode);

      for(let index:number = 0; index < neighborEdges.length; ++index){
        let neighbor:IGraphNode = neighborEdges[index].nextNode;

        if (neighbor.closed) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        let gScore:number = currentNode.g + neighbor.getCost(currentNode);
        let beenVisited:boolean = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          //neighbor.parent = currentNode;
          currentNode.selectedEdge = neighborEdges[index];
          neighbor.h = neighbor.h || graph.calculateHeuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
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

  static cleanNode(node:IGraphNode):void {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    //node.parent = null;
    node.selectedEdge = null;
  }

  static pathTo(startNode:IGraphNode, goalNode:IGraphNode):IGraphEdge[] {
    let curr:IGraphNode = startNode;
    let path:IGraphEdge[] = [];
    while (curr.selectedEdge != null) {
      path.push(curr.selectedEdge);
      curr = curr.selectedEdge.nextNode;
    }
    return path;
  }
}