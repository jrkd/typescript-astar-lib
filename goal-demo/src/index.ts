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
    moveToBank.cost = 5;
    moveToBank.preconditions = new WorldState();
    moveToBank.preconditions.myPosX = 0;
    moveToBank.preconditions.myPosY = 0;
    moveToBank.effects = new WorldState();
    moveToBank.effects.myPosX = 100;
    moveToBank.effects.myPosY = 100;

    let takeMoneyFromBank: NodeAction = new NodeAction();
    takeMoneyFromBank.name = "Take money from bank";
    takeMoneyFromBank.cost = 1;
    takeMoneyFromBank.preconditions = new WorldState();
    takeMoneyFromBank.preconditions.myPosX = 100;
    takeMoneyFromBank.preconditions.myPosY = 100;
    takeMoneyFromBank.preconditions.moneyAtBank = 100;
    takeMoneyFromBank.effects = new WorldState();
    takeMoneyFromBank.effects.moneyWithMe = 100;
    takeMoneyFromBank.effects.moneyAtBank = 0;

    let workAJob: NodeAction = new NodeAction();
    workAJob.name = "Another day, another dolla (Work)";
    workAJob.cost = 1;
    workAJob.preconditions = new WorldState();
    workAJob.effects = new WorldState();
    workAJob.effects.moneyAtBank = 100;
    

    let buyPizza: NodeAction = new NodeAction();
    buyPizza.name = "Buy pizza";
    buyPizza.cost = 1;
    buyPizza.preconditions = new WorldState();
    buyPizza.preconditions.hungry = true;
    buyPizza.preconditions.moneyWithMe = 100;
    buyPizza.effects = new WorldState();
    buyPizza.effects.moneyWithMe = 0;
    buyPizza.effects.hungry = false;

    let makeToastie: NodeAction = new NodeAction();
    makeToastie.name = "Make Toastie";
    makeToastie.cost = 4;
    makeToastie.preconditions = new WorldState();
    makeToastie.preconditions.numFoodRecipes = 1;
    makeToastie.preconditions.numCheese = 1;
    makeToastie.preconditions.numBread = 2;
    makeToastie.effects = new WorldState();
    makeToastie.effects.hungry = false;

    let getSliceOfBread: NodeAction = new NodeAction();
    getSliceOfBread.name = "Get Slice of Bread";
    getSliceOfBread.cost = 1;
    getSliceOfBread.preconditions = new WorldState();
    getSliceOfBread.effects = new WorldState();
    getSliceOfBread.effects.numBread = 2;

    let getCheese: NodeAction = new NodeAction();
    getCheese.name = "Get cheese";
    getCheese.cost = 1;
    getCheese.preconditions = new WorldState();
    getCheese.effects = new WorldState();
    getCheese.effects.numCheese = 1;
    return [ moveToBank, buyPizza, workAJob, takeMoneyFromBank, makeToastie, getSliceOfBread, getCheese ];
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