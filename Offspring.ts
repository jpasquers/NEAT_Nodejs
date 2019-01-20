import { Graph } from "./Graph";

export class Offspring {
    graph: Graph;
    fitness: number;
    
    constructor(graph,fitness) {
        this.graph = graph;
        this.fitness = fitness;
    }
}

