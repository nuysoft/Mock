// 集中管理 mocked 的 url
let mapper = [];
const _mocked = {
    $getAll() {
        return mapper;
    },
    $set(value) {
        value = { url: value.rurl, type: value.rtype, template: value.template };
        mapper.push(value);
    },
    $delete(key) {
        mapper.delete(key);
    },
    $clear() {
        mapper = [];
    },
};
export { _mocked };
