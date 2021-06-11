import {AStar, GridGraph, Planner, WorldState, GoalNode, NodeAction, GoalEdge} from "new-astar";
import * as $ from "jquery"; 
import { IGraphEdge } from "../../lib/output/graphedge";
 
/*  demo.js http://github.com/bgrins/javascript-astar
    MIT License

    Set up the demo page for the A* Search
*/
/* global Graph, astar, $ */


$(function() {
    $(".run-search").click(()=>{
        runSearch();
    });
});

function runSearch() {
    var $plannerResults = $("#plannerList");
    $plannerResults.empty();
    var planner = new Planner();

    //setup the actions we can use. 
    //planner.nodes -- we dont really have a full list of them right? cause each action just tweaks them?...
    //suppose you could make things quick by pre-processing?
    //actions:
    let actions: NodeAction[] = setupActions();
    renderActions(actions);

    planner.actions = actions;

    //setup current state
    let startState: WorldState = new WorldState();
    $.extend(startState, retrieveWorldState($(".initial-worldstate"))); //new WorldState();

    let goalState: WorldState = new WorldState();
    $.extend(goalState, retrieveWorldState($(".goal-worldstate")));

    let startNode: GoalNode = new GoalNode();
    startNode.state = startState;
    let goalNode: GoalNode = new GoalNode();
    goalNode.state = goalState;

    planner.preprocessGraph(startNode);

    let results = AStar.search(planner, startNode, goalNode, {});

    let currentNode: GoalNode = startNode;

    if (results.length == 0) {
        $plannerResults.html("<h1>no plan available!</h1>");
    }
    results.forEach((result: GoalEdge) => {
        currentNode = result.action.ActivateAction(currentNode);
        $plannerResults.append("<li>" + result.action.name + "</li>");
    });
}

function setupActions():NodeAction[] {
    let moveToBank: NodeAction = new NodeAction();
    moveToBank.name = "Move to bank";
    moveToBank.cost = 1;
    moveToBank.preconditions = new WorldState();
    moveToBank.effects = new WorldState();
    moveToBank.effects.myPosX = 5;
    moveToBank.effects.myPosY = 5;

    let takeMoneyFromBank: NodeAction = new NodeAction();
    takeMoneyFromBank.name = "Take money from bank";
    takeMoneyFromBank.cost = 1;
    takeMoneyFromBank.preconditions = new WorldState();
    takeMoneyFromBank.preconditions.myPosX = 5;
    takeMoneyFromBank.preconditions.myPosY = 5;
    takeMoneyFromBank.preconditions.moneyAtBank = 5;
    takeMoneyFromBank.effects = new WorldState();
    takeMoneyFromBank.effects.moneyWithMe = 5;
    takeMoneyFromBank.effects.moneyAtBank = 0;

    let workAJob: NodeAction = new NodeAction();
    workAJob.name = "Another day, another dolla (Work)";
    workAJob.cost = 1;
    workAJob.preconditions = new WorldState();
    workAJob.effects = new WorldState();
    workAJob.effects.moneyAtBank = 5;
    

    let buyPizza: NodeAction = new NodeAction();
    buyPizza.name = "Eat pizza";
    buyPizza.cost = 1;
    buyPizza.preconditions = new WorldState();
    buyPizza.preconditions.hungry = true;
    buyPizza.preconditions.moneyWithMe = 5;
    buyPizza.effects = new WorldState();
    buyPizza.effects.moneyWithMe = 0;
    buyPizza.effects.hungry = false;
    buyPizza.effects.isRelaxed = true;

    let learnToMakeBestToastie: NodeAction = new NodeAction();
    learnToMakeBestToastie.name = "Have a revelation - i know how to make the worlds best toastie";
    learnToMakeBestToastie.cost = 1;
    learnToMakeBestToastie.preconditions = new WorldState();
    learnToMakeBestToastie.preconditions.isRelaxed = true;
    learnToMakeBestToastie.effects = new WorldState();
    learnToMakeBestToastie.effects.numFoodRecipes = 1;

    let makeToastie: NodeAction = new NodeAction();
    makeToastie.name = "Make Toastie";
    makeToastie.cost = 1;
    makeToastie.preconditions = new WorldState();
    makeToastie.preconditions.numFoodRecipes = 1;
    makeToastie.preconditions.numCheese = 1;
    makeToastie.preconditions.numBread = 2;
    makeToastie.effects = new WorldState();
    makeToastie.effects.hungry = false;
    makeToastie.effects.numToastie = 1;
    makeToastie.effects.numCheese = -1;
    makeToastie.effects.numBread = -1;

    let serveCustomers: NodeAction = new NodeAction();
    serveCustomers.name = "Serve customers";
    serveCustomers.cost = 1;
    serveCustomers.preconditions = new WorldState();
    serveCustomers.preconditions.numToastie = 6;
    serveCustomers.effects = new WorldState();
    serveCustomers.effects.customersServed = true;

    let getSliceOfBread: NodeAction = new NodeAction();
    getSliceOfBread.name = "Get Slice of Bread";
    getSliceOfBread.cost = 1;
    getSliceOfBread.preconditions = new WorldState();
    getSliceOfBread.effects = new WorldState();
    getSliceOfBread.effects.numBread = 1;

    let getCheese: NodeAction = new NodeAction();
    getCheese.name = "Get cheese";
    getCheese.cost = 1;
    getCheese.preconditions = new WorldState();
    getCheese.effects = new WorldState();
    getCheese.effects.numCheese = 1;
    return [ workAJob, moveToBank, getSliceOfBread, getCheese, buyPizza, learnToMakeBestToastie , serveCustomers, takeMoneyFromBank, makeToastie ];
}

function renderActions(actions:NodeAction[]){
    const $actionList = $(".action-list");

    let resultList = "";
    actions.forEach((action:NodeAction) => {
        let actionHtml = $(".action-item-template").html();
        actionHtml = actionHtml.replace("{{name}}", action.name);
        actionHtml = actionHtml.replace("{{cost}}", action.cost.toString());
        actionHtml = actionHtml.replace("{{preconditions}}", JSON.stringify( action.preconditions ) );
        actionHtml = actionHtml.replace("{{effects}}", JSON.stringify( action.effects ) );

        resultList += actionHtml;
    });
    $actionList.empty();
    $actionList.append(resultList);
}

function retrieveWorldState($element):WorldState{
    let jsonObj:WorldState = JSON.parse($element.val());
    return jsonObj;
}