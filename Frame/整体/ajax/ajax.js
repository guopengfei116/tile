jQuery.extend({

    // 创建XMLHTTPRequest对象
    getXhr: function () {
        if ( window.XMLHttpRequest ) {
            return new window.XMLHttpRequest;
        }else {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
    },

    // 解析JSON
    parseJSON: function ( JSON ) {
        if ( !JSON ) {
            return {};
        }

        // 优先使用内置的方法解析JSON数据,
        // 如果不成功，就使用Function解析，
        // 如果仍然不成功，就返回空对象
        try {
            return window.JSON.parse( JSON );
        }catch(e) {
            try {
                return Function('return ' + JSON)();
            }catch(e) {
                return {};
            }
        }
    },

    // 默认的ajax配置
    ajaxSettings: {
        url: window.location.href,
        method: 'GET',
        async: true,
        dataType: 'JSON',  // html、text、js
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function () {},
        error: function () {},
        complete: function () {}
    },

    // 动态执行js代码
    evalJs: function ( js ) {
        try {
            eval( js );
        }catch (e) {}
    },

    // 把对象转换为URL参数的形式
    // 例：{ val:100, v:888 } ==> "val=100&v=888"
    urlStringify: function ( data ) {
        var key, result = '';
        for ( key in data ) {
            result += window.encodeURIComponent(key) + '=' + window.encodeURIComponent(data[key]) + '&';
        }
        // 为了防止乱码，统一先编码成URI格式的数据
        return result.slice(0, -1);
    },

    // 把对象转换成URL参数的形式
    stringifyURLParam: function ( data ) {
        if ( !data ) {
            return '';
        }

        var key, resultArr = [];

        /*
         * 遍历data，把每一项数据变成key=value的字符串存起来，
         * 即: resultArr = [ 'key=value', 'key2=value2', 'key3=value3' ]
         * 最后使用join把这些字符串拼接成URL参数的形式。
         * 即：'key=value&key2=value2&key3=value3'
         * */
        for ( key in data ) {
            // 为了防止提交的数据出现乱码，统一使用encodeURIComponent编码一下
            resultArr.push( encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) );
        }
        return resultArr.join('&');
    },

    getJsonp: function () {

    },

    // 用来发送ajax请求
    ajax: function ( options ) {
        var config = {}, url, xhr, data, successData;

        if ( !options || typeof options !== 'object' ) {
            throw new Error("请传一个配置对象！");
        }

        // 合并ajax请求的配置
        $.extend( config, $.ajaxSettings, options );

        // 如果获取的是jsonp数据，那么走单独处理的方法
        if ( config.dataType === 'jsonp' ) {
            return $.getJsonp( config );
        }

        // 发送ajax请求
        xhr = $.getXhr();
        data = $.urlStringify( config.data );
        url = config.method === 'GET'? config.url += '?' + data : config.url;
        xhr.open( config.method, url, config.async );
        if ( config.method == 'POST' ) {
            xhr.setRequestHeader( 'contentType', config.contentType );
        }
        xhr.onreadystatechange = function () {
            if ( xhr.readyState == 4 ) {

                config.complete();  // 请求结束，执行complete方法

                // 数据请求成功
                if ( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {

                    // 如果预期请求的数据类型为JSON，那么自动把JSON解析为对象返回，
                    // 如果预期是html或text，那么原物返回，
                    // 如果预期是js，那么会尝试执行它，然后原物返回。
                    if ( config.dataType === 'JSON' ) {
                        successData = $.parseJSON(xhr.responseText);
                    }else if ( config.dataType === 'html' || config.dataType === 'text' ) {
                        successData = xhr.responseText;
                    }else if ( config.dataType === 'js' ) {
                        $.evalJs( xhr.responseText );
                        successData = xhr.responseText;
                    }else {
                        successData = xhr.responseText;
                    }

                    config.success( successData );
                }else {
                    config.error( xhr.statusText );
                }
            }
        };
        xhr.send( data );
    }
});