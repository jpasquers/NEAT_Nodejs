

class Graph {
    constructor() {
        this.allNodes = [];
        this.connections = [];
        this.inNodes = [];
        this.hiddenNodes = [];
        this.outNodes = [];
    }

    /**
     * Add an input node to the graph.
     * @arg {Node} node - The node to add
     */
    addInNode(node) {
        this.inNodes.push(node);
        this.allNodes.push(node);
    }
    
    /**
     * Add an output node to the graph
     * @arg {Node} node - The node to add
     */
    addOutNode(node) {
        this.outNodes.push(node);
        this.allNodes.push(node);
    }

    /**
     * add a node that is part of some hidden layer
     * @arg {Node} - the node to add.
     */
    addHiddenNode(node) {
        this.hiddenNodes.push(node);
        this.allNodes.push(node);
    }

    /**
     * Check if a nodelist contains a node, by comparing node IDs.
     * @arg {Node[]} nodelist - The nodelist to check
     * @arg {Node} checkNode - the node to check existance of in the nodelist.
     * @returns {Boolean} - Whether or not the nodelist contains the node.
     */
    nodeListContainsNode(nodelist,checkNode) {
        return nodelist.filter((node) => node.id == checkNode.id).length > 0;
    }

    /**
     * Finds all nodes in a layer greater than the layer of the current node.
     * These are nodes that are 'downstream' on the graph.
     * @arg {Node} inNode - The node from which to find downstream nodes
     * @returns {Node[]} - the downstream nodes.
     */
    getDownstreamNodes(inNode) {
        return this.allNodes.filter((node) => node.layer > inNode.layer);
    }

    /**
     * Find a node in the graph by id
     * @arg {Int} id - The id
     * @returns {Node} the node, or null if it doesn't exist.
     */
    getNode(id) {
        let match = this.allNodes.filter((node) => node.id == id);
        if (match.length == 1) return match[0];
        else return null;
    }

    /**
     * Finds all connections whose inNode is the given node.
     * @arg {Node} inNode - The node to find connections for.
     * @returns {Connection[]} - All connections coming from that node.
     */
    getOutboundConnections(inNode) {
        let outboundConnections = [];
        this.allNodes.forEach((node) => {
            if (this.connectionExists(inNode,node)) {
                outboundConnections.push(this.getConnectionByNodes(inNode,node));
            }
        })
        return outboundConnections;
    }

    /**
     * Finds all connections leading into a node
     * @arg {Node} outNode - The node to find connections for.
     * @returns {Connection[]} - All connections leading into that node.
     */
    getInboundConnections(outNode) {
        let inboundConnections = [];
        this.allNodes.forEach((node) => {
            if (this.connectionExists(node,outNode)) {
                inboundConnections.push(this.getConnectionByNodes(node,outNode));
            }
        })
        return inboundConnections;
    }

    /**
     * Runs an evaluation of the graph, propogating input values through.
     * Contributions to a node from multiple connections are additive.
     * Contributions are multiplied by the weight of the connection.
     * There is no current sigmoid/any other manipulation applied to the resulting sum.
     * @arg {Int[]} inputs - The inputs to the graph, must match in size to this.inNodes
     * @returns {Int[]} - The outputs of the graph, equal to the size of this.outNodes
     */
    getOutput(inputs) {
        if (inputs.length != this.inNodes.length) throw {
            name: "Invalid Input",
            message: "Input size doesn't match number of input nodes on graph"
        }

        //Will map node Id's to current value.
        let values = {};
        //list of innovationNumbers of connections that have been evaluated.
        let evaluated = [];
        inputs.forEach((input, index) => {
            //These should map normally, but just in case.
            values[this.inNodes[index].id] = input;
        })

        let currentNodeSet = this.inNodes;
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
                    evaluated.push(outBoundConnection.innovationNumber);

                    //if all connections with that as an output node have been evaluated,
                    //Then that node is ready to be evaluated as an input node.
                    let readyToEvalute = true;
                    this.getInboundConnections(outBoundNode).forEach((conn) => {
                        if (!evaluated.includes(conn.innovationNumber)) {
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
        return this.outNodes.map((outNode) => values[outNode.id]);
    }

    /**
     * Searches for a connection with matching in and out nodes
     * @arg {Node} inNode - The inNode of the connection
     * @arg {Node} outNode - The outNode of the connection
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
     * Searches for a connection from its innovation number
     * @arg {Int} innovNumber - The innovation number
     * @returns {Connection} - The matching connection, or null
     */
    getConnectionByInnovNumber(innovNumber) {
        let matches = this.connections.filter((connection) => {
            return connection.innovationNumber == innovNumber;
        });
        if (matches.length > 0) return matches[0];
        else return null;
    }

    /**
     * Evaluates whether a connection exists between two nodes
     * @arg {Node} inNode - The inNode of the connection
     * @arg {Node} outNode - The outNode of the connection
     * @returns {Boolean} - Whether or not the connection exists.
     */
    connectionExists(inNode,outNode) {
        return this.getConnectionByNodes(inNode,outNode).length > 0;
    }

    /**
     * Returns the highest layer of the graph. This will be the layer of the 
     * Output nodes.
     * @returns {Int} - The last layer
     */
    getMaxLayer() {
        return Math.max(this.allNodes.map((node) => node.layer));
    }

    /**
     * Creates a new layer in the graph. In order to do this,
     * Push all nodes at that layer or greater up one.
     * @arg {Int} layer - The layer to create
     */
    createNewLayer(layer) {
        this.allNodes.forEach((node) => {
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
        this.inNodes.forEach((node) => node.layer = 0);
        let currentNodeSet = this.inNodes;
        let nextNodeSet = [];
        let moreLayers = true;
        let currentLayer = 1;
        while (moreLayers) {
            currentNodeSet.forEach((node) => {
                let outBoundConnections = this.getOutboundConnections(node);
                outBoundConnections.forEach((outBoundConnection) => {
                    let outBoundNode = outBoundConnection.outNode;
                    outBoundNode.layer = currentLayer;
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
     * @returns {inNode: Node, outNode: Node} - the potential node pair.
     * 
     */
    getAvailableConnections() {
        let availableConnections = [];
        this.allNodes.forEach((inNode) => {
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
    addConnection(connection) {
        this.connections.push(connection);
        //Any non existant node will be a hidden node. In and out nodes are predefined.
        if (!this.nodeListContainsNode(this.allNodes,connection.inNode)) {
            this.addHiddenNode(connection.inNode);
        }
        if (!this.nodeListContainsNode(this.allNodes, connection.outNode)) {
            this.addHiddenNode(connection.outNode);
        }
    }


}

module.exports = Graph;