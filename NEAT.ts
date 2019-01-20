import { InPlaceMutator } from "./mutators/InPlaceMutator";
import { AddConnectionMutator } from "./mutators/AddConnectionMutator";
import { WeightMutator } from "./mutators/WeightMutator";

import { AddNodeMutator } from "./mutators/AddNodeMutator";

import { Reproducer } from "./Reproducer";
import { FitnessCalculator } from "./fitness/FitnessCalculator";
import { DataStoreAdapter } from "./datastore/DataStoreAdapter";
import { EvolutionManager } from "./EvolutionManager";
import { InMemoryDataStore } from "./datastore/InMemoryDataStore";
import { Offspring } from "./Offspring";
import { Graph } from "./Graph";
import { NEATInNode } from "./nodes/InNode";
import { GeneCounter } from "./GeneCounter";
import { NEATOutNode } from "./nodes/OutNode";
import { Connection } from "./Connection";
import { Generation } from "./Generation";
import { Config } from "./Config";

export class NEAT {
    mutators: InPlaceMutator[];
    reproducer: Reproducer;
    fitnessCalculator: FitnessCalculator;
    inSize: number;
    outSize: number;
    dataStore: DataStoreAdapter;
    evolutionManager: EvolutionManager;

    constructor(inSize, outSize, fitnessCalcFn) {
        this.fitnessCalculator = new FitnessCalculator(fitnessCalcFn);
        let addConnMutator = new AddConnectionMutator();
        let addNodeMutator = new AddNodeMutator();
        let weightMutator = new WeightMutator();
        this.mutators = [weightMutator, addConnMutator, addNodeMutator];
        this.reproducer = new Reproducer();
        this.dataStore = new InMemoryDataStore();
        this.inSize = inSize;
        this.outSize = outSize;
        this.addFirstGeneration();
        this.evolutionManager = new EvolutionManager(this.dataStore,
                                                    this.mutators,
                                                    this.reproducer,
                                                    this.fitnessCalculator)
    }

    addFirstGeneration() {
        let firstGenOffsprings = [];
        for (let i=0; i<Config.num_children; i++) {
            firstGenOffsprings.push(this.createFirstGenOffspring());
        }
        let firstGeneration = new Generation(firstGenOffsprings, 0);
        this.fitnessCalculator.calcAndSetOffspringsFitness(firstGeneration.offsprings);
        this.dataStore.storeGeneration(firstGeneration);
    }

    createFirstGenOffspring() {
        //For first generation, the id's should be set manually so they are correct.
        //Past the first generation these should be handled automatically.
        let firstGenGraph = new Graph();
        for (let i=0; i<this.inSize; i++) {
            let inNode = new NEATInNode(i, 0);
            firstGenGraph.addNode(inNode);
        }
        for (let i=0; i<this.inSize; i++) {
            let outNode = new NEATOutNode(i+this.inSize, 1);
            firstGenGraph.addNode(outNode);
        }
        firstGenGraph.getInNodes().forEach((inNode,i) => {
            firstGenGraph.getOutNodes().forEach((outNode,j) => {
                let conn = new Connection(inNode, 
                                          outNode, 
                                          this.getRandomStartingWeight(), 
                                          i+j+this.inSize+this.outSize);
                firstGenGraph.addConnection(conn);
            })
        })
        let firstGenOffspring = new Offspring(firstGenGraph,null);
        return firstGenOffspring;
    }

    getRandomStartingWeight() {
        return Math.random();
    }

    execute() {
        for (let i=0; i<Config.num_generations; i++) {
            this.evolutionManager.run();
            console.log(this.dataStore.getCurrentGeneration().avgFitness());
        }
    }

}

