function htree(headers) {
    var re = [],
        id = 0;

    String.prototype.format = function() {
        var args = arguments;
        if (args.length == 0) return this;
        return this.replace(/{(\d+)?}/g, function($0, $1) {
            return args[parseInt($1)] + '';
        });
    };

    function closest(level, index) {
        for (var i = index - 1; i >= 0; i--) {
            if (re[i] && re[i].level <= level) return re[i].id;
        }
        return -1;
    }

    function _parseChildren(id) {
        var tree;
        var pid = 'p' + id;
        if (tree = pidMap[pid]) {
            for (var i = 0; tree && i < tree.length; i++) {
                tree[i].index = i;
                var tmp = _parseChildren(tree[i].id); // 
                if (tmp && tmp.length > 0) tree[i].children = tmp; // 
            }
        }
        return tree && tree.length > 0 && tree || null;
    }

    function _genHTML(tree) {
        if (!tree || !tree.length) return '';
        var html = '<ul>';
        for (var i = 0, len = tree.length; i < len; i++) {
            html += '<li>{0} {1} {2}</li>'.format(tree[i].el.text(), tree[i].id, tree[i].parent);
            if (tree[i].children) html += _genHTML(tree[i].children);
        }
        html += '</ul>';
        return html;
    }

    // 构造父子关系
    headers.each(function(index, elem) {
        var h = $(elem),
            level = parseInt(elem.nodeName.match(/h(\d)/i)[1], 10),
            parentId = closest(level - 1, index),
            item = {
                id: index,
                el: h,
                level: level,
                parentId: parentId,
                parent: re[parentId]
            };
        re.push(item);
    });
    // 构造 Map，获取同级节点
    var idMap = {}, pidMap = {}, id, pid;
    for (var i = 0, len = re.length; i < len; i++) {
        id = re[i].id;
        pid = 'p' + re[i].parentId;
        idMap[id] = re[i];
        (pidMap[pid] = pidMap[pid] || []).push(re[i]);
    }
    // 解析为树结构
    var tree = _parseChildren(-1); // 
    // console.dir(tree);
    // 生成测试 HTML
    // var html = _genHTML(tree);
    // console.log(html);
    // $('body').append(html);

    return tree;
}

function hprefix(node) {
    var orig = node,
        indexes = [];
    while (node.parent) {
        indexes.push(node.parent.index + 1);
        node = node.parent;
    }
    indexes.push(orig.index + 1)
    prefix = indexes.length === 1 ? indexes[0] + '.' : indexes.join('.');
    prefix += ' ';
    return ''
    return prefix;
}

function anchor(text) {
    return text.replace(/.+\.(\w+)\(.*\)/, '$1') || text
}

function hhtml(tree, level) {
    if (!tree || !tree.length) return '';
    var html = '<ul>',
        text, prefix, node, indexes;
    for (var i = 0, len = tree.length; i < len; i++) {
        prefix = hprefix(tree[i]);
        tree[i].el.html(prefix + tree[i].el.text());
        text = tree[i].el.text();
        text = anchor(text)
        text = '<a href="' + (tree[i].el.attr('href') || '#' + text) + '">' + text + '</a>';
        if (tree[i].level <= level) html += '<li>' + text + '</li>';
        if (level) {
            if (tree[i].level < level && tree[i].children) html += hhtml(tree[i].children, level);
        } else {
            if (tree[i].children) html += hhtml(tree[i].children, level);
        }
    }
    html += '</ul>';
    return html;
}

$(function() {
    var headers = $(':header').not('h1'),
        tree = htree(headers),
        html = hhtml(tree, 10),
        catalog;

    if (html) {
        // 插入目录
        catalog = $('<div class="page-catalog">')
            .append(html)
            .appendTo('div#sidebar')
    }

    // 插入锚点
    headers.each(function(index, elem) {
        $(elem).before(
            $('<a>').attr('name',
                anchor($(elem).attr('href') || $(elem).text())
            )
        )
    });
    // 回到顶部
    // headers.append(' <small><a href="#">⬆</a></small>');
});