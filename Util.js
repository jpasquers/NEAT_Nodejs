let Node = require("./Node");
let Connection = require("./Connection");

let gen_num = -1;

module.exports = {
    isSufficientlyClose: (value,expected) =>{
        let cutOff = 0.00001;
        return (Math.abs(expected - value) < cutOff);
    },

    deepCopyNode: (oldNode) => {
        return new Node(oldNode.id, oldNode.layer);
    },

    deepCopyConnection: (oldConnection) => {
        let newInNode = module.exports.deepCopyNode(oldConnection.inNode);
        let newOutNode = module.exports.deepCopyNode(oldConnection.outNode);
        return new Connection(newInNode,newOutNode, oldConnection.weight, oldConnection.innovationNumber);
    },

    storeGenerationStats(generation) {

    }
}