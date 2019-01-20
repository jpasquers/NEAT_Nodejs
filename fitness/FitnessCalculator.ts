import { Offspring } from "../Offspring";
import { Graph } from "../Graph";

export class FitnessCalculator {
    fitnessCalcFn:Function;

    constructor(fitnessCalcFn:Function) {
        this.fitnessCalcFn = fitnessCalcFn;
    }

    calcAndSetOffspringsFitness(offsprings:Offspring[]) {
        offsprings.forEach((offspring) => {
            this.calcAndSetOffspringFitness(offspring);
        })
    }

    calcAndSetOffspringFitness(offspring:Offspring) {
        offspring.fitness = this.calcGraphFitness(offspring.graph)
    }

    calcGraphFitness(graph) {
        return this.fitnessCalcFn(graph);
    }
}