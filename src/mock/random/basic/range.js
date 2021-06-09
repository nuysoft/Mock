const range = function (...args) {
    // range( stop )
    let start, stop, step;
    if (arguments.length <= 1) {
        [stop] = args;
        return [...Array(stop).keys()];
    }

    // range( start, stop ,step=1)
    // range(10,20,3) = [10,13,16,19]
    [start, stop, step = 1] = args;
    let arrayLength = Math.ceil((stop - start) / step);
    return [...Array(arrayLength).keys()].map((index) => {
        return start + index * step;
    });
};
export { range };
