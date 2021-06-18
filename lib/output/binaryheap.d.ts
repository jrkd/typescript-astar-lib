export declare class BinaryHeap<T> {
    content: T[];
    scoreFunction: Function;
    constructor(scoreFunction: Function);
    push(element: T): void;
    pop(): T;
    remove(node: T): void;
    size(): number;
    rescoreElement(node: T): void;
    sinkDown(n: number): void;
    bubbleUp(n: any): void;
}
