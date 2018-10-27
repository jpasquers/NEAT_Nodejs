const Config = require("./Config");
const Util = require("./Util");

//will be -1 if this is the first generation
let gen_number = Util.gen_number()

class Generation {
    constructor(offspring,mutator,reproducer) {
        if (offspring) this.offspring = offspring;
        else this.offspring = [];

        this.gen_num = ++gen_number;
        this.mutator = mutator;
        this.reproducer = reproducer;
    }

    addOffspring(offspring) {
        this.offspring.append(offspring);
    }


    produceChildren() {
        storeOriginalOffspring();
        this.mutator.mutateOffspring(this.offspring);
        let children = [];
        for (let i=0; i<Config.num_children; i++) {
            children.append(this.reproducer.produceChild(this.offspring));
        }
        return children;

    }
}

module.exports = Generation;