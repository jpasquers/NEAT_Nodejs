import { Generation } from "../Generation";
import { Offspring } from "../Offspring";


export abstract class InPlaceMutator {
    mutateInPlace(generation:Generation) {
        generation.offsprings.forEach((offspring:Offspring) => {
            this.mutateOffspringInPlace(offspring);
        })
    }

    abstract mutateOffspringInPlace(offspring: Offspring);
}
