/*
    ## Address 字典数据

    字典数据来源 http://www.atatech.org/articles/30028?rnd=254259856

    国标 省（市）级行政区划码表

    华北   北京市 天津市 河北省 山西省 内蒙古自治区
    东北   辽宁省 吉林省 黑龙江省
    华东   上海市 江苏省 浙江省 安徽省 福建省 江西省 山东省
    华南   广东省 广西壮族自治区 海南省
    华中   河南省 湖北省 湖南省
    西南   重庆市 四川省 贵州省 云南省 西藏自治区
    西北   陕西省 甘肃省 青海省 宁夏回族自治区 新疆维吾尔自治区
    港澳台 香港特别行政区 澳门特别行政区 台湾省    
*/

// DICT  = { id : Name }
// id 的表示方式是 110100
// 11 表示 省级, 01 表示 市, 00 表示 区
// 大致是上面这样分类的

import DICT from "./address_ch.json";

// id pid/parentId name children

// 将扁平数组转化为树状
function createTree(list) {
    const bugList = []; // 用于一次遍历后没有找到父级元素的元素
    const { result, mapped } = list.reduce(
        (all, item) => {
            let { mapped, result } = all;
            let { id, pid } = item;
            mapped[id] = item;
            /* jshint -W041 */
            // undefined 时是一个顶级元素
            if (pid === undefined) {
                result.push(item);
                return { mapped, result };
            }
            const parent = mapped[pid];
            if (!parent) {
                //父级尚未插入到mapped记录中
                bugList.push(item);
                return { mapped, result };
            }
            parent.children = [...(parent.children || []), item];
            return { mapped, result };
        },
        {
            mapped: {}, // 缓存已经记录过的数据
            result: [],
        }
    );
    bugList.forEach((item) => {
        const parent = mapped[item.pid];
        parent.children = [...(parent.children || []), item];
    });
    return result;
}
const ids = Object.keys(DICT);
function isInIds(what) {}
// 转化数组内对象的表现形式
const fixed = Object.entries(DICT).map(([id, value]) => {
    var pid = id.slice(2, 6) === "0000" ? undefined : id.slice(4, 6) == "00" ? id.slice(0, 2) + "0000" : id.slice(0, 4) + "00";
    if (!(pid in ids)) {
        // 修复 pid 并不存在，但是是归属于顶级的错误
        pid = id.slice(0, 2) + "0000";
    }
    return {
        id,
        pid,
        name: value,
    };
});

const DICT_FIXED = createTree(fixed);

export default DICT_FIXED;
