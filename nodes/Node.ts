
export class NEATNode {
    id: number;
    layer: number;

    constructor(id:number,layer:number) {
        this.id = id;
        this.layer = layer;
    }

    deepCopy() {
        return new NEATNode(this.id,this.layer);
    }
}

