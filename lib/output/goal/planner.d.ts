import { IGraph } from "./../graph";
import { GoalNode } from "./goalnode";
import { NodeAction, GoalEdge } from "./action";
export declare class Planner implements IGraph {
    actions: NodeAction[];
    nodes: GoalNode[];
    dirtyNodes: GoalNode[];
    init(): void;
    neighborEdges(node: GoalNode): GoalEdge[];
    preprocessGraph(startNode: GoalNode): GoalNode;
    calculateHeuristic(start: GoalNode, end: GoalNode): number;
    markDirty(node: GoalNode): void;
    cleanDirty(): void;
    toString(): string;
    isAtGoal(currentNode: GoalNode, goalNode: GoalNode): boolean;
}
