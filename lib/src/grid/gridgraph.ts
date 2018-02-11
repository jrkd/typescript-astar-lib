import {GridNode} from "./gridnode";
import {AStar} from "./../astar"; 
import { IGraph } from "./../graph";
import { GridEdge } from "./../gridedge";

// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
export var heuristics = {
  manhattan: function(pos0:GridNode, pos1:GridNode):number {
      let d1:number = Math.abs(pos1.x - pos0.x);
      let d2:number = Math.abs(pos1.y - pos0.y);
      return d1 + d2; 
  },
  diagonal: function(pos0:GridNode, pos1:GridNode):number {
      let D:number = 1;
      let D2:number = Math.sqrt(2);
      let d1:number = Math.abs(pos1.x - pos0.x);
      let d2:number = Math.abs(pos1.y - pos0.y);
      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
  }
};

export class GridGraph implements IGraph{
  
    edges: GridEdge[];
    nodes:GridNode[];
    diagonal:boolean;
    grid:GridNode[][];
    dirtyNodes:GridNode[] = [];

    constructor(gridIn, options) {
        options = options || {};
        this.nodes = [];
        this.diagonal = !!options.diagonal;
        this.grid = [];
        for (var x = 0; x < gridIn.length; x++) {
            this.grid[x] = [];

            for (var y = 0, row = gridIn[x]; y < row.length; y++) {
                var node = new GridNode(x, y, row[y]);
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

    init():void {
        this.dirtyNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            AStar.cleanNode(this.nodes[i]);
        }
    }


    //Just doing manhatten for now.
    calculateHeuristic(start:GridNode, end:GridNode): number {
        let d1:number = Math.abs(end.x - start.x);
        let d2:number = Math.abs(end.y - start.y);
        return d1 + d2; 
    }

    markDirty(node:GridNode):void {
        this.dirtyNodes.push(node);
    }

    generateEdgesForNode(node:GridNode, grid:GridNode[][]):GridEdge[]{
      let edges:GridEdge[] = [];
      var x = node.x;
      var y = node.y;
    
      // West
      if (grid[x - 1] && grid[x - 1][y]) {
        edges.push(new GridEdge(grid[x - 1][y].weight, grid[x - 1][y]));
      }
    
      // East
      if (grid[x + 1] && grid[x + 1][y]) {
        edges.push(new GridEdge(grid[x + 1][y].weight, grid[x + 1][y]));
      }
    
      // South
      if (grid[x] && grid[x][y - 1]) {
        edges.push(new GridEdge(grid[x][y - 1].weight, grid[x][y - 1]));
      }
    
      // North
      if (grid[x] && grid[x][y + 1]) {
        edges.push(new GridEdge(grid[x][y + 1].weight, grid[x][y + 1]));
      }
    
      if (this.diagonal) {
        // Southwest
        if (grid[x - 1] && grid[x - 1][y - 1]) {
          edges.push(new GridEdge(grid[x - 1][y - 1].weight, grid[x - 1][y - 1]));
        }
    
        // Southeast
        if (grid[x + 1] && grid[x + 1][y - 1]) {
          edges.push(new GridEdge(grid[x + 1][y - 1].weight, grid[x + 1][y - 1]));
        }
    
        // Northwest
        if (grid[x - 1] && grid[x - 1][y + 1]) {
          edges.push(new GridEdge(grid[x - 1][y + 1].weight, grid[x - 1][y + 1]));
        }
    
        // Northeast
        if (grid[x + 1] && grid[x + 1][y + 1]) {
          edges.push(new GridEdge(grid[x + 1][y + 1].weight, grid[x + 1][y + 1]));
        }
      }
    
      return edges;
    }
    neighborEdges(node:GridNode):GridEdge[] {
      return node.adjacentEdges;
    }

      cleanDirty():void {
        for (var i = 0; i < this.dirtyNodes.length; i++) {
          AStar.cleanNode(this.dirtyNodes[i]);
        }
        this.dirtyNodes = [];
      }

      toString():string {
        let graphString:string[] = [];
        let nodes:GridNode[][] = this.grid;
        for (let x:number = 0; x < nodes.length; x++) {
          let rowDebug:number[] = [];
          let row:GridNode[] = nodes[x];
          for (var y = 0; y < row.length; y++) {
            rowDebug.push(row[y].weight);
          }
          graphString.push(rowDebug.join(" "));
        }
        return graphString.join("\n");
      }
}