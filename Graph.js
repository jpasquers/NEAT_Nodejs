

class Graph {
    constructor() {
        this.allNodes = [];
        this.connections = [];
        this.inNodes = [];
        this.hiddenNodes = [];
        this.outNodes = [];
    }

    addInNode(node) {
        this.inNodes.push(node);
        this.allNodes.push(node);
    }
    
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

    nodeListContainsNode(nodelist,checkNode) {
        return nodelist.filter((node) => node.id == checkNode.id).length > 0;
    }

    getDownstreamNodes(inNode) {
        return this.allNodes.filter((node) => node.layer > inNode.layer);
    }

    getNode(id) {
        let match = this.allNodes.filter((node) => node.id == id);
        if (match.length == 1) return match[0];
        else return null;
    }

    getOutboundConnections(inNode) {
        let outboundConnections = [];
        this.allNodes.forEach((node) => {
            if (this.connectionExists(inNode,node)) {
                outboundConnections.push(this.getConnectionByNodes(inNode,node));
            }
        })
        return outboundConnections;
    }

    getInboundConnections(outNode) {
        let inboundConnections = [];
        this.allNodes.forEach((node) => {
            if (this.connectionExists(node,outNode)) {
                inboundConnections.push(this.getConnectionByNodes(node,outNode));
            }
        })
        return inboundConnections;
    }

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

        //TODODODODODODODO
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

    getConnectionByNodes(inNode,outNode) {
        let matches = this.connections.filter((connection) => {
            return connection.inNode.id == inNode.id && connection.outNode.id == outNode.id
        });
        if (matches.length > 0) return matches[0];
        else return null;
    }

    getConnectionByInnovNumber(innovNumber) {
        let matches = this.connections.filter((connection) => {
            return connection.innovationNumber == innovNumber;
        });
        if (matches.length > 0) return matches[0];
        else return null;
    }

    //Does a comparison of the node ids to equate connections.
    connectionExists(inNode,outNode) {
        let connExists = false;
        this.connections.forEach((connection) => {
            if (connection.inNode.id == inNode.id &&
                connection.outNode.id == outNode.id) connExists = true;
        });
        return connExists;
    }

    getMaxLayer() {
        return Math.max(this.allNodes.map((node) => node.layer));
    }

    createNewLayer(layer) {
        this.allNodes.forEach((node) => {
            if (node.layer >= layer) {
                node.layer += 1;
            }
        })
    }

    /**
     * Recalculates the layers for all nodes in the current graph.
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

    isFull() {
        return this.getAvailableConnections().length > 0;
    }

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