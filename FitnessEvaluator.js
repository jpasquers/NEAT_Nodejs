class FitnessEvaluator {
    constructor(fitnessFn) {
        this.fitnessFn = fitnessFn;
    }

    assignFitnessValues(offsprings) {
        offsprings.forEach((offspring) => {
            offspring.fitness = this.fitnessFn(offspring.graph);
        })
    }
}

module.exports = FitnessEvaluator;