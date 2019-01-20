import { NEATNode } from "./Node";

export class NEATOutNode extends NEATNode {
    deepCopy() {
        return new NEATOutNode(this.id,this.layer);
    }
}