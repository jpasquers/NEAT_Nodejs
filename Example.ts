import { NEAT } from "./NEAT";
import { Graph } from "./Graph";

let neat = new NEAT(4,5, (graph:Graph) => {
    let sum = graph.getOutput([1,0.6,0.4,0.2]).reduce((a,b) => {
        return a+b
    });
    return sum;
});

neat.execute();