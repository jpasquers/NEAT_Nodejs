import { DataStoreAdapter } from "./datastore/DataStoreAdapter";
import { Generation } from "./Generation";
import { InPlaceMutator } from "./mutators/InPlaceMutator";
import { Reproducer } from "./Reproducer";
import { FitnessCalculator } from "./fitness/FitnessCalculator";


/** 
 * Singleton class responsible for managing evolution
*/
export class EvolutionManager {
    dataStore: DataStoreAdapter;
    currentGen: Generation;
    mutators: InPlaceMutator[];
    reproducer:Reproducer;
    fitnessCalculator: FitnessCalculator;

    constructor(dataStore: DataStoreAdapter, mutators:InPlaceMutator[], 
        reproducer:Reproducer, fitnessCalculator:FitnessCalculator) {
        this.dataStore = dataStore;
        this.mutators = mutators;
        this.reproducer = reproducer;
        this.fitnessCalculator = fitnessCalculator;
    }

    run() {
        this.currentGen = this.dataStore.getCurrentGeneration();
        let nextGenOffsprings = this.reproducer.produceChildren(this.currentGen.offsprings);
        let nextGen = new Generation(nextGenOffsprings, this.currentGen.genNumber+1);
        this.mutators.forEach((mutator) => {
            mutator.mutateInPlace(nextGen);
        })
        this.fitnessCalculator.calcAndSetOffspringsFitness(nextGen.offsprings);
        this.currentGen = nextGen;
        this.dataStore.storeGeneration(this.currentGen);
    }
 }