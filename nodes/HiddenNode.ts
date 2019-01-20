import { NEATNode } from "./Node";

export class NEATHiddenNode extends NEATNode {
    deepCopy() {
        return new NEATHiddenNode(this.id,this.layer);
    }
}
