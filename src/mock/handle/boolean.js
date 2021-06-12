import { bool } from "../random/index.js";
export function boolean({ rule: { max, min, parameters }, template = "" }) {
    // 'prop|multiple': false, 当前值是相反值的概率倍数
    // 'prop|probability-probability': false, 当前值与相反值的概率
    return parameters ? bool(min, max, template) : template;
}
