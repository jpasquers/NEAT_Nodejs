
/**
 * Genes come in two forms, Node genes and connection genes.
 */
export class GeneCounter {
    static id: number = 0;

    static get() {
        return GeneCounter.id++;
    }
}