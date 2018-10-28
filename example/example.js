const NEAT = require("../NEAT");

let neat = new NEAT(5,5, (graph) => {
    return graph.connections.length;
})

neat.run();