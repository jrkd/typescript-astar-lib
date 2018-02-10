export interface IGraphNode{
    visited:boolean;
    f:number;
    g:number;
    h:number;
    closed:boolean;
    parent:IGraphNode;

    toString():string;
    getCost(fromNeighbor:IGraphNode):number;
}