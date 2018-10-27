let Graph = require("../Graph");
let Node = require("../Node");
let Connection =require("../Connection");

describe("graph ", () => {

    let graph;
    beforeEach(() => {
        graph = new Graph();
        let node1 = new Node(1,0);
        let node2 = new Node(2,1);
        let node3 = new Node(3,1);
        let node4 = new Node(4,2);

        graph.addInNode(node1);
        graph.addHiddenNode(node2);
        graph.addHiddenNode(node3);
        graph.addOutNode(node4);
        graph.addConnection(new Connection(node1,node2,1,1));
    })

    it("updates layers correctly", () => {
        graph.createNewLayer(1);
        expect(graph.getNode(2).layer).toEqual(2);
        expect(graph.getNode(4).layer).toEqual(3);
    })
})