import Constant from '../constant';
import { type as Type } from '../util';
import { parser as Parser } from '../parser';
import * as typeset from './index';
let GID = 1; // 1.0.1 版本引用了 Constant.GUID 但是那个是常量，后面这个变量需要改变
export function gen(template, name = '', context = {}) {
    const newContext = {
        // 当前访问路径，只有属性名，不包括生成规则
        path: context.path || [GID],
        templatePath: context.templatePath || [GID++],
        // 最终属性值的上下文
        currentContext: context.currentContext,
        // 属性值模板的上下文
        templateCurrentContext: context.templateCurrentContext || template,
        // 最终值的根
        root: context.root || context.currentContext,
        // 模板的根
        templateRoot: context.templateRoot || context.templateCurrentContext || template,
    };
    // console.log('path:', context.path.join('.'), template)

    const type = Type(template);
    const func = typeset[type];
    let data;

    if (func) {
        data = func({
            // 属性值类型
            type,
            // 属性值模板
            template,
            // 属性名 + 生成规则
            name,
            // 属性名
            parsedName: name ? ('' + name).replace(Constant.RE_KEY, '$1') : name,
            // 解析后的生成规则
            rule: Parser(name),
            // 相关上下文
            context: newContext,
        });
        // 循环引用
        if (!newContext.root) newContext.root = data;
        return data;
    }
    return template;
}
