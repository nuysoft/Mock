// 集中管理 mocked 的 url
const mapper = new Map();
const _mocked = Object.assign([], {
    $genKey(val) {
        return JSON.stringify(val);
    },
    $set(value) {
        const key = this.$genKey({ url: value.rurl, type: value.rtype });
        mapper.set(key, value);
        this.push(value);
    },
    $delete(key) {
        mapper.delete(key);
    },
});
export { _mocked };
