### Mock.toJSONSchema( template )

* Mock.toJSONSchema( template )

把数据模板转换为 JSON Schema 风格。

**参数的含义和默认值**如下所示：

* **参数 template**：可选。表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。

该方法返回一个 JSON Schema 风格的对象，结构如下：

    {
        name: '',
        type: '',
        template: ,
        rule: {
            min: min,
            max: max,
            dmin: dmin,
            dmax: dmax,
            step: step
        },
        items: [],
        properties: []
    }

其中，属性的含义如下所示：

* **属性 name**：描述属性名。
* **属性 type**：描述属性值的类型。可选值有 6 个：`'string'`、`'number'`、`'boolean'`、`'array'`、`'object'`、`'regexp'`。
* **属性 template**：属性值的模板。其中可能含有占位符。
* **属性 rule**：描述属性值的生成规则。其中，含有 5 个属性：min、max、dmin、dmax、step。生成规则的含义需要依赖属性值的类型才能确定。参见[数据模板定义 DTD](#数据模板定义 DTD)
* **属性 items**：用于存放对数组元素的描述。
* **属性 properties**：用于存放对数组元素的描述。

JSON Schame 更方便机器解析，但书写和阅读起来很繁琐；Mock.js 的语法规则对书写者更友好。所以，建议用 Mock.js 的语法规则来快速的编写和生成模拟数据，用 Mock.toJSONSchema( template ) 生成的 JSON Schema 对象来生成文档、校验数据。

相关阅读：[JSON Schema](http://json-schema.org/)

<!-- 
**2014.8.14**

# Mock.toJSONSchema(template)

## 生成 

`'name|rule': template`

## 验证 

### 规则映射

rule | String | Number | Boolean | Object | Array | Function | RegExp |
---- | ------ | ------ | ------- | ------ | ----- | -------- | ------ |
min  |  |  |  |  |  |  | 
max  |  |  |  |  |  |  | 
dmin |  |  |  |  |  |  | 
dmax |  |  |  |  |  |  | 
step |  |  |  |  |  |  | 

### format

*TODO*
 -->