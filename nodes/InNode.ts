import { NEATNode } from "./Node";

export class NEATInNode extends NEATNode {
    deepCopy() {
        return new NEATInNode(this.id,this.layer);
    }
}
