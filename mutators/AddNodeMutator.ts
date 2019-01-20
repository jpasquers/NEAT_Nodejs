import { InPlaceMutator } from "./InPlaceMutator";
import { Offspring } from "../Offspring";
import { Connection } from "../Connection";
import { Config } from "../Config";
import { NEATHiddenNode } from "../nodes/HiddenNode";
import { GeneCounter } from "../GeneCounter";

export class AddNodeMutator extends InPlaceMutator {

    shouldMutate(offspring) {
        return Math.random() <= Config.add_connection_chance
    }

    /**
     * Adds in-place a random node to the given offspring. 
     * To do this, disables the chosen connection, and then splits it into two connections.
     * From: in -> out 
     * To: in -> new node -> out.
     * The first new connection has a weight of 1, while the second connection has the old connection's weight.
     * @arg {Offspring} offspring - The offspring to update
     */
    mutateOffspringInPlace(offspring:Offspring) {
        if (!this.shouldMutate(offspring)) return;
        let initialConnection = offspring.graph.getRandomConnection();
        let initialInNode = initialConnection.inNode;
        let initialOutNode = initialConnection.outNode;
        //If they are in sibling layers, you must create a new layer and push all
        //Of the layers after that forward one.
        if (initialOutNode.layer - initialInNode.layer == 1) {
            offspring.graph.createNewLayer(initialOutNode.layer);
        }
        let newNodeLayer = initialInNode.layer + 1;
        initialConnection.enabled = false;
        let newNode = new NEATHiddenNode(GeneCounter.get(), newNodeLayer);
        offspring.graph.addNode(newNode);
        let firstSplitConnection = new Connection(initialInNode, newNode, 
            Config.add_node_weight,
            GeneCounter.get());
        offspring.graph.addConnection(firstSplitConnection);
        let secondSplitConnection = new Connection(newNode, initialOutNode,
            initialConnection.weight,
            GeneCounter.get());
        offspring.graph.addConnection(secondSplitConnection);
    }
}