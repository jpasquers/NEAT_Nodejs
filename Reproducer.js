let Offspring = require("./Offspring");
let Graph = require("./Graph");
let Util = require("./Util");
let Config = require("./Config");

class Reproducer {
    constructor(fitnessFn) {
        this.fitnessFn = fitnessFn;
    }

    produceChildren(offsprings) {
        let children = [];
        for (let i=0; i<Config.num_children; i++) {
            children.push(this.produceChild(offsprings));
        }
        return children;
    }


    produceChild(offsprings) {
        let parent1 = this.getFitnessSkewedParent(offsprings);
        let parent2 = this.getFitnessSkewedParent(offsprings);
        let childGraph = new Graph();
        //Child in and out nodes should never change.
        parent1.graph.inNodes.forEach((node) => childGraph.addInNode(node));
        parent1.graph.outNodes.forEach((node) => childGraph.addOutNode(node));
        let moreFitParent = parent1.fitness > parent2.fitness ? parent1 : parent2;
        let lessFitParent = parent1.fitness > parent2.fitness ? parent2 : parent1;
        moreFitParent.graph.connections.forEach((moreFitParentConn) => {
            let lessFitParentConn = lessFitParent.graph.getConnectionByInnovNumber(moreFitParentConn.innovationNumber);
            if (lessFitParentConn && lessFitParentConn != null) {
                //exists in both parents. Select random Connection to add to child.
                let newConnection = null;
                if (Math.random() > 0.5) newConnection = Util.deepCopyConnection(moreFitParentConn);
                else newConnection = Util.deepCopyConnection(lessFitParentConn);
                childGraph.addConnection(newConnection);
            }
            else {
                //Does not exist in the less fit parent, add it anyway from the more fit parent.
                let newConnection = Util.deepCopyConnection(moreFitParentConn);
                childGraph.addConnection(newConnection);
            }
        })
        return new Offspring(childGraph);
        
    }

    getFitnessSkewedParent(offsprings) {
        let sumFitness = 0;
        offsprings.forEach((offspring) => {sumFitness+= offspring.fitness});
        let normalizedFitnesses = offsprings.map((offspring) => offspring.fitness/sumFitness);
        let index = this.chooseIndexSkewValue(normalizedFitnesses);
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
        if (!Util.isSufficientlyClose(sum,1)) return null;
        let cumulativeValues = this.getCumulativeValues(values);
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