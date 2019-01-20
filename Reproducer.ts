import { Offspring } from "./Offspring";
import { Graph } from "./Graph";
import { Config } from "./Config";
import {isSufficientlyClose} from "./Util";
import { Connection } from "./Connection";
import { GeneCounter } from "./GeneCounter";


export class Reproducer {
    produceChildren(offsprings) {
        let children = [];
        for (let i=0; i<Config.num_children; i++) {
            children.push(this.produceChild(offsprings));
        }
        return children;
    }

    addNodesInPlace(moreFitParent:Offspring, lessFitParent:Offspring, childGraph:Graph) {
        moreFitParent.graph.nodes.forEach((node) => {
            childGraph.addNode(node.deepCopy());
        })
        //Are we supposed to add nodes from the less fit parent.
        /* lessFitParent.graph.nodes.forEach((node) => {
            if (!childGraph.hasNode(node.id)) {
                childGraph.addNode(node.deepCopy());
            }
        }) */
    }

    addConnectionsInPlace(moreFitParent:Offspring,lessFitParent:Offspring, childGraph:Graph) {
        moreFitParent.graph.connections.forEach((moreFitParentConn) => {
            let lessFitParentConn = lessFitParent.graph.getConnectionById(moreFitParentConn.id);
            let newWeight = moreFitParentConn.weight;
            if (lessFitParentConn && lessFitParentConn != null) {
                //exists in both parents. Randomly choose which weight to use.
                let newWeight = Math.random() > 0.5 ? moreFitParentConn.weight : lessFitParentConn.weight;
            }
            //The node ids will be the same on the more and less fit parent, just use more fit parent.
            //We want the node objects to be the new node objects on the child graph.
            let newInNode = childGraph.getNode(moreFitParentConn.inNode.id);
            let newOutNode = childGraph.getNode(moreFitParentConn.outNode.id);
            if (!childGraph.connectionExists(newInNode,newOutNode)) {
                let newConnection = new Connection(newInNode,newOutNode,newWeight,GeneCounter.get());
                childGraph.addConnection(newConnection);
            }
        }); 
    }


    produceChild(offsprings:Offspring[]) {
        let parent1 = this.getFitnessSkewedParent(offsprings);
        let parent2 = this.getFitnessSkewedParent(offsprings);
        let childGraph = new Graph();
        let moreFitParent = parent1.fitness > parent2.fitness ? parent1 : parent2;
        let lessFitParent = parent1.fitness > parent2.fitness ? parent2 : parent1;
        //Child in and out nodes should never change.
        this.addNodesInPlace(moreFitParent,lessFitParent,childGraph);
        this.addConnectionsInPlace(moreFitParent,lessFitParent, childGraph);
        
        return new Offspring(childGraph, null);
        
    }

    getFitnessSkewedParent(offsprings:Offspring[]) {
        let sumFitness = 0;
        offsprings.forEach((offspring) => {sumFitness+= offspring.fitness});
        let normalizedFitnesses = offsprings.map((offspring) => offspring.fitness/sumFitness);
        let index = this.chooseIndexSkewValue(normalizedFitnesses);
        return offsprings[index];
    }

    /**
     * Chooses a weighted random index from an array whose values sum to 1.
     * The value of a particular index equals the probability that that index is selected.
     * E.g. if [0.1, 0.4, 0.3, 0.2] => There is a 0.1 chance index 0 is select,
     * A 0.4 chance index 1 is selected, etc.
     * @arg {Float[]} values - The weight values to random from
     */
    chooseIndexSkewValue(values:number[]) {
        let add = (a,b) => {return a+b};
        let sum = values.reduce(add,0);
        if (!isSufficientlyClose(sum,1)) return null;
        let cumulativeValues = this.getCumulativeValues(values);
        let rand = Math.random();
        for (let i=0; i<cumulativeValues.length; i++) {
            if (cumulativeValues[i] > rand) return i;
        }
    }

    /**
     * Produces an array where every value is the cumulative sum of all previous values.
     * For example, if values = [0.1,0.5,0.2,0.2], this will return [0.1,0.6,0.8,1];
     * @arg {Float[]} values - The array to produce cumulative values from
     */
    getCumulativeValues(values:number[]) {
        let cumulativeValues = [];
        for (let i=0; i<values.length; i++) {
            if (i==0) cumulativeValues.push(values[0]);
            else cumulativeValues.push(cumulativeValues[i-1] +  values[i]);
        }
        return cumulativeValues;
    }

}