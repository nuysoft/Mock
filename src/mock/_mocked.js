// 集中管理 mocked 的 url

const _mocked = {
    $set(value) {
        this[value.rurl + value.rtype.toLowerCase()] = value;
    },
    $delete(key) {
        delete this[key];
    },
};
export { _mocked };
