import { DataStoreAdapter} from "./DataStoreAdapter";
import {Generation} from "../Generation";


export class InMemoryDataStore implements DataStoreAdapter {
    generations: Generation[];

    constructor() {
        this.generations = [];
    }

    getCurrentGeneration() {
        if (this.generations.length == 0) return null;
        return this.generations[this.generations.length-1];
    }

    storeGeneration(generation:Generation) {
        this.generations.push(generation);
    }

    hasStartedRunning() {
        return this.generations.length == 0;
    }
}