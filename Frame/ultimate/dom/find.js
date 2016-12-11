jQuery.fn.extend({
    // 获取所有元素的子元素
    children: function() {

        var result = [];

        // 遍历所有元素
        this.each( function() {

            // 把所有的子元素添加存储result中
            result.push.apply( result, this.children );
        });

        return this.pushStack( result );
    },

    // 获取所有元素的下一个兄弟元素
    next: function() {

        var result = [];

        // 遍历所有元素
        this.each( function() {
            var nextNode = this;

            // 找到元素节点为止
            while ( nextNode = nextNode.nextSibling ) {
                if( nextNode.nodeType === 1 ) {
                    result.push( nextNode );
                    break;
                }
            }
        });

        return this.pushStack( result );
    },

    // 获取所有元素的下一个兄弟元素
    _next: function() {
        return this.map( function() {
            var nextNode = this;

            // 找到元素节点为止
            while( nextNode = nextNode.nextSibling ) {
                if( nextNode.nodeType === 1 ) {
                    return nextNode;
                }
            }
        });
    },
});