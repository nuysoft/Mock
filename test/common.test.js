const Mock = require('mockjs-esm');

const a = Mock.mock({
    'a|20': ['@cname'],
});
console.log(a);
