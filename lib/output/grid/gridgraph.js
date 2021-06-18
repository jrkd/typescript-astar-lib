"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gridnode_1 = require("./gridnode");
const astar_1 = require("./../astar");
const gridedge_1 = require("./../gridedge");
// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
exports.heuristics = {
    manhattan: function (pos0, pos1) {
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    diagonal: function (pos0, pos1) {
        let D = 1;
        let D2 = Math.sqrt(2);
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
};
class GridGraph {
    constructor(gridIn, options) {
        this.dirtyNodes = [];
        options = options || {};
        this.nodes = [];
        this.diagonal = !!options.diagonal;
        this.grid = [];
        for (var x = 0; x < gridIn.length; x++) {
            this.grid[x] = [];
            for (var y = 0, row = gridIn[x]; y < row.length; y++) {
                var node = new gridnode_1.GridNode(x, y, row[y]);
                this.grid[x][y] = node;
                this.nodes.push(node);
            }
        }
        //After creating nodes on grid, 
        //pre-load edge data so we dont calculate every time.
        this.nodes.forEach(node => {
            node.adjacentEdges = this.generateEdgesForNode(node, this.grid);
        });
        this.init();
    }
    init() {
        this.dirtyNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            astar_1.AStar.cleanNode(this.nodes[i]);
        }
    }
    //Just doing manhatten for now.
    calculateHeuristic(start, end) {
        let d1 = Math.abs(end.x - start.x);
        let d2 = Math.abs(end.y - start.y);
        return d1 + d2;
    }
    markDirty(node) {
        this.dirtyNodes.push(node);
    }
    generateEdgesForNode(node, grid) {
        let edges = [];
        var x = node.x;
        var y = node.y;
        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            edges.push(new gridedge_1.GridEdge(grid[x - 1][y].weight, node, grid[x - 1][y]));
        }
        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            edges.push(new gridedge_1.GridEdge(grid[x + 1][y].weight, node, grid[x + 1][y]));
        }
        // South
        if (grid[x] && grid[x][y - 1]) {
            edges.push(new gridedge_1.GridEdge(grid[x][y - 1].weight, node, grid[x][y - 1]));
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            edges.push(new gridedge_1.GridEdge(grid[x][y + 1].weight, node, grid[x][y + 1]));
        }
        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                edges.push(new gridedge_1.GridEdge(grid[x - 1][y - 1].weight, node, grid[x - 1][y - 1]));
            }
            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                edges.push(new gridedge_1.GridEdge(grid[x + 1][y - 1].weight, node, grid[x + 1][y - 1]));
            }
            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                edges.push(new gridedge_1.GridEdge(grid[x - 1][y + 1].weight, node, grid[x - 1][y + 1]));
            }
            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                edges.push(new gridedge_1.GridEdge(grid[x + 1][y + 1].weight, node, grid[x + 1][y + 1]));
            }
        }
        return edges;
    }
    neighborEdges(node) {
        return node.adjacentEdges;
    }
    cleanDirty() {
        for (var i = 0; i < this.dirtyNodes.length; i++) {
            astar_1.AStar.cleanNode(this.dirtyNodes[i]);
        }
        this.dirtyNodes = [];
    }
    toString() {
        let graphString = [];
        let nodes = this.grid;
        for (let x = 0; x < nodes.length; x++) {
            let rowDebug = [];
            let row = nodes[x];
            for (var y = 0; y < row.length; y++) {
                rowDebug.push(row[y].weight);
            }
            graphString.push(rowDebug.join(" "));
        }
        return graphString.join("\n");
    }
    isAtGoal(currentNode, goalNode) {
        return currentNode.x == goalNode.x && currentNode.y == goalNode.y;
    }
}
exports.GridGraph = GridGraph;
//# sourceMappingURL=gridgraph.js.map