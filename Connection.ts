import {NEATNode} from "./nodes/Node";

export class Connection {
    inNode: NEATNode;
    outNode: NEATNode;
    weight: number;
    enabled: Boolean;
    id: number;
    
    constructor(inNode:NEATNode, outNode:NEATNode,weight:number, id:number) {
        this.inNode = inNode;
        this.outNode = outNode;
        this.weight = weight;
        this.enabled = true;
        this.id = id;
    }

    deepCopy(deepCopyNodes:boolean) {
        let newInNode = this.inNode;
        let newOutNode = this.outNode;
        if (deepCopyNodes){ 
            newInNode = this.inNode.deepCopy();
            newOutNode = this.outNode.deepCopy();
        }
        return new Connection(newInNode, newOutNode, this.weight, this.id);
    }
}


