import Offspring from "./Offspring";
import InnovationNumber from "./InnovationNumber";
import NodeCountGlobal from "./NodeCountGlobal";
import Node from "./Node";
import Connection from "./Connection";
const Config = require("./Config");

class Mutator {

    constructor() {

    }

    //Add connection takes place in-place.
    addRandomConnection(offspring) {
        if (!offspring.graph.isFull()) {
            let availableConnections = offspring.graph.getAvailableConnections;
            let index = Math.floor(Math.random() * availableConnections.length);
            let connectionNodes = availableConnections[index];
            let connection = new Connection(
                connectionNodes.inNode, 
                connectionNodes.outNode,
                Config.add_connction_weight,
                InnovationNumber.get());
            offspring.graph.addConnection(connection);
        }
    }


    /**
     * Adds in-place a random node to the given offspring. 
     * To do this, disables the chosen connection, and then splits it into two connections.
     * From: in -> out 
     * To: in -> new node -> out.
     * The first new connection has a weight of 1, while the second connection has the old connection's weight.
     * @arg {Offspring} offspring - The offspring to update
     */
    addRandomNode(offspring) {
        let initialConnection = offspring.graph.getRandomConnection();
        let initialInNode = randomConnection.inNode;
        let initialOutNode = randomConnection.outNode;
        //If they are in sibling layers, you must create a new layer and push all
        //Of the layers after that forward one.
        if (initialOutNode.layer - initialInNode.layer == 1) {
            offspring.graph.createNewLayer(initialOutNode.layer);
        }
        let newNodeLayer = initialInNode.layer + 1;
        initialConnection.enabled = false;
        let newNode = new Node(NodeCountGlobal.get(),newNodeLayer);
        offspring.graph.addHiddenNode(newNode);
        let firstSplitConnection = new Connection(initialInNode, newNode, 
            Config.add_node_weight,
            InnovationNumber.get());
        offspring.graph.addConnection(firstSplitConnection);
        let secondSplitConnection = new Connection(newNode, initialOutNode,
            initialConnection.weight,
            InnovationNumber.get());
        offspring.graph.addConnection(secondSplitConnection);
    }


    perturbWeights(offspring) {
        offspring.graph.connections.forEach((connection) => {
            if (Math.random() <= Config.perturb_weight_chance) {
                perturb_direction = Math.random() > 0.5 ? 1 : -1;
                connection.weight += perturb_direction * Config.perturb_weight_amount;
            }
        })
    }


    mutateOffspring(offsprings) {
        offsprings.forEach((offspring) => {
            if (Math.random() <= Config.add_connection_chance) {
                this.addRandomConnection(offspring);
            }
            if (Math.random() <= Config.add_node_chance) {
                this.addRandomNode(offspring);
            }

        })
    }
}

module.exports = Mutator;