let id = -1;

module.exports = {
    get: () => {
        return ++id;
    }
}