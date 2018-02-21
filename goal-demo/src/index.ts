import {AStar, GridGraph, Planner, WorldState, GoalNode, NodeAction, GoalEdge} from "new-astar";
import * as $ from "jquery"; 
import { IGraphEdge } from "../../lib/output/graphedge";
 
/*  demo.js http://github.com/bgrins/javascript-astar
    MIT License

    Set up the demo page for the A* Search
*/
/* global Graph, astar, $ */


var WALL = 10000,
    performance = window.performance;

$(function() {
    var $plannerResults = $("#plannerList");
    var planner = new Planner();

    //setup the actions we can use. 
    //planner.nodes -- we dont really have a full list of them right? cause each action just tweaks them?...
    //suppose you could make things quick by pre-processing?
    //actions:
    let moveToBank:NodeAction = new NodeAction();
    moveToBank.name = "Move to bank";
    moveToBank.cost = 5;
    moveToBank.preconditions = new WorldState();
    moveToBank.preconditions.myPosX = 0;
    moveToBank.preconditions.myPosY = 0;
    moveToBank.effects = new WorldState();
    moveToBank.effects.myPosX = 100;
    moveToBank.effects.myPosY = 100;

    let takeMoneyFromBank:NodeAction = new NodeAction();
    takeMoneyFromBank.name = "Take money from bank";
    takeMoneyFromBank.cost = 1;
    takeMoneyFromBank.preconditions = new WorldState();
    takeMoneyFromBank.preconditions.myPosX = 100;
    takeMoneyFromBank.preconditions.myPosY = 100;
    takeMoneyFromBank.preconditions.moneyAtBank = 100;
    takeMoneyFromBank.effects = new WorldState();
    takeMoneyFromBank.effects.moneyWithMe = 100;
    takeMoneyFromBank.effects.moneyAtBank = 0;

    let buyPizza:NodeAction = new NodeAction();
    buyPizza.name = "Buy pizza";
    buyPizza.cost = 1;
    buyPizza.preconditions = new WorldState();
    buyPizza.preconditions.hungry = true;
    buyPizza.preconditions.moneyWithMe = 100;
    buyPizza.effects = new WorldState();
    buyPizza.effects.moneyWithMe = 0;
    buyPizza.effects.hungry = false;

    let makeToastie:NodeAction = new NodeAction();
    makeToastie.name = "Make Toastie";
    makeToastie.cost = 4;
    makeToastie.preconditions = new WorldState();
    makeToastie.preconditions.numFoodRecipes = 1;
    makeToastie.preconditions.numCheese = 1;
    makeToastie.preconditions.numBread = 2;
    makeToastie.effects = new WorldState();
    makeToastie.effects.hungry = false;

    let getSliceOfBread:NodeAction = new NodeAction();
    getSliceOfBread.name = "Get Slice of Bread";
    getSliceOfBread.cost = 1;
    getSliceOfBread.preconditions = new WorldState();
    getSliceOfBread.effects = new WorldState();
    getSliceOfBread.effects.numBread = 2;

    let getCheese:NodeAction = new NodeAction();
    getCheese.name = "Get cheese";
    getCheese.cost = 1;
    getCheese.preconditions = new WorldState();
    getCheese.effects = new WorldState();
    getCheese.effects.numCheese = 1;

    planner.actions = [moveToBank, buyPizza, takeMoneyFromBank, makeToastie, getSliceOfBread, getCheese];

    //setup current state
    let startState:WorldState = new WorldState();
    startState.hungry = true;
    startState.moneyWithMe = 0;
    startState.numFoodRecipes = 1;
    startState.moneyAtBank = 100;
    startState.bankPosX = 100;
    startState.bankPosY = 100;
    startState.numBread = 0;
    startState.numCheese = 0;
    startState.myPosX = 0;
    startState.myPosY = 0;

    let goalState:WorldState = new WorldState();
    goalState.hungry = false;

    let startNode:GoalNode = new GoalNode();
    startNode.state = startState;
    let goalNode:GoalNode = new GoalNode();
    goalNode.state = goalState;

    planner.preprocessGraph(startNode);

    let results = AStar.search(planner, startNode, goalNode, {});
  
    let currentNode:GoalNode = startNode;

    if(results.length == 0){
        $plannerResults.html("<h1>no plan available!</h1>");
    }
    results.forEach((result:GoalEdge) => {
        currentNode = result.action.ActivateAction(currentNode);
        $plannerResults.append("<li>"+result.action.name+"</li>");
    });

    $("#btnGenerate").click(function() {
        //grid.initialize();
    });

});