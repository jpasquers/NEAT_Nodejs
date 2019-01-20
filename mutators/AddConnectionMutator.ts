import { InPlaceMutator } from "./InPlaceMutator";
import { Offspring } from "../Offspring";
import { Connection } from "../Connection";
import { Config } from "../Config";
import { GeneCounter } from "../GeneCounter";

export class AddConnectionMutator extends InPlaceMutator {

    shouldMutate(offspring) {
        return Math.random() <= Config.add_connection_chance
    }

    mutateOffspringInPlace(offspring:Offspring) {
        if (!this.shouldMutate(offspring)) return;

        let graph = offspring.graph;
        if (!graph.isFull()) {
            let availableConnections = graph.getAvailableConnections();
            if (availableConnections.length == 0) return;
            let index = Math.floor(Math.random() * availableConnections.length);
            let connectionNodes = availableConnections[index];
            let connection = new Connection(
                connectionNodes.inNode, 
                connectionNodes.outNode,
                Config.add_connction_weight,
                GeneCounter.get());
            offspring.graph.addConnection(connection);
        }
    }
}