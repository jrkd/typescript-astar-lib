import { IGraphEdge } from "./graphedge";

export interface IGraphNode{
    visited:boolean;
    f:number;
    g:number;
    h:number;
    closed:boolean;
    
    


    //Jono, thats not true! /This needs to be parentedge
    parentEdge:IGraphEdge;
    

    adjacentEdges:IGraphEdge[];


    toString():string;
}