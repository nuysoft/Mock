/*
    ## Mock.Random

    工具类，用于生成各种随机数据。
*/

const Random: Record<string, any> = {};
export default Random;
export const registerRandom = (name: string, fn: any) => {
    Random[name] = fn;
};
