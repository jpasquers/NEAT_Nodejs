const Config = require("./Config");
const Util = require("./Util");

//Eventually this will be moved to a DB operation
let gen_number = -1;

class Generation {
    constructor(offspring,mutator,reproducer) {
        if (offspring) this.offspring = offspring;
        else this.offspring = [];
        this.gen_num = ++gen_number;
    }

    addOffspring(offspring) {
        this.offspring.append(offspring);
    }

    storeStatistics() {
        console.log("statistics for generation: " + this.gen_num);
        let fitnesses = this.offspring.map((offspring) => offspring.fitness);
        let max = fitnesses.reduce(function(a, b) {
            return Math.max(a, b);
        });
        let index = fitnesses.indexOf(max);
        console.log(this.offspring[index]);
    }
}

module.exports = Generation;