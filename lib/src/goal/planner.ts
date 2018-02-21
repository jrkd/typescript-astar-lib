import * as _ from "lodash";

import { IGraph } from "./../graph";
import { GoalNode } from "./goalnode";
import { IAction, NodeAction, GoalEdge } from "./action";

export class Planner implements IGraph {
    
    actions: NodeAction[] = []; //actions
    nodes:GoalNode[] = [];
    dirtyNodes:GoalNode[] = [];
    init(): void {
        //nothin
    }

    neighborEdges(node:GoalNode): GoalEdge[] {
        let relevantActions:NodeAction[] = this.actions
            .filter(function(action:NodeAction) { //only select actions that have their precons met.
                
                return action.preconditions.containedWithin(node.state);
            });
        let edges:GoalEdge[] = relevantActions.map((action:NodeAction):GoalEdge => {
            return new GoalEdge(node, action);
        });

        return edges;
    }

    // just returns startNode
    preprocessGraph(startNode:GoalNode):GoalNode{
        let currentNeighbors:GoalEdge[] = this.neighborEdges(startNode);
        for(let index:number = 0; index< currentNeighbors.length; ++index){
            currentNeighbors[index].prevNode = null;
        }

        let nodesToProcess:GoalNode[] = [startNode];
        let allNodesByID:{ [id:string]:GoalNode } = {};
        while(nodesToProcess.length > 0) {
            let currentNode:GoalNode = nodesToProcess.pop();
            currentNode.adjacentEdges = this.neighborEdges(currentNode);

            currentNode.adjacentEdges.forEach(edge => {
                let nextNodeID:string = edge.getNextNodeID();
                if(!allNodesByID.hasOwnProperty(nextNodeID)){
                    allNodesByID[nextNodeID] = edge.generateNextNode();
                    nodesToProcess.push(allNodesByID[nextNodeID]);
                }
                edge.nextNode = allNodesByID[nextNodeID];
            });
        }
        return startNode;
    }

    calculateHeuristic(start: GoalNode, end: GoalNode):number {
        return 0;
    }
    markDirty(node:GoalNode): void {
        //throw new Error("Method not implemented.");
    }
    cleanDirty(): void {
        //throw new Error("Method not implemented.");
    }
    toString(): string {
        return "";
    }
    isAtGoal(currentNode:GoalNode, goalNode:GoalNode): boolean {
        return goalNode.state.containedWithin(currentNode.state);
    }
}