module.exports = (d) => {
    return d instanceof Date && !isNaN(d);
}