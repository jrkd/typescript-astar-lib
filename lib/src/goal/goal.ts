interface IGoal {
    desire:WorldState;

    //Maybe goals need this too on checking whether we've made it?...Maybe not.
    checkAdditionalThings():boolean; 
}