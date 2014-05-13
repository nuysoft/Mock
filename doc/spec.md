## 语法规范

Mock.js 的语法规范包括两部分：

1. 数据模板定义（Data Temaplte Definition，DTD）
2. 数据占位符定义（Data Placeholder Definition，DPD）

### 数据模板定义 DTD

**数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：**
    
    // 属性名   name
    // 生成规则 rule
    // 属性值   value
    'name|rule': value

**注意：**

* 属性名 和 生成规则 之间用 `|` 分隔。
* 生成规则 是可选的。
* 生成规则 有 7 种格式：
    1. `'name|min-max': value`
    1. `'name|count': value`
    1. `'name|min-max.dmin-dmax': value`
    1. `'name|min-max.dcount': value`
    1. `'name|count.dmin-dmax': value`
    1. `'name|count.dcount': value`
    1. `'name|+step': value`
* **生成规则 的 含义 需要依赖 属性值 才能确定。**
* 属性值 中可以含有 `@占位符`。
* 属性值 还指定了最终值的初始值和类型。

<!-- 感谢 @麦少 同学对 Mock.js 语法的整理和分析，才有了这版相对清晰的语法文档。 -->

**生成规则和示例：**

1. 属性值是字符串 **String**
    1. `'name|min-max': 'value'` 通过重复 `'value'` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`。
    2. `'name|count': 'value'` 通过重复 `'value'` 生成一个字符串，重复次数等于 `count`。
2. 属性值是数字 **Number**
    1. `'name|+1': 100` 属性值自动加 1，初始值为 100
    2. `'name|1-100': 100` 生成一个大于等于 1、小于等于 100 的整数，属性值 100 只用来确定类型。
    3. `'name|1-100.1-10': 100` 生成一个浮点数，整数部分大于等于 1、小于等于 100，小数部分保留 1 到 10 位。

            {
                'number1|1-100.1-10': 1,
                'number2|123.1-10': 1,
                'number3|123.3': 1,
                'number4|123.10': 1.123
            }
            // =>
            {
                "number1": 12.92,
                "number2": 123.51,
                "number3": 123.777,
                "number4": 123.1231091814
            }
3. 属性值是布尔型 **Boolean**
    1. `'name|1': value` 随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率是 1/2。
    2. `'name|min-max': value` 随机生成一个布尔值，值为 `value` 的概率是 `min / (min + max)`，值为 `!value` 的概率是 `max / (min + max)`。
4. 属性值是对象 **Object**
    1. `'name|min-max': {}` 从属性值 `{}` 中随机选取 `min` 到 `max` 个属性。
    2. `'name|count': {}` 从属性值 `{}` 中随机选取 `count` 个属性。
5. 属性值是数组 **Array**
    1. `'name|1': [{}, {} ...]` 从属性值 `[{}, {} ...]` 中随机选取 1 个元素，作为最终值。
    2. `'name|min-max': [{}, {} ...]` 通过重复属性值 `[{}, {} ...]` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`。
    3. `'name|count': [{}, {} ...]` 通过重复属性值 `[{}, {} ...]` 生成一个新数组，重复次数为 `count`。
6. 属性值是数组 **Function**

    `'name': function(){}` 执行函数 `function(){}`，取其返回值作为最终的属性值，上下文为 `'name'` 所在的对象。

### 数据占位符定义 DPD

占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中。占位符 的格式为：
    
    @占位符
    @占位符(参数 [, 参数])

**注意：**

1. 用 `@` 来标识其后的字符串是 占位符。
2. 占位符 引用的是 `Mock.Random` 中的方法。
3. 通过 `Mock.Random.extend()` 来扩展自定义占位符。
4. 占位符 也可以引用 数据模板 中的属性。
5. 占位符 会优先引用 数据模板 中的属性。

        {
            name: {
                first: '@FIRST',
                middle: '@FIRST',
                last: '@LAST',
                full: '@first @middle @last'
            }
        }
        // =>
        {
            "name": {
                "first": "Charles",
                "middle": "Brenda",
                "last": "Lopez",
                "full": "Charles Brenda Lopez"
            }
        }

---
