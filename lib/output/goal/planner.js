"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const action_1 = require("./action");
const astar_1 = require("../astar");
class Planner {
    constructor() {
        this.actions = []; //actions
        this.nodes = [];
        this.dirtyNodes = [];
    }
    init() {
        this.dirtyNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            astar_1.AStar.cleanNode(this.nodes[i]);
        }
    }
    neighborEdges(node) {
        let relevantActions = this.actions
            .filter(function (action) {
            return action.preconditions.containedWithin(node.state);
        });
        let edges = relevantActions.map((action) => {
            return new action_1.GoalEdge(node, action);
        });
        return edges;
    }
    // just returns startNode
    preprocessGraph(startNode) {
        let currentNeighbors = this.neighborEdges(startNode);
        for (let index = 0; index < currentNeighbors.length; ++index) {
            currentNeighbors[index].prevNode = null;
        }
        let nodesToProcess = [startNode];
        let allNodesByID = {};
        while (nodesToProcess.length > 0) {
            let currentNode = nodesToProcess.pop();
            currentNode.adjacentEdges = this.neighborEdges(currentNode);
            currentNode.adjacentEdges.forEach(edge => {
                let nextNodeID = edge.getNextNodeID();
                if (!allNodesByID.hasOwnProperty(nextNodeID)) {
                    allNodesByID[nextNodeID] = edge.generateNextNode();
                    nodesToProcess.push(allNodesByID[nextNodeID]);
                }
                edge.nextNode = allNodesByID[nextNodeID];
            });
        }
        return startNode;
    }
    calculateHeuristic(start, end) {
        //Not sure if this is really helping.
        return _.differenceWith(Object.keys(start.state), Object.keys(end.state)).length;
    }
    markDirty(node) {
        this.dirtyNodes.push(node);
    }
    cleanDirty() {
        for (var i = 0; i < this.dirtyNodes.length; i++) {
            astar_1.AStar.cleanNode(this.dirtyNodes[i]);
        }
        this.dirtyNodes = [];
    }
    toString() {
        return "";
    }
    isAtGoal(currentNode, goalNode) {
        return goalNode.state.containedWithin(currentNode.state);
    }
}
exports.Planner = Planner;
//# sourceMappingURL=planner.js.map