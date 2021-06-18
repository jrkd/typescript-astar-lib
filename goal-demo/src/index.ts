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
    "onCreateMenu": (items, context) =>{
        return items.filter( (el, _) => {
            return el.text == "Append" || el.text == "Remove"
        }).map((el) => { delete el.submenu;return el;});
    }
  };

  
const goalOptions = { 
    "search": false,
    "mainMenuBar": false,
    "navigationBar": false, 
    "limitDragging": true
  };

  var actions: NodeAction[];
let intitialWorldStateEditor, goalWorldStateEditor;

    let goalStateJSON = {
        "Serve Customers": {
            "customersServed": true
        }, 
        "Dont be hungry": {
            "isHungry": false
        }
    };

$(function() {
    loadDataFromStorage();

    intitialWorldStateEditor = new JSONEditor($(".initial-world-state")[0], $.extend(editableOptions,{"name":"Initial world state"}));
    intitialWorldStateEditor.set(initialStateJSON);

    goalWorldStateEditor = new JSONEditor($(".goal-world-state")[0], $.extend(goalOptions,{"name":"Goal world state"}));
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
        updateDataFromPage();
        runSearch();
    });
    $("#addAction").click(()=>{
        addEmptyAction(); 
    });
    $('body').on('click', '.delete-action',(e)=>{
        $(e.currentTarget).closest(".accordion-item").remove();
    });
});

function updateDataFromPage(){
    //set initial and goal state based on current 
    initialStateJSON = intitialWorldStateEditor.get();
    goalStateJSON = goalWorldStateEditor.get();

    actions = [];
    $(".action-list").children()
    .filter((index,child) => $(child).find(".form-check-input").is(":checked"))
    .each((index:number, element:HTMLElement) => {
        let $actionElement = $(element);
        let actionJSONEditorPreConditions = $(element).data("json-editor-preconditions");
        let actionJSONEditorEffects = $(element).data("json-editor-effects");
        let newAction: NodeAction = new NodeAction();
        newAction.name = $actionElement.find("input.action-name").val().toString();
        newAction.cost = parseInt($actionElement.find("input.action-cost").val().toString());

        let preconditionsJSON = actionJSONEditorPreConditions.get();
        newAction.preconditions = $.extend(new WorldState(), preconditionsJSON);

        let effectsJSON = actionJSONEditorEffects.get();
        newAction.effects = $.extend(new WorldState(), effectsJSON);

        actions.push(newAction);
    });

    saveDataToStorage(initialStateJSON, goalStateJSON, actions);
}

function saveDataToStorage(initialStateJSON, goalStateJSON, actions)
{
    window.localStorage.setItem("initialStateJSON", JSON.stringify(initialStateJSON));
    window.localStorage.setItem("goalStateJSON", JSON.stringify(goalStateJSON));
    window.localStorage.setItem("actions", JSON.stringify(actions));
}

function loadDataFromStorage(){
    const stoageInitialStateJSON = window.localStorage.getItem("initialStateJSON");
    if(stoageInitialStateJSON != null && stoageInitialStateJSON.length > 0){
        initialStateJSON = JSON.parse(stoageInitialStateJSON);
    }
    
    const storageGoalStateJSON = window.localStorage.getItem("goalStateJSON");
    if(storageGoalStateJSON != null &&  storageGoalStateJSON.length > 0){
        goalStateJSON = JSON.parse(storageGoalStateJSON);
    }
    
    const storageActions = window.localStorage.getItem("actions");
    if(storageActions != null &&  storageActions.length > 0){
        actions = JSON.parse(storageActions).map(actionJSON => {
            let action:NodeAction = $.extend(new NodeAction(), actionJSON);
            action.preconditions = $.extend(new WorldState(), actionJSON.preconditions);
            action.effects = $.extend(new WorldState(), actionJSON.effects);
            return action;
        });
    }
}

function runSearch() {
    $("#no-results-container").html("");

    var $plannerResults = $("#plannerList");
    $plannerResults.empty();
    var planner = new Planner();

    planner.actions = actions;

    //setup current state
    let startState: WorldState = new WorldState();
    $.extend(startState, initialStateJSON);

    let startNode: GoalNode = new GoalNode();
    startNode.state = startState;

    let results = [];//AStar.search(planner, startNode, goalNode, {});

    const goalNames = Object.keys(goalStateJSON);
    

    let unmetGoals = [];
    let metGoalName = "";
    for(let index = 0; index < goalNames.length; ++index)
    {
        const goalName = goalNames[index];
        let goalJSON:WorldState = goalStateJSON[goalName];
        let goalState: WorldState = new WorldState();
        $.extend(goalState, goalJSON);
        let goalResults = runSearchForGoal(actions, startState, goalState);
        if(goalResults.length > 0){
            results = goalResults;
            metGoalName = goalName;
            break;
        } else{
            unmetGoals.push(goalName);
        }
    }

    unmetGoals.forEach(goalName => {
        $("#no-results-container").append("<p>Unable to meet <mark>"+goalName + "</mark> goal"+"</p>");
    });

    if(metGoalName.length > 0){
        $("#no-results-container").append("<p>Plan to get to goal <mark>" +metGoalName + "</mark>"+"</p>");
    }
    
    renderPlan(startNode, results);
}

function runSearchForGoal(_actions:NodeAction[],startState: WorldState, goalState:WorldState):IGraphEdge[] {
    var planner = new Planner();

    planner.actions = _actions;

    let startNode: GoalNode = new GoalNode();
    startNode.state = startState;
    let goalNode: GoalNode = new GoalNode();
    goalNode.state = goalState;

    planner.preprocessGraph(startNode);

    let results = AStar.search(planner, startNode, goalNode, {});

    return results;
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
    $actionList.empty();
    actions.forEach((action:NodeAction) => {
        addActionToHTML(action.name, action.cost, action.preconditions, action.effects);
    });
}

function addActionToHTML(name = "[New actions]", cost = 1, preconditionsJSON = {}, effectsJSON = {}) { 
    const $actionList = $(".action-list");
    let actionHtml = $(".action-item-template").html();
    actionHtml = actionHtml.split("{{index}}").join($actionList.children().length.toString());
    actionHtml = actionHtml.split("{{name}}").join(name);
    actionHtml = actionHtml.split("{{cost}}").join(cost.toString());

    actionHtml = actionHtml.split("{{preconditions}}").join( "" );
    actionHtml = actionHtml.split("{{effects}}").join( "" );

    $actionList.append(actionHtml);

    let $newAction = $actionList.children().last();
    let actionPreconditionsEditor = new JSONEditor($newAction.find(".action-preconditions")[0], $.extend(editableOptions,{"name":"preconditions"}));
    actionPreconditionsEditor.set(preconditionsJSON);
    $newAction.data("json-editor-preconditions", actionPreconditionsEditor);
    let actionEffectsEditor = new JSONEditor($newAction.find(".action-effects")[0], $.extend(editableOptions,{"name":"effects"}));
    actionEffectsEditor.set(effectsJSON);
    $newAction.data("json-editor-effects", actionEffectsEditor);
}

function addEmptyAction() { 
    const $actionList = $(".action-list");
    let actionHtml = $(".action-item-template").html();
    actionHtml = actionHtml.split("{{index}}").join($actionList.children().length.toString());
    actionHtml = actionHtml.split("{{name}}").join("[New action]");
    actionHtml = actionHtml.split("{{cost}}").join("1");

    let preconditionsFormatted = $(new JSONFormatter({}, 1, jsonFormatterOptions).render()).html();
    actionHtml = actionHtml.split("{{preconditions}}").join( "" );

    let effectsFormatted = $(new JSONFormatter({}, 1, jsonFormatterOptions).render()).html();
    actionHtml = actionHtml.split("{{effects}}").join( "" );

    $actionList.append(actionHtml);

    let $newAction = $actionList.children().last();
    let actionPreconditionsEditor = new JSONEditor($newAction.find(".action-preconditions")[0], $.extend(editableOptions,{"name":"preconditions"}));
    actionPreconditionsEditor.set({});
    $newAction.data("json-editor-preconditions", actionPreconditionsEditor);
    let actionEffectsEditor = new JSONEditor($newAction.find(".action-effects")[0], $.extend(editableOptions,{"name":"effects"}));
    actionEffectsEditor.set({});
    $newAction.data("json-editor-effects", actionEffectsEditor);
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