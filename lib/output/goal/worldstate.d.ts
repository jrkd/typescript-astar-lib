export declare class WorldState {
    hungry: boolean;
    moneyWithMe: number;
    moneyAtBank: number;
    numFoodRecipes: number;
    myPosX: number;
    myPosY: number;
    recipePosX: number;
    recipePosY: number;
    bankPosX: number;
    bankPosY: number;
    numBread: number;
    numCheese: number;
    numToastie: number;
    customersServed: boolean;
    isRelaxed: boolean;
    containedWithin(fullState: WorldState): boolean;
    applyTo(fullState: WorldState): WorldState;
}
