let Reproducer = require("../Reproducer");


describe("reproduer ", () => {
    let reproducer;
    beforeEach(() => {
        reproducer = new Reproducer();
    })

    it("cumulative values works properly", () => {
        let values = [0.1,0.5,0.2,0.2];
        let cumulativeValues = reproducer.getCumulativeValues(values);
        expect(cumulativeValues[0]).toBeCloseTo(0.1,0.00001);
        expect(cumulativeValues[1]).toBeCloseTo(0.6,0.00001);
        expect(cumulativeValues[2]).toBeCloseTo(0.8,0.00001);
        expect(cumulativeValues[3]).toBeCloseTo(1,0.00001);
    })
})