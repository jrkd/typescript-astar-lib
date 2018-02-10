import { IGraphNode } from "..";

export class NodeWorldState implements IGraphNode {
    
    //from node interface
    visited: boolean;
    f: number;
    g: number;
    h: number;
    closed: boolean;
    parent: IGraphNode; //Parent as in, the place in the graph i was before i was here
    
    //GOAL specific properties
    //Descriptors of the world.
    hungry:boolean;
    moneyWithMe:number;
    moneyAtBank:number;
    numFoodRecipes:number;
    myPosX:number;
    myPosY:number;
    recipePosX:number;
    recipePosY:number;
    bankPosX:number;
    bankPosY:number;

    toString(): string {
        return "";
    }
    getCost(fromNeighbor: IGraphNode): number {
        return 0;
    }

    // Check whether state's set properties match this state
    containedWithin(state:NodeWorldState):boolean{
        return true; //todo:dd
    }

}