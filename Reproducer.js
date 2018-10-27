class Reproducer {
    constructor() {

    }

    produceChild(offsprings) {

    }

    getFitnessSkewedParent(offsprings) {
        let sumFitness = 0;
        offsprings.forEach((offspring) => {sumFitness+= offspring.fitness});
        let normalizedFitnesses = offsprings.map((offspring) => offspring.fitness/sumFitness);
        let index = chooseIndexSkewValue(normalizedFitness);
        return offsprings[index];
    }

    /**
     * Chooses a weighted random index from an array whose values sum to 1.
     * The value of a particular index equals the probability that that index is selected.
     * E.g. if [0.1, 0.4, 0.3, 0.2] => There is a 0.1 chance index 0 is select,
     * A 0.4 chance index 1 is selected, etc.
     * @arg {Float[]} values - The weight values to random from
     */
    chooseIndexSkewValue(values) {
        let add = (a,b) => {return a+b};
        let sum = values.reduce(add,0);
        if (!isSufficientlyClose(sum,1)) return null;
        let cumulativeValues = getCumulativeValues();
        let rand = Math.random();
        for (let i=0; i<cumulativeValues.length; i++) {
            if (cumulativeValues[i] > rand) return i;
        }
    }

    /**
     * Produces an array where every value is the cumulative sum of all previous values.
     * For example, if values = [0.1,0.5,0.2,0.2], this will return [0.1,0.6,0.8,1];
     * @arg {Float[]} values - The array to produce cumulative values from
     */
    getCumulativeValues(values) {
        let cumulativeValues = [];
        for (let i=0; i<values.length; i++) {
            if (i==0) cumulativeValues.push(values[0]);
            else cumulativeValues.push(cumulativeValues[i-1] +  values[i]);
        }
        return cumulativeValues;
    }

}

module.exports = Reproducer;