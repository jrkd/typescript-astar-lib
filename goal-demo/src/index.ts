import {AStar, GridGraph, Planner, NodeWorldState} from "new-astar";
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

    results.forEach(result => {
        $plannerResults.insertAfter("<li>"+result+"</li>");
    });

    $("#btnGenerate").click(function() {
        //grid.initialize();
    });

    $selectWallFrequency.change(function() {
        // grid.setOption({wallFrequency: $(this).val()});
        // grid.initialize();
    });

});