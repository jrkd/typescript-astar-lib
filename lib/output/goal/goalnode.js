"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoalNode {
    constructor() {
        //from node interface
        this.visited = false;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.closed = false;
    }
    toString() {
        return "";
    }
}
exports.GoalNode = GoalNode;
//# sourceMappingURL=goalnode.js.map