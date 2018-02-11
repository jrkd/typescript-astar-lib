import { NodeWorldState } from "./world-state";
import { IAction } from "./action";

interface IAgent{
    goals:NodeWorldState[];//ordered 
    actions:IAction[];//ordered?
}