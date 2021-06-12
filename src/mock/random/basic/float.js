import { random } from "lodash-es";
const float = function (min, max, dmin, dmax) {
    let dcount = random(dmin, dmax, false);

    return random(min, max, dcount);
};
export { float };
