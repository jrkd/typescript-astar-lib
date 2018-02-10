class BinaryHeap<T> { 
    content:T[];
    scoreFunction:Function;

    constructor(scoreFunction:Function) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
      
    push(element:T):void {
        // Add the new element to the end of the array.
        this.content.push(element);
    
        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    }

    pop():T {
        // Store the first element so we can return it later.
        let result:T = this.content[0];
        // Get the element at the end of the array.
        let end:T = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
        this.content[0] = end;
        this.bubbleUp(0);
        }
        return result;
    }

    remove(node:T):void {
        let i:number = this.content.indexOf(node);
    
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        let end:T = this.content.pop();
    
        if (i !== this.content.length - 1) {
        this.content[i] = end;
    
        if (this.scoreFunction(end) < this.scoreFunction(node)) {
            this.sinkDown(i);
        } else {
            this.bubbleUp(i);
        }
        }
    }

    size():number {
        return this.content.length;
    }
    
    rescoreElement(node:T):void {
        this.sinkDown(this.content.indexOf(node));
    }

    sinkDown(n:number):void {
        // Fetch the element that has to be sunk.
        let element:T = this.content[n];
    
        // When at 0, an element can not sink any further.
        while (n > 0) {
    
        // Compute the parent element's index, and fetch it.
        let parentN:number = ((n + 1) >> 1) - 1;
        let parent:T = this.content[parentN];
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
            this.content[parentN] = element;
            this.content[n] = parent;
            // Update 'n' to continue at the new position.
            n = parentN;
        }
        // Found a parent that is less, no need to sink any further.
        else {
            break;
        }
        }
    }
    
    bubbleUp(n):void {
        // Look up the target element and its score.
        let length:number = this.content.length;
        let element:T = this.content[n];
        let elemScore:number = this.scoreFunction(element);
    
        while (true) {
        // Compute the indices of the child elements.
        let child2N:number = (n + 1) << 1;
        let child1N:number = child2N - 1;
        // This is used to store the new position of the element, if any.
        let swap:number = null;
        let child1Score:number;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
            // Look it up and compute its score.
            let child1:T = this.content[child1N];
            child1Score = this.scoreFunction(child1);
    
            // If the score is less than our element's, we need to swap.
            if (child1Score < elemScore) {
            swap = child1N;
            }
        }
    
        // Do the same checks for the other child.
        if (child2N < length) {
            let child2:T = this.content[child2N];
            let child2Score:number = this.scoreFunction(child2);
            if (child2Score < (swap === null ? elemScore : child1Score)) {
            swap = child2N;
            }
        }
    
        // If the element needs to be moved, swap it, and continue.
        if (swap !== null) {
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
        // Otherwise, we are done.
        else {
            break;
        }
        }
    }
}