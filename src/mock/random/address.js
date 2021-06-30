/*
    ## Address
*/
import DICT from './address_dict.js';
const REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北'];
import { pick } from './helper.js';
import { natural } from './basic/number.js';

// 随机生成一个大区。
function region() {
    return pick(REGION);
}
// 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
function province() {
    return pick(DICT).name;
}
// 随机生成一个（中国）市。
function city(prefix) {
    const province = pick(DICT);
    const city = pick(province.children);
    return prefix ? [province.name, city.name].join(' ') : city.name;
}
// 随机生成一个（中国）县。
function county(prefix) {
    const province = pick(DICT);
    const city = pick(province.children);
    const county = pick(city.children) || {
        name: '-',
    };
    return prefix ? [province.name, city.name, county.name].join(' ') : county.name;
}
// 随机生成一个邮政编码（六位数字）。
function zip(len) {
    let zip = '';
    for (let i = 0; i < (len || 6); i++) zip += natural(0, 9);
    return zip;
}

//  function address() {}
//  function phone() {}
//  function areacode() {}
//  function street() {}
//  function street_suffixes() {}
//  function street_suffix() {}
//  function states() {}
//  function state() {}

export { region, province, city, county, zip };
