const Offspring = require("./Offspring");
const Generation = require("./Generation");
const Graph = require("./Graph");
const Node = require("./Node");
const InnovationNumber = require("./InnovationCountGlobal");
const NodeCount = require("./NodeCountGlobal");
const Connection = require("./Connection");
const Mutator = require("./Mutator");
const Reproducer = require("./Reproducer");
const Config = require("./Config");
const Util = require("./Util");
const FitnessEvaluator = require("./FitnessEvaluator");

class NEAT {
    constructor(inSize, outSize, fitnessCalcFn) {
        this.inSize = inSize;
        this.outSize = outSize;
        this.mutator = new Mutator();
        this.reproducer = new Reproducer();
        this.fitnessEvaluator = new FitnessEvaluator(fitnessCalcFn);
        this.setupExitHandlers();
    }

    setupExitHandlers() {
        //TODO
    }

    run() {
        let currentGen = this.createFirstGeneration();
        for (let i=0; i<Config.num_generations; i++) {
            this.mutator.mutateInPlace(currentGen.offspring);
            this.fitnessEvaluator.assignFitnessValues(currentGen.offspring);
            currentGen.storeStatistics();
            let children = this.reproducer.produceChildren(currentGen.offspring);        
            currentGen = new Generation(children);
        }
        return currentGen;
    }

    createFirstGeneration() {
        let offspring1_graph = new Graph();
        let offspring2_graph = new Graph();

        for (let i=0;i<this.inSize;i++) {
            let id = NodeCount.get();
            offspring1_graph.addInNode(new Node(id,0));
            offspring2_graph.addInNode(new Node(id,0));
        }
        for (let i=this.inSize; i<this.inSize+this.outSize; i++) {
            let id = NodeCount.get();
            offspring1_graph.addOutNode(new Node(i,1));
            offspring2_graph.addOutNode(new Node(i,1));
        }

        offspring1_graph.inNodes.forEach((inNode) => {
            offspring1_graph.outNodes.forEach((outNode) => {
                offspring1_graph.addConnection(new Connection(inNode, outNode, this.randWeight(), InnovationNumber.get()));
            })
        })

        offspring2_graph.inNodes.forEach((inNode) => {
            offspring2_graph.outNodes.forEach((outNode) => {
                offspring2_graph.addConnection(new Connection(inNode, outNode, this.randWeight(), InnovationNumber.get()));
            })
        })

        let offspring1 = new Offspring(offspring1_graph);
        let offspring2 = new Offspring(offspring2_graph);

        let gen_x = new Generation([offspring1, offspring2]);
        return gen_x;
    }

    randWeight() {
        return 1;
    }
}

module.exports = NEAT;