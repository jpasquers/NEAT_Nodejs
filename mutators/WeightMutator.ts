import { InPlaceMutator } from "./InPlaceMutator";
import { Offspring } from "../Offspring";
import { Config } from "../Config";

export class WeightMutator extends InPlaceMutator {
    mutateOffspringInPlace(offspring:Offspring) {
        offspring.graph.connections.forEach((connection) => {
            if (Math.random() <= Config.perturb_weight_chance) {
                let perturb_direction:number = Math.random() > 0.5 ? 1 : -1;
                connection.weight += perturb_direction * Config.perturb_weight_amount;
            }
        })
    }
}