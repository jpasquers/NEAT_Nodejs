import Offspring from "./Offspring";
import Generation from "./Generation";

const Graph = require("./Graph");
const Node = require("./Node");
const InnovationNumber = require("./InnovationCountGlobal");
const NodeCount = require("./NodeCountGlobal");
const Connection = require("./Connection");
const Mutator = require("./Mutator");
const Reproducer = require("./Reproducer");

class NEAT {
    constructor(inSize, outSize, fitnessCalcFn) {
        this.inSize = inSize;
        this.outSize = outSize;
        this.mutator = new Mutator();
        this.reproducer = new Reproducer();
        setupExitHandlers();
    }

    setupExitHandlers() {
        //TODO
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

        offspring1 = new Offspring(offspring1_graph,fitnessCalcFn);
        offspring2 = new Offspring(offspring2_graph,fitnessCalcFn);

        gen_x = new Generation([offspring1, offspring2],this.mutator, this.reproducer);
        return gen_x;
    }

    randWeight() {
        return 1;
    }
}

export default NEAT;