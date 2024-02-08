import { pick } from '../random/helper';
import { gen } from './gen';
export function array({
    name,
    rule: { min, max, parameters, count },
    template,
    context: { path, templatePath, root, templateRoot },
}) {
    let result = [];

    // 'name|1': []
    // 'name|count': []
    // 'name|min-max': []
    if (template.length === 0) return [];

    // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
    if (!parameters) {
        template.forEach((item, index) => {
            result.push(
                gen(item, index, {
                    path: [...path, index],
                    templatePath: [...templatePath, index],
                    currentContext: result,
                    templateCurrentContext: template,
                    root: root || result,
                    templateRoot: templateRoot || template,
                }),
            );
        });
    } else {
        // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
        if (min === 1 && max === undefined) {
            // fix #17
            result = pick(
                gen(template, undefined, {
                    path: [...path, name],
                    templatePath: [...templatePath, name],
                    currentContext: result,
                    templateCurrentContext: template,
                    root: root || result,
                    templateRoot: templateRoot || template,
                }),
            );
        } else {
            // 'data|+1': [{}, {}]
            if (parameters[2]) {
                template.__order_index = template.__order_index || 0;
                const index = template.__order_index % template.length;
                result = gen(template[index], undefined, {
                    path: [...path, name],
                    templatePath: [...templatePath, name],
                    currentContext: result,
                    templateCurrentContext: template,
                    root: root || result,
                    templateRoot: templateRoot || template,
                });

                template.__order_index += +parameters[2];
            } else {
                // 'data|1-10': [{}]
                [...Array(Math.min(count, 10000)).keys()].forEach(() => {
                    template.forEach((item, index) => {
                        result.push(
                            gen(item, result.length, {
                                path: [...path, result.length],
                                templatePath: [...templatePath, index],
                                currentContext: result,
                                templateCurrentContext: template,
                                root: root || result,
                                templateRoot: templateRoot || template,
                            }),
                        );
                    });
                });
            }
        }
    }
    return result;
}
