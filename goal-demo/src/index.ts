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
    hoverPreviewEnabled: true,
    hoverPreviewArrayCount: 100,
    hoverPreviewFieldCount: 5,
    theme: '',
    animateOpen: true,
    animateClose: true,
    useToJSON: true
};

let currentWorldState: WorldState = new WorldState();
currentWorldState = $.extend(currentWorldState, {
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
});


const editableOptions = { 
    "search": false,
    "mainMenuBar": false,
    "navigationBar": false, 
    "limitDragging": true,
    // "onCreateMenu": (items, context) =>{
    //     return items.filter( (el, _) => {
    //         return el.text == "Append" || el.text == "Remove"
    //     }).map((el) => { delete el.submenu;return el;});
    // }
  };

  
const goalOptions = { 
    "search": false,
    "mainMenuBar": false,
    "navigationBar": false, 
    "limitDragging": true
  };

class ActionSet {
    name:string;
    actions:NodeAction[];
    disabledActions:NodeAction[];
};

class ActionSetPlan{
    currentGoal:WorldState;
    currentGoalName:string;
    currentActionPlan:GoalEdge[] = [];

    isSuccessful(currentWorldState:WorldState):boolean{
        return this.currentGoal && this.currentGoal.containedWithin(currentWorldState);
    }

    isValid(currentWorldState:WorldState){
        return this.currentGoal 
        && !this.isSuccessful(currentWorldState)
        && this.currentActionPlan.length > 0 
        && this.currentActionPlan[0].action.preconditions.containedWithin(currentWorldState);
        //&& this.checkPlanIsValidFromCurrentState(currentWorldState, this.currentGoal);
    }

    executeNextStep(currentWorldState:WorldState):WorldState{
        let updatedWorldState = this.currentActionPlan[0].action.effects.applyTo(currentWorldState);
        //
        // NOTE!: this is where you would run custom JS and not neccesarrily slice the array immediately.
        //
        this.currentActionPlan = this.currentActionPlan.slice(1);
        return updatedWorldState;
    }

    // checkPlanIsValidFromCurrentState(currentWorld:WorldState, goalWorld:WorldState):boolean{
    //     let isValid:boolean = true;
    //     return isValid;
    // }
}

let currentPlans:Map<string, ActionSetPlan> = new Map<string, ActionSetPlan>();

let actionSets:ActionSet[] = [];
let intitialWorldStateEditor, goalWorldStateEditor;

let goalStateJSON = {
    "Serve Customers": {
        "customersServed": true
    }, 
    "Dont be hungry": {
        "isHungry": false
    }
};

let nextActionsetTurnIndex:number = 0;
let currentActivityIndex:number = 0;

$(function() {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("initialStateJSON"))
    {
        loadDataFromQuerystring();
    }
    else
    {
        loadDataFromStorage();
    }

    intitialWorldStateEditor = new JSONEditor($(".initial-world-state")[0], $.extend(editableOptions,{"name":"Initial world state"}));
    intitialWorldStateEditor.set(currentWorldState);

    goalWorldStateEditor = new JSONEditor($(".goal-world-state")[0], $.extend(goalOptions,{"name":"Goal world state"}));
    goalWorldStateEditor.set(goalStateJSON);
    // $(".initial-world-state").append(new JSONFormatter(initialStateJSON, 1, jsonFormatterOptions).render());
    // $(".goal-world-state").append(new JSONFormatter(goalStateJSON, 1, jsonFormatterOptions).render());

    renderActionsets(actionSets);

    $("#saveCurrent").click((e)=>{
        e.preventDefault();
        updateDataFromPage();
        saveDataToQuerystring();
    });
    $("#reset").click((e)=>{
        e.preventDefault();
        saveDataToStorage({}, {}, []);
        loadDataFromStorage();
        renderActionsets(actionSets);
        renderWorldStatesOnPage();
    });
    $(".run-search").click(()=>{
        updateDataFromPage();
        const currentActionset = getCurrentActionset();

        $(".plan-list-results").empty();
        actionSets.forEach(actionset=>runSearch(actionset));
    });
    $("#addAction").click(()=>{
        let currentActionset = getCurrentActionset();
        if(!currentActionset){
            let $firstActionsetButton = $("#actionset-names-dropdown .dropdown-item:first");
            if($firstActionsetButton.length == 0){
                addNewActionset(false);
                $firstActionsetButton = $("#actionset-names-dropdown .dropdown-item:first");
            }
            $firstActionsetButton.addClass("active");
            $(".actionset-container:first").addClass("active show");
            currentActionset = getCurrentActionset();
        }
        let $actionList = $('.actionset-container.active .action-list');
        addEmptyAction($actionList, currentActionset.name); 
    });

    $("#addActionList").click(()=>{
        updateDataFromPage();

        addNewActionset();

        let $newActionsetButton = $("#actionset-names-dropdown .dropdown-item:last");
        $newActionsetButton.addClass("active");
        $(".actionset-container:last").addClass("active show");
    });

    $("#nextStep").click(()=>{
        updateDataFromPage();
        let currentActionset:ActionSet = actionSets[nextActionsetTurnIndex];

        if(currentActivityIndex == 0){
            //run initital plan. 
            actionSets.forEach(actionset=>runSearch(actionset));
        }
        implementPlanWithAction(currentActionset);

        //loop back around to the first actionset if at the end of list.
        nextActionsetTurnIndex = nextActionsetTurnIndex + 1;
        if(nextActionsetTurnIndex >= actionSets.length){
            nextActionsetTurnIndex = 0;
        }

        intitialWorldStateEditor.set(currentWorldState);
        ++currentActivityIndex;
        $('.activity-log').scrollTop($('.activity-log')[0].scrollHeight); //keep at the bottom
        $('html, body').scrollTop( $(document).height());
    }); 
    

    $('body').on('click', '.delete-action',(e)=>{
        $(e.currentTarget).closest(".accordion-item").remove();
    });
});

function addNewActionset(includeEmptyAction:boolean = true) {
    let newActionSet = new ActionSet();
    let numNewActionsetsAlready = actionSets.filter(actionset=>actionset.name.startsWith("New-Actionset")).length
    newActionSet.name = "New-Actionset"+numNewActionsetsAlready + 1;
    newActionSet.actions = [];
    newActionSet.disabledActions = [];
    if(includeEmptyAction){
        newActionSet.actions = [
            new NodeAction()
        ];
    }
    actionSets.push(newActionSet);
    renderActionsets(actionSets);
}

function implementPlanWithAction(actionset:ActionSet){
    let plan:ActionSetPlan = currentPlans.get(actionset.name);
    if(!plan || !plan.isValid(currentWorldState) || plan.isSuccessful(currentWorldState) )
    {
        // This plan is no good. Look for a new one.
        if(!!plan && plan.isSuccessful(currentWorldState)){
            logNewActivity("#activity-log-complete-goal-template", "", plan.currentGoalName, actionset.name);
        }

        currentPlans.delete(actionset.name);
        let newPlan = runSearch(actionset);
        if(newPlan){
            currentPlans.set(actionset.name, newPlan);

        }

        if(!newPlan) {
            logNewActivity("#activity-log-no-goals-template", "", "", actionset.name);
        }
    } 

    plan = currentPlans.get(actionset.name); // Current plan might have changed.
    if( plan && plan.isValid(currentWorldState) )
    {
        logNewActivity("#activity-log-use-action-template", plan.currentActionPlan[0].action.name, plan.currentGoalName, actionset.name);
        currentWorldState = plan.executeNextStep(currentWorldState);
    }
}

function logNewActivity(activityLogItemTemplateSelector:string, actionName:string, goalName:string, agentName:string){
    let $itemTemplate = $(activityLogItemTemplateSelector);
    let activtyHTML = $itemTemplate.html();
    activtyHTML = activtyHTML.split("{{actionName}}").join(actionName);
    activtyHTML = activtyHTML.split("{{goalName}}").join(goalName);
    activtyHTML = activtyHTML.split("{{agentName}}").join(agentName);
    
    $(".activity-log").append(activtyHTML);
}

function updateDataFromPage(){
    //set initial and goal state based on current 
    updateWorldStatesFromPage();

    $(".actionset-container").each( (index, actionsetContainer) =>{
        const actionsetName:string = $(actionsetContainer).find(".actionset-name").val().toString();
        let currentActionset:ActionSet = actionSets.filter(actionset=>actionset.name === actionsetName)[0];
        if(currentActionset == null){
            currentActionset = new ActionSet();
            currentActionset.name = actionsetName;
            actionSets.push(currentActionset);
        }
        //let actions = currentActionset.actions;
        currentActionset.actions = [];
        currentActionset.disabledActions = [];
        let $actionList = $(actionsetContainer).find(`.action-list`);
        $actionList.children()
        // .filter((index,child) => $(child).find(".form-check-input").is(":checked"))
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
    
            if($(element).find(".form-check-input").is(":checked")){
                currentActionset.actions.push(newAction);
            }
            else{
                currentActionset.disabledActions.push(newAction);
            }           
        });
    });
    saveDataToStorage(currentWorldState, goalStateJSON, actionSets);
    renderActionsets(actionSets);
}

function updateWorldStatesFromPage() {
    currentWorldState = new WorldState();
    currentWorldState = $.extend(currentWorldState, intitialWorldStateEditor.get());
    goalStateJSON = goalWorldStateEditor.get();
}

function renderWorldStatesOnPage(){
    intitialWorldStateEditor.set(currentWorldState);
    goalWorldStateEditor.set(goalStateJSON);
}

function getCurrentActionset():ActionSet
{
    let actionsetName:string = $($("#actionset-names-dropdown .active")[0]).text();
    const visibleActionsets = actionSets.filter((actionset => actionset.name == actionsetName));
    if(visibleActionsets.length > 0){
        return visibleActionsets[0];
    }else{
        return undefined;
    }
}

function saveDataToStorage(initialStateJSON, goalStateJSON, actionSets:ActionSet[])
{
    window.localStorage.setItem("initialStateJSON", JSON.stringify(initialStateJSON));
    window.localStorage.setItem("goalStateJSON", JSON.stringify(goalStateJSON));
    window.localStorage.setItem("actionsets", JSON.stringify(actionSets));
}

function loadDataFromStorage(){
    const stoageInitialStateJSON = window.localStorage.getItem("initialStateJSON");
    if(stoageInitialStateJSON != null && stoageInitialStateJSON.length > 0){
        currentWorldState = new WorldState();
        currentWorldState = $.extend(currentWorldState, JSON.parse(stoageInitialStateJSON));
    }
    
    const storageGoalStateJSON = window.localStorage.getItem("goalStateJSON");
    if(storageGoalStateJSON != null &&  storageGoalStateJSON.length > 0){
        goalStateJSON = JSON.parse(storageGoalStateJSON);
    }
    
    const storageActionsets = window.localStorage.getItem("actionsets");
    if(storageActionsets != null &&  storageActionsets.length > 0){
        const storageActionsetsJSON:Array<any> = JSON.parse(storageActionsets);
        if(storageActionsetsJSON){
            actionSets = storageActionsetsJSON.map(actionsetJSON => {
                let actionset:ActionSet = actionsetJSON;
                actionset.actions = actionset.actions.map(actionJSON => {
                    let action:NodeAction = $.extend(new NodeAction(), actionJSON);
                    action.preconditions = $.extend(new WorldState(), actionJSON.preconditions);
                    action.effects = $.extend(new WorldState(), actionJSON.effects);
                    return action;
                });
                if(actionset.disabledActions){
                    actionset.disabledActions = actionset.disabledActions.map(actionJSON => {
                        let action:NodeAction = $.extend(new NodeAction(), actionJSON);
                        action.preconditions = $.extend(new WorldState(), actionJSON.preconditions);
                        action.effects = $.extend(new WorldState(), actionJSON.effects);
                        return action;
                    });
                } else{
                    actionset.disabledActions = [];
                }
                
                return actionset;
            });
        }
    }
}

function loadDataFromQuerystring(){

    const urlParams = new URLSearchParams(window.location.search);
    
    const stoageInitialStateJSON = decodeURIComponent(urlParams.get('initialStateJSON'));
    if(stoageInitialStateJSON != null && stoageInitialStateJSON.length > 0){
        currentWorldState = new WorldState();
        currentWorldState = $.extend(currentWorldState, JSON.parse(stoageInitialStateJSON));
    }
    
    const storageGoalStateJSON = decodeURIComponent(urlParams.get("goalStateJSON"));
    if(storageGoalStateJSON != null &&  storageGoalStateJSON.length > 0){
        goalStateJSON = JSON.parse(storageGoalStateJSON);
    }
    
    const storageActionsets = decodeURIComponent(urlParams.get("actionsets"));
    if(storageActionsets != null &&  storageActionsets.length > 0){
        actionSets = JSON.parse(storageActionsets).map(actionsetJSON => {
            let actionset:ActionSet = actionsetJSON;
            actionset.actions = actionset.actions.map(actionJSON => {
                let action:NodeAction = $.extend(new NodeAction(), actionJSON);
                action.preconditions = $.extend(new WorldState(), actionJSON.preconditions);
                action.effects = $.extend(new WorldState(), actionJSON.effects);
                return action;
            });
            if(actionset.disabledActions){
                actionset.disabledActions = actionset.disabledActions.map(actionJSON => {
                    let action:NodeAction = $.extend(new NodeAction(), actionJSON);
                    action.preconditions = $.extend(new WorldState(), actionJSON.preconditions);
                    action.effects = $.extend(new WorldState(), actionJSON.effects);
                    return action;
                });
            }else{
                actionset.disabledActions = [];
            }

            return actionset;
        });
    }
}

function saveDataToQuerystring(){
    window.location.href = window.location.href.split('?')[0] + "?initialStateJSON=" + encodeURIComponent(JSON.stringify(currentWorldState)) 
                                                            + "&goalStateJSON=" + encodeURIComponent(JSON.stringify(goalStateJSON))
                                                            + "&actionsets=" + encodeURIComponent(JSON.stringify(actionSets));
}

function runSearch(actionset:ActionSet):ActionSetPlan {
    let resultPlan:ActionSetPlan = undefined;
    var $plannerResults = $("#plannerList");
    $plannerResults.empty();
    var planner = new Planner();
    planner.actions = actionset.actions;

    //setup current state
    let startState: WorldState = currentWorldState;
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

        let goalResults = runSearchForGoal(actionset.actions, startState, goalState);
        if(goalResults.length > 0){
            results = goalResults;
            metGoalName = goalName;
            resultPlan = new ActionSetPlan();
            resultPlan.currentGoal = goalState;
            resultPlan.currentActionPlan = goalResults as GoalEdge[];
            resultPlan.currentGoalName = goalName;
            break;
        } else{
            unmetGoals.push(goalName);
        }
    }
    renderPlan(startNode, results, actionset, unmetGoals, metGoalName);
    return resultPlan;
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

function renderActionsets(actionsets:ActionSet[])
{
    let $actionsetTabTemplate = $(".actionset-tab-template");
    let $actionsetTabContainer = $("#actionset-names-dropdown");

    let $actionsetTabContentTemplate = $(".actionset-tab-content-template");
    let $actionsetTabContentContainer = $("#myTabContent");

    $actionsetTabContainer.empty();
    $actionsetTabContentContainer.empty();
    actionsets.forEach((actionset:ActionSet, index:number) => {

        let actionsetTabHtml:string = $actionsetTabTemplate.html();
        actionsetTabHtml = actionsetTabHtml.split("{{name}}").join(actionset.name);
        actionsetTabHtml = actionsetTabHtml.split("{{index}}").join(index.toString());

        $actionsetTabContainer.append(actionsetTabHtml);

        let actionsetTabContentHtml:string = $actionsetTabContentTemplate.html();
        actionsetTabContentHtml = actionsetTabContentHtml.split("{{name}}").join(actionset.name);
        actionsetTabContentHtml = actionsetTabContentHtml.split("{{index}}").join(index.toString());

        $actionsetTabContentContainer.append(actionsetTabContentHtml);

        //Once we've added the html for each action list, we populate the actions as per. 

        let $actionList = $(`#actions-${actionset.name}-accordion`);

        renderActions(actionset.name, $actionList, actionset.actions, actionset.disabledActions);
    });
}


function renderActions(actionsetName:string, $actionList, actions:NodeAction[], disabledActions:NodeAction[]){
    //const $actionList = $(".action-list");
    $actionList.empty();
    actions.forEach((action:NodeAction) => {
        addActionToHTML(actionsetName, $actionList, action.name, action.cost, action.preconditions, action.effects);
    });
    disabledActions.forEach((action:NodeAction) => {
        addActionToHTML(actionsetName, $actionList, action.name, action.cost, action.preconditions, action.effects, false);
    });
}

function addActionToHTML(actionsetName:string, $actionList, name = "[New action]", cost = 1, preconditionsJSON = {}, effectsJSON = {}, enabled = true) { 
    let actionHtml = $(".action-item-template").html();
    actionHtml = actionHtml.split("{{index}}").join($actionList.children().length.toString());
    actionHtml = actionHtml.split("{{name}}").join(name);
    actionHtml = actionHtml.split("{{cost}}").join(cost.toString());
    actionHtml = actionHtml.split("{{actionsetName}}").join(actionsetName);

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
    
    $newAction.find(".form-check-input").prop('checked', enabled);
}

function addEmptyAction($actionList, actionsetName:string) { 
    //const $actionList = $(".action-list");
    let actionHtml = $(".action-item-template").html();
    actionHtml = actionHtml.split("{{index}}").join($actionList.children().length.toString());
    actionHtml = actionHtml.split("{{name}}").join("[New action]");
    actionHtml = actionHtml.split("{{cost}}").join("1");
    actionHtml = actionHtml.split("{{actionsetName}}").join(actionsetName);

    let preconditionsFormatted = $(new JSONFormatter({}).render()).html();
    actionHtml = actionHtml.split("{{preconditions}}").join( "" );

    let effectsFormatted = $(new JSONFormatter({}).render()).html();
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

function renderPlan(startNode:GoalNode, results:IGraphEdge[], actionset:ActionSet, unmetGoals:string[], metGoalName:string){
    let $planContainer = $(".plan-list-results");
    let planTemplateHtml = $(".plan-template").html();
    let goalDetailsHTML = "";
    unmetGoals.forEach( goalname => {
        goalDetailsHTML += $(".plan-unmet-goal").html().split("{{goalName}}").join(goalname);
    });
    if(metGoalName){
        goalDetailsHTML += $(".plan-met-goal").html().split("{{goalName}}").join(metGoalName);
    }

    planTemplateHtml = planTemplateHtml.split("{{actionsetname}}").join(actionset.name);
    planTemplateHtml = planTemplateHtml.split("{{goalDetailsHTML}}").join(goalDetailsHTML);

    let existingPlan = $planContainer.find(".actionset-goal-details." + actionset.name + "-goal-details");//{{actionsetname}}-goal-details
    if(existingPlan && existingPlan.length > 0){
        existingPlan.remove();
    }
    $planContainer.append(planTemplateHtml);
    
    let $planActionList = $(".plannerList:last");
    let $planActionDetailList = $(".plannerDetailList:last");
    
    let currentNode: GoalNode = startNode;

    let resultPlanActions:string = "";
    let resultPlanActionDetails:string = "";
    results.forEach((result: GoalEdge, index:number) => {
        
        let planActionHtml = $("#plan-item-template").html();
        let planActionDetailHtml = $(".plan-item-detail-template").html();

        planActionHtml = planActionHtml.split("{{index}}").join(index.toString());
        planActionHtml = planActionHtml.split("{{actionName}}").join(result.action.name);
        planActionHtml = planActionHtml.split("{{actionsetName}}").join(actionset.name);
        resultPlanActions += planActionHtml;

        currentNode = result.action.ActivateAction(currentNode);

        planActionDetailHtml = planActionDetailHtml.split("{{index}}").join(index.toString());
        planActionDetailHtml = planActionDetailHtml.split("{{actionName}}").join(result.action.name);
        planActionDetailHtml = planActionDetailHtml.split("{{actionsetName}}").join(actionset.name);

        let actionEffectsFormatted = $(new JSONFormatter(result.action.effects, 99, jsonFormatterOptions).render()).html();
        planActionDetailHtml = planActionDetailHtml.split("{{actionEffects}}").join(actionEffectsFormatted);

        let actionDetailFormatted = $(new JSONFormatter(currentNode.state, 99, jsonFormatterOptions).render()).html();
        planActionDetailHtml = planActionDetailHtml.split("{{changedState}}").join(actionDetailFormatted);
        resultPlanActionDetails += planActionDetailHtml;
    });

    $planActionList.empty();
    $planActionList.append(resultPlanActions);

    $planActionDetailList.empty();
    $planActionDetailList.append(resultPlanActionDetails);
}