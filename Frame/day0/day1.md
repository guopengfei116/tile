# 
- 独立比较传统代码编写与函数封装调用之间的优劣
```
封装getTag方法
function getTag(tagName, arr) {
    var tags = document.getElementsByTagName(tagName);
    arr.push.apply(arr, tags);
}
```

```
升级getTag方法
function getTag(tagName, arr) {
    arr = arr || [];  
    var tags = document.getElementsByTagName(tagName);
    return arr.push.apply(arr, tags);
}
```

- 使用querySelectorAll方法获得元素
```
封装select方法
function select(selector, arr) {
    arr = arr || [];  
    var tags = document.querySelectorAll(selector);
    return arr.push.apply(arr, tags);
}
```

- 使用函数封装基本元素选择方法

```
// id方法
function byId(id, arr) {
    arr = arr || [];
    var node = document.getElementById(id);
    return arr.push(node);
}
```

```
// 升级id方法
function byId(id, arr) {
    arr = arr || [];
    var tag = document.getElementById(id);
    if (tag) {
        arr.push(tag);
    }
    return arr;
}
```

```
封装byTag方法
function byTag(tagName, arr) {
    arr = arr || [];  
    var tags = document.getElementsByTagName(tagName);
    return arr.push.apply(arr, tags);
}
```

```
// 封装byClass方法
function byClass(className, arr) {
    arr = arr || [];
    var tags = document.getElementsByTagName(tagName);
    return arr.push.apply(arr, tags);
}
```

```
// 封装byAll方法
function byAll(arr) {
    arr = arr || [];
    return byTag('*', arr);
}
```

- 兼容早期IE浏览器来获得包含类名的元素

```
function contains(str1, str2) {
    var regStr = '^' + str2 + '|' + str2 + '\\s|\\s' + str2 + '\\s|\\s' + str2 + '$';
    return new RegExp(regStr).test(str1);;
}

function byClass(className, arr) {
    arr = arr || [];
    var tags = document.getElementsByTagName('*');
    for (var i = 0, len = tags.length; i < len; i++) {
        if (contains(tags[i].className, className)) {
            arr.push(tags[i]);
        }
    }
    return arr;
}
```

```
// 优化
function byClass(className, arr) {
    arr = arr || [];
    var tags = document.getElementsByTagName('*');
    for (var i = 0, len = tags.length; i < len; i++) {
        if (' ' + tags[i].className + ' '.indexOf(' ' + className + ' ') > -1) {
            arr.push(tags[i]);
        }
    }
    return arr;
}
```

```
// 兼容
function byClass(className, arr) {
    arr = arr || [];
    if (document.getElementsByClassName) {
        arr.push.apply(document.getElementsByClassName(className));
    }else {
        var tags = document.getElementsByTagName('*');
        for (var i = 0, len = tags.length; i < len; i++) {
            if (' ' + tags[i].className + ' '.indexOf(' ' + className + ' ') > -1) {
                arr.push(tags[i]);
            }
        }
    }
    return arr;
}
```

- 能通过分析参数来调用不同的获得元素的函数
- 利用正则表达式匹配基本选择器
- 利用沙箱封装select函数