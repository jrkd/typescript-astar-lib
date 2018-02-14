import { GoalNode } from "./goalnode";
import { IAction } from "./action"; 

interface IAgent{
    goals:GoalNode[];//ordered 
    actions:IAction[];//ordered?
}