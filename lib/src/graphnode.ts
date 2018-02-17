import { IGraphEdge } from "./graphedge";

export interface IGraphNode{
    visited:boolean;
    f:number;
    g:number;
    h:number;
    closed:boolean;
    
    
    //parent:IGraphNode;
    //if we're using edges properly, then parent doesnt exist
    selectedEdge:IGraphEdge;
    
    adjacentEdges:IGraphEdge[];


    toString():string;
}