import { Generation } from "../Generation";

export interface DataStoreAdapter {
    getCurrentGeneration(): Generation;
    storeGeneration(generation:Generation);
    hasStartedRunning(): boolean;
}