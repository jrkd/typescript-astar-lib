import {AStar, GridGraph, Planner, NodeWorldState, NodeAction} from "new-astar";
import * as $ from "jquery"; 
 
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
    moveToBank.cost = 1;
    moveToBank.preconditions = new NodeWorldState();
    moveToBank.preconditions.myPosX = 0;
    moveToBank.preconditions.myPosY = 0;
    moveToBank.effects = new NodeWorldState();
    moveToBank.effects.myPosX = 100;
    moveToBank.effects.myPosY = 100;

    let takeMoneyFromBank:NodeAction = new NodeAction();
    takeMoneyFromBank.name = "Take money from bank";
    takeMoneyFromBank.cost = 1;
    takeMoneyFromBank.preconditions.myPosX = 100;
    takeMoneyFromBank.preconditions.myPosY = 100;
    takeMoneyFromBank.preconditions.moneyAtBank = 100;
    takeMoneyFromBank.effects = new NodeWorldState();
    takeMoneyFromBank.effects.moneyWithMe = 100;
    takeMoneyFromBank.effects.moneyAtBank = 0;

    let buyPizza:NodeAction = new NodeAction();
    buyPizza.name = "Buy pizza";
    buyPizza.cost = 1;
    buyPizza.preconditions = new NodeWorldState();
    buyPizza.preconditions.hungry = true;
    buyPizza.preconditions.moneyWithMe = 100;
    buyPizza.effects = new NodeWorldState();
    buyPizza.effects.moneyWithMe = 0;
    buyPizza.effects.hungry = false;

    planner.edges = [moveToBank, buyPizza, takeMoneyFromBank];

    //setup current state
    let startState:NodeWorldState = new NodeWorldState();
    startState.hungry = true;
    startState.moneyWithMe = 0;
    startState.numFoodRecipes = 0;
    startState.moneyAtBank = 100;
    startState.bankPosX = 100;
    startState.bankPosY = 100;
    startState.myPosX = 0;
    startState.myPosY = 0;

    let goal:NodeWorldState = new NodeWorldState();
    goal.hungry = false;

    let results = AStar.search(planner, startState, goal, {});

    let currentState:NodeWorldState = startState;

    if(results.length == 0){
        $plannerResults.html("<h1>no plan available!</h1>");
    }
    results.forEach((result:NodeAction) => {
        currentState = result.ActivateAction(currentState);
        $plannerResults.insertAfter("<li>"+result.name+"</li>");
    });

    $("#btnGenerate").click(function() {
        //grid.initialize();
    });

});