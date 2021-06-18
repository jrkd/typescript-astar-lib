import { GoalNode } from "./goalnode";
import { IGraphEdge } from "../graphedge";
import { WorldState } from "./worldstate";
export interface IAction {
    preconditions: WorldState;
    effects: WorldState;
    cost: number;
    checkAdditionalPreconditions(current: GoalNode): boolean;
    ActivateAction(current: GoalNode): void;
}
export declare class GoalEdge implements IGraphEdge {
    constructor(prevNode: GoalNode, action: NodeAction);
    generateNextNode(): GoalNode;
    getNextNodeID(): string;
    readonly cost: number;
    prevNode: GoalNode;
    nextNode: GoalNode;
    action: NodeAction;
}
export declare class NodeAction implements IAction {
    name: string;
    preconditions: WorldState;
    effects: WorldState;
    cost: number;
    checkAdditionalPreconditions(current: GoalNode): boolean;
    ActivateAction(current: GoalNode): GoalNode;
}
