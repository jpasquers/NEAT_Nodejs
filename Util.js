module.exports = {
    isSufficientlyClose(value,expected) {
        let cutOff = 0.00001;
        return (Math.abs(expected - value) < cutOff);
    }
}