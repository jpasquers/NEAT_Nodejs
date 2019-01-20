import { Offspring } from "./Offspring";

export class Generation {
    offsprings: Offspring[];
    genNumber: number;

    constructor(offsprings: Offspring[], genNumber: number) {
        this.offsprings = offsprings;
        this.genNumber = genNumber;
    }

    /**
     * Adds a given offspring to the generation
     * @arg {Offspring} offspring - The offspring to add
     */
    addOffspring(offspring: Offspring) {
        this.offsprings.push(offspring);
    }

    /**
     * Calculates the average fitness for the generation
     * @returns {number} the average fitness of the offspring
     */
    avgFitness() {
        let fitnesses = this.offsprings.map((offspring => offspring.fitness));
        let sum = fitnesses.reduce((a,b) => a+b);
        if (sum) {
            return sum / this.offsprings.length;
        }
    }
}