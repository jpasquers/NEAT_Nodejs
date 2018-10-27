class Offspring {

    constructor(graph, calcFitness) {
        this.graph = graph;
        this.calcFitness = calcFitness();
        this.fitness = calcFitness(this.graph);
    }
}

module.exports = Offspring;