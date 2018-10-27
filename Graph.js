

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

    getDownstreamNodes(inNode) {
        return this.allNodes.filter((node) => node.layer > inNode.layer);
    }

    getNode(id) {
        let match = this.allNodes.filter((node) => node.id == id);
        if (match.length == 1) return match[0];
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
     * get random connection between any two
     * @returns {Connection} - the connection.
     */
    getRandomConnection() {
        return this.connections[Math.floor(Math.random()*this.connections.length)];
    }

    getAvailableConnections() {
        let availableConnections = [];
        this.allNodes.forEach((inNode) => {
            let downStreamNodes = this.getDownstreamNodes(node);
            downStreamNodes.forEach((outNode) => {
                if (!this.connectionExists(inNode,outNode)) {
                    availableConnections.append({
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
    }


}

module.exports = Graph;