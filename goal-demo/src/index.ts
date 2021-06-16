import {AStar, GridGraph, Planner, WorldState, GoalNode, NodeAction, GoalEdge} from "new-astar";
import * as $ from "jquery"; 
import { IGraphEdge } from "../../lib/output/graphedge";
declare var require: any;

const JSONFormatter = require('json-formatter-js');
const JSONEditor = require('jsoneditor');


 
/*  demo.js http://github.com/bgrins/javascript-astar
    MIT License

    Set up the demo page for the A* Search
*/
/* global Graph, astar, $ */

var actions: NodeAction[];
let jsonFormatterOptions = {
    hoverPreviewEnabled: false,
    hoverPreviewArrayCount: 100,
    hoverPreviewFieldCount: 5,
    theme: '',
    animateOpen: true,
    animateClose: true,
    useToJSON: true
};

let initialStateJSON = {
    "hungry": true,
    "moneyWithMe": 0,
    "numFoodRecipes": 0,
    "moneyAtBank": 5,
    "bankPosX": 5,
    "bankPosY": 5,
    "numBread": 0,
    "numCheese": 0,
    "myPosX": 0,
    "myPosY": 0
};

const editableOptions = { 
    "search": false,
    "mainMenuBar": false,
    "navigationBar": false, 
    "limitDragging": true,
    "onCreateMenu": (items) =>{
      return items.filter( (el) => {
        return el.text == "Append" || el.text == "Remove"
      }).map((el) => { delete el.submenu;return el;});
    }
  };

let goalStateJSON = {
    "customersServed": true
};    

$(function() {
    const intitialWorldStateEditor = new JSONEditor($(".initial-world-state")[0], $.extend(editableOptions,{"name":"Initial world state"}));
    intitialWorldStateEditor.set(initialStateJSON);

    const goalWorldStateEditor = new JSONEditor($(".goal-world-state")[0], $.extend(editableOptions,{"name":"Goal world state"}));
    goalWorldStateEditor.set(goalStateJSON);
    // $(".initial-world-state").append(new JSONFormatter(initialStateJSON, 1, jsonFormatterOptions).render());
    // $(".goal-world-state").append(new JSONFormatter(goalStateJSON, 1, jsonFormatterOptions).render());

    //setup the actions we can use. 
    //planner.nodes -- we dont really have a full list of them right? cause each action just tweaks them?...
    //suppose you could make things quick by pre-processing?
    //actions:
    actions = setupActions();
    renderActions(actions);

    $(".run-search").click(()=>{
        runSearch();
    });
});

function runSearch() {
    var $plannerResults = $("#plannerList");
    $plannerResults.empty();
    var planner = new Planner();

    planner.actions = actions;

    //setup current state
    let startState: WorldState = new WorldState();
    $.extend(startState, initialStateJSON);

    let goalState: WorldState = new WorldState();
    $.extend(goalState, goalStateJSON);

    let startNode: GoalNode = new GoalNode();
    startNode.state = startState;
    let goalNode: GoalNode = new GoalNode();
    goalNode.state = goalState;

    planner.preprocessGraph(startNode);

    let results = AStar.search(planner, startNode, goalNode, {});

    

    if (results.length == 0) {
        $plannerResults.html("<h1>no plan available!</h1>");
    }
    renderPlan(startNode, results);
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
    actions.forEach((action:NodeAction, index) => {
        let actionHtml = $(".action-item-template").html();
        actionHtml = actionHtml.split("{{index}}").join(index.toString());
        actionHtml = actionHtml.split("{{name}}").join(action.name);
        actionHtml = actionHtml.split("{{cost}}").join(action.cost.toString());

        let preconditionsFormatted = $(new JSONFormatter(action.preconditions, 1, jsonFormatterOptions).render()).html();
        actionHtml = actionHtml.split("{{preconditions}}").join( preconditionsFormatted );

        let effectsFormatted = $(new JSONFormatter(action.effects, 1, jsonFormatterOptions).render()).html();
        actionHtml = actionHtml.split("{{effects}}").join( effectsFormatted );

        resultList += actionHtml;
    });
    $actionList.empty();
    $actionList.append(resultList);
}

function renderPlan(startNode:GoalNode, results:IGraphEdge[]){
    let $planActionList = $("#plannerList");
    let $planActionDetailList = $("#plannerDetailList");
    
    let currentNode: GoalNode = startNode;

    let resultPlanActions:string = "";
    let resultPlanActionDetails:string = "";
    results.forEach((result: GoalEdge, index:number) => {
        
        let planActionHtml = $("#plan-item-template").html();
        let planActionDetailHtml = $(".plan-item-detail-template").html();

        planActionHtml = planActionHtml.split("{{index}}").join(index.toString());
        planActionHtml = planActionHtml.split("{{actionName}}").join(result.action.name);
        resultPlanActions += planActionHtml;

        currentNode = result.action.ActivateAction(currentNode);

        planActionDetailHtml = planActionDetailHtml.split("{{index}}").join(index.toString());
        planActionDetailHtml = planActionDetailHtml.split("{{actionName}}").join(result.action.name);

        let actionEffectsFormatted = $(new JSONFormatter(result.action.effects, 1, jsonFormatterOptions).render()).html();
        planActionDetailHtml = planActionDetailHtml.split("{{actionEffects}}").join(actionEffectsFormatted);

        let actionDetailFormatted = $(new JSONFormatter(currentNode.state, 1, jsonFormatterOptions).render()).html();
        planActionDetailHtml = planActionDetailHtml.split("{{changedState}}").join(actionDetailFormatted);
        resultPlanActionDetails += planActionDetailHtml;
    });

    $planActionList.empty();
    $planActionList.append(resultPlanActions);

    $planActionDetailList.empty();
    $planActionDetailList.append(resultPlanActionDetails);
}


function retrieveWorldState($element):WorldState{
    let jsonObj:WorldState = JSON.parse($element.val());
    return jsonObj;
}