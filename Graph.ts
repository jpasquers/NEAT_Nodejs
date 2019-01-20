import { NEATNode } from "./nodes/Node";
import { Connection } from "./Connection";
import { NEATInNode } from "./nodes/InNode";
import { NEATOutNode } from "./nodes/OutNode";
import { NEATHiddenNode } from "./nodes/HiddenNode";
/**
 * Core class for a directed graph used in Neuro Evolution
 * Makes no assumptions about the shape of the graph.
 * Allows for layers of varying size, and for Connections that skip layers.
 * For example, node1->node2->node3 and node1->node3 are both viable connections
 * In the same graph.
 */
export class Graph {
    nodes: NEATNode[];
    connections: Connection[];
    constructor() {
        this.nodes = [];
        this.connections = [];
    }

    /**
     * Add a node to the graph.
     * @arg {NEATNode} node - The node to add
     */
    addNode(node: NEATNode) {
        this.nodes.push(node);
    }

    /**
     * Grabs all nodes qualifying as 'input nodes'
     * @returns {NEATInNode[]} - list of input nodes.
     */
    getInNodes() {
        return this.nodes.filter((node:NEATNode) => {
            return node instanceof NEATInNode;
        })
    }

    /**
     * Grabs all nodes qualifying as 'output nodes'
     * @returns {NEATOutNode[]} - list of output nodes.
     */
    getOutNodes() {
        return this.nodes.filter((node:NEATNode) => {
            return node instanceof NEATOutNode;
        })
    }

    /**
     * Grabs all nodes qualifying as 'hidden nodes'
     * @returns {NEATHiddenNode[]} - list of hidden nodes.
     */
    getHiddenNodes() {
        return this.nodes.filter((node:NEATNode) => {
            return node instanceof NEATHiddenNode;
        });
    }

    hasNode(id:number) {
        return this.nodes.filter((node:NEATNode) => {
            return node.id == id;
        }).length > 0;
    }

    /**
     * Check if a nodelist contains a node, by comparing node IDs.
     * @arg {NEATNode[]} nodelist - The nodelist to check
     * @arg {NEATNode} checkNode - the node to check existance of in the nodelist.
     * @returns {Boolean} - Whether or not the nodelist contains the node.
     */
    nodeListContainsNode(nodelist:NEATNode[],checkNode:NEATNode) {
        return nodelist.filter((node) => node.id == checkNode.id).length > 0;
    }

    /**
     * Finds all nodes in a layer greater than the layer of the current node.
     * These are nodes that are 'downstream' on the graph.
     * @arg {NEATNode} inNode - The node from which to find downstream nodes
     * @returns {NEATNode[]} - the downstream nodes.
     */
    getDownstreamNodes(inNode:NEATNode) {
        return this.nodes.filter((node) => node.layer > inNode.layer);
    }

    /**
     * Find a node in the graph by id
     * @arg {Number} id - The id
     * @returns {NEATNode} the node, or null if it doesn't exist.
     */
    getNode(id: Number) {
        let match = this.nodes.filter((node) => node.id == id);
        if (match.length == 1) return match[0];
        else return null;
    }

    /**
     * Finds all connections whose inNode is the given node.
     * @arg {NEATNode} fromNode - The node to find connections for.
     * @returns {Connection[]} - All connections coming from that node.
     */
    getOutboundConnections(fromNode:NEATNode) {
        let outboundConnections = [];
        this.nodes.forEach((node) => {
            if (this.connectionExists(fromNode,node)) {
                outboundConnections.push(this.getConnectionByNodes(fromNode,node));
            }
        })
        return outboundConnections;
    }

    /**
     * Finds all connections leading into a node
     * @arg {Node} toNode - The node to find connections for.
     * @returns {Connection[]} - All connections leading into that node.
     */
    getInboundConnections(toNode:NEATNode) {
        let inboundConnections = [];
        this.nodes.forEach((node) => {
            if (this.connectionExists(node,toNode)) {
                inboundConnections.push(this.getConnectionByNodes(node,toNode));
            }
        })
        return inboundConnections;
    }

    /**
     * Runs an evaluation of the graph, propogating input values through.
     * Contributions to a node from multiple connections are additive.
     * Contributions are multiplied by the weight of the connection.
     * There is no current sigmoid/any other manipulation applied to the resulting sum.
     * @arg {number[]} inputs - The inputs to the graph, must match in size to this.inNodes
     * @returns {number[]} - The outputs of the graph, equal to the size of the output nodes.
     */
    getOutput(inputs:number[]) {
        let inputNodes = this.getInNodes();
        if (inputs.length != inputNodes.length) throw {
            name: "Invalid Input",
            message: "Input size doesn't match number of input nodes on graph"
        }

        //Will map node Id's to current value.
        let values = {};
        //list of ids of connections that have been evaluated.
        let evaluated = [];
        inputs.forEach((input, index) => {
            //These should map normally, but just in case.
            values[inputNodes[index].id] = input;
        })

        let currentNodeSet = inputNodes;
        let nextNodeSet = [];
        let stillPropogating = true;
        while (stillPropogating) {
            currentNodeSet.forEach((inNode) => {
                let outBoundConnections = this.getOutboundConnections(inNode);
                outBoundConnections.forEach((outBoundConnection) => {
                    let outBoundNode = outBoundConnection.outNode;

                    //do weight addition
                    if (outBoundNode.id in values) {
                        values[outBoundNode.id] += outBoundConnection.weight * values[inNode.id];
                    }
                    else values[outBoundNode.id] = outBoundConnection.weight * values[inNode.id];

                    //mark connection as evaluated.
                    evaluated.push(outBoundConnection.id);

                    //if all connections with that as an output node have been evaluated,
                    //Then that node is ready to be evaluated as an input node.
                    let readyToEvalute = true;
                    this.getInboundConnections(outBoundNode).forEach((conn) => {

                        if (!(evaluated.filter(a => a == conn.id).length > 0)) {
                            readyToEvalute = false;
                        }
                    })
                    if (readyToEvalute) {
                        nextNodeSet.push(outBoundNode);
                    }
                    
                })
            })
            //We have reached the end of the graph.
            if (nextNodeSet.length == 0) stillPropogating = false;
            else {
                currentNodeSet = nextNodeSet;
                nextNodeSet = [];
            }

        }
        return this.getOutNodes().map((outNode) => values[outNode.id]);
    }

    /**
     * Searches for a connection with matching in and out nodes
     * @arg {NEATNode} inNode - The inNode of the connection
     * @arg {NEATNode} outNode - The outNode of the connection
     * @returns {Connection} - The matching connection, or null
     */
    getConnectionByNodes(inNode,outNode) {
        let matches = this.connections.filter((connection) => {
            return connection.inNode.id == inNode.id && connection.outNode.id == outNode.id
        });
        if (matches.length > 0) return matches[0];
        else return null;
    }

    /**
     * Searches for a connection from its gene counter
     * @arg {Int} id - The id/gene counter
     * @returns {Connection} - The matching connection, or null
     */
    getConnectionById(id) {
        let matches = this.connections.filter((connection) => {
            return connection.id == id;
        });
        if (matches.length > 0) return matches[0];
        else return null;
    }

    /**
     * Evaluates whether a connection exists between two nodes
     * @arg {NEATNode} inNode - The inNode of the connection
     * @arg {NEATNode} outNode - The outNode of the connection
     * @returns {Boolean} - Whether or not the connection exists.
     */
    connectionExists(inNode,outNode) {
        return this.getConnectionByNodes(inNode,outNode) != null;
    }

    /**
     * Returns the highest layer of the graph. This will be the layer of the 
     * Output nodes.
     * @returns {Int} - The last layer
     */
    getMaxLayer() {
        return Math.max(...this.nodes.map((node) => node.layer));
    }

    /**
     * Creates a new layer in the graph. In order to do this,
     * Push all nodes at that layer or greater up one.
     * @arg {Int} layer - The layer to create
     */
    createNewLayer(layer) {
        this.nodes.forEach((node) => {
            if (node.layer >= layer) {
                node.layer += 1;
            }
        })
    }

    /**
     * Redefines the layers for a given graph. 
     * Does this by propagating through connections and progressively assigning layers.
     * If a node could be in multiple layers (E.g. node1->node2->node3, node1->node3, which layer is node3?),
     * The higher layer is assigned to the node, as this corresponds which how the graph would be visualized.
     */
    redefineLayers() {
        let inNodes = this.getInNodes();
        inNodes.forEach((node) => node.layer = 0);
        let currentNodeSet = inNodes;
        let nextNodeSet = [];
        let moreLayers = true;
        let currentLayer = 1;
        while (moreLayers) {
            currentNodeSet.forEach((node) => {
                let outBoundConnections = this.getOutboundConnections(node);
                outBoundConnections.forEach((outBoundConnection) => {
                    let outBoundNode = outBoundConnection.outNode;
                    outBoundNode.layer = currentLayer;
                    //if the node isn't already going to be handled, handle it
                    if (nextNodeSet.filter((node) => outBoundNode.id == node.id).length == 0) {
                        nextNodeSet.push(outBoundNode);
                    }
                })
            })
            //We have reached the end of the graph.
            if (nextNodeSet.length == 0) moreLayers = false;
            else {
                currentNodeSet = nextNodeSet;
                nextNodeSet = [];
            }

            currentLayer++;
        }
    }



    /**
     * get random connection between any two nodes
     * @returns {Connection} - the connection.
     */
    getRandomConnection() {
        return this.connections[Math.floor(Math.random()*this.connections.length)];
    }

    /**
     * Find all pairs of (node,downStreamNode) that don't have a connection
     * @returns [{inNode: NEATNode, outNode: NEATNode}] - the potential node pairs.
     * 
     */
    getAvailableConnections() {
        let availableConnections = [];
        this.nodes.forEach((inNode) => {
            let downStreamNodes = this.getDownstreamNodes(inNode);
            downStreamNodes.forEach((outNode) => {
                if (!this.connectionExists(inNode,outNode)) {
                    availableConnections.push({
                        inNode: inNode,
                        outNode: outNode
                    })
                }
            })
        })
        return availableConnections;
    }

    /**
     * Checks if the map has any available connections
     * @returns {Boolean} - Whether any nodes have yet to be connected.
     */
    isFull() {
        return this.getAvailableConnections().length > 0;
    }

    /**
     * Add a connection to the graph. Will also add any nodes that are missing from the graph
     * And are involved in the connection.
     * @arg {Connection} connection - The connection to add.
     */
    addConnection(connection:Connection) {
        this.connections.push(connection);
        //Any non existant node will be a hidden node. In and out nodes are predefined.
        if (!this.nodeListContainsNode(this.nodes,connection.inNode)) {
            this.addNode(connection.inNode);
        }
        if (!this.nodeListContainsNode(this.nodes, connection.outNode)) {
            this.addNode(connection.outNode);
        }
    }


}

