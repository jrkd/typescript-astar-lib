"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const goalnode_1 = require("./goalnode");
class GoalEdge {
    constructor(prevNode, action) {
        this.prevNode = prevNode;
        this.action = action;
        this.nextNode = null;
    }
    generateNextNode() {
        let node = new goalnode_1.GoalNode();
        node.state = this.action.effects.applyTo(this.prevNode.state);
        return node;
    }
    getNextNodeID() {
        return JSON.stringify(this.action.effects.applyTo(this.prevNode.state));
    }
    get cost() {
        return this.action.cost;
    }
}
exports.GoalEdge = GoalEdge;
class NodeAction {
    checkAdditionalPreconditions(current) {
        return true; //check precondition against current world state
    }
    ActivateAction(current) {
        let node = new goalnode_1.GoalNode();
        node.state = this.effects.applyTo(current.state);
        return node;
    }
}
exports.NodeAction = NodeAction;
//# sourceMappingURL=action.js.map