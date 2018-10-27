
class Connection {
    constructor(inNode, outNode,weight, innovationNumber) {
        this.inNode = inNode;
        this.outNode = outNode;
        this.weight = weight;
        this.enabled = true;
        this.innovationNumber = innovationNumber;
    }

    equals(connection) {
        return this.inNode == connection.inNode
    }
}

module.exports = Connection;