let Graph = require("../Graph");
let Node = require("../Node");
let Connection =require("../Connection");

describe("graph ", () => {

    let graph,node1,node2,node3,node4 = null;
    beforeEach(() => {
        graph = new Graph();
        node1 = new Node(1,0);
        node2 = new Node(2,1);
        node3 = new Node(3,1);
        node4 = new Node(4,2);

        graph.addInNode(node1);
        graph.addHiddenNode(node2);
        graph.addHiddenNode(node3);
        graph.addOutNode(node4);
    })

    it("updates layers correctly", () => {
        graph.createNewLayer(1);
        expect(graph.getNode(2).layer).toEqual(2);
        expect(graph.getNode(4).layer).toEqual(3);
    })

    it("getOutboundConnections", () => {
        graph.addConnection(new Connection(node1,node2,1,1));
        graph.addConnection(new Connection(node2,node4,1,2));
        graph.addConnection(new Connection(node2,node3,1,3));
        graph.addConnection(new Connection(node3,node4,1,4));
        let outboundConnections = graph.getOutboundConnections(node2);
        let outboundNodes = outboundConnections.map((conn) => conn.outNode);
        expect(outboundConnections.length).toBe(2);
        expect(graph.nodeListContainsNode(outboundNodes, node3)).toBeTruthy();
        expect(graph.nodeListContainsNode(outboundNodes,node4)).toBeTruthy();
    })

    it("redefineLayers ", () => {
        graph.addConnection(new Connection(node1,node2,1,1));
        graph.addConnection(new Connection(node2,node4,1,2));
        graph.addConnection(new Connection(node2,node3,1,3));
        graph.addConnection(new Connection(node3,node4,1,4));
        graph.addConnection(new Connection(node1,node4,1,5));
        graph.redefineLayers();
        expect(node1.layer).toBe(0);
        expect(node2.layer).toBe(1);
        expect(node3.layer).toBe(2);
        expect(node4.layer).toBe(3);
    })


    //TODO I should add more test cases more likely to expose edge cases.
    it("simple getOutput case ", () => {
        graph.addConnection(new Connection(node1,node2,1,1));
        graph.addConnection(new Connection(node2,node4,2,2));
        graph.addConnection(new Connection(node2,node3,3,3));
        graph.addConnection(new Connection(node3,node4,5,4));
        //node2 value will be 1. Node3 value will be 3. 
        //node4 will be 2 + 15 = 17.
        expect(graph.getOutput([1])[0]).toBe(17);
    })
})