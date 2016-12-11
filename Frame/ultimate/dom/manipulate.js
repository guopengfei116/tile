jQuery.fn.extend({

    /*
     * function { empty } 清空元素内容
     * return { object } this
     * */
    empty: function() {
        return this.each( function() {
            this.innerHTML = '';
        });
    },

    _empty: function() {
        return this.html( null );
    },

    /*
     * function { empty } 清空元素内容
     * return { object } this
     * */
    remove: function() {
        return this.each( function() {
            this.parentNode.removeChild( this );
        });
    },

    /*
     * function { appendTo } 把元素添加到指定父元素的后面
     * param { parents: DOM、jQ实例、selector } 父节点、目的地
     * return { object } 被添加子节点包装后的实例
     * */
    appendTo: function( parents ) {
        /*
         * 实现思路：
         * 1、把parent统一包装成jQ实例
         * 2、遍历所有父元素，遍历所有子元素
         * 3、给所有父元素添加所有子元素(只有第一个父元素添加的是子元素本体，其余的是clone版本)。
         * 4、收集所有被添加的子元素(包含clone版本)
         * 5、由pushStack把所有子元素包装成实例，并记录上一级链，然后返回其值。
         * */
        var $parents = jQuery( parents ),
            $sons = this;

        var son, sons = [];

        // 遍历所有父元素
        $parents.each( function( i ) {

            var parent = this;

            // 遍历所有被添加的元素
            $sons.each( function() {

                // 只有第一个目标添加的是元素本体，以后添加的是元素clone版本
                son = i === 0? this: this.cloneNode( true );
                parent.appendChild( son );
                sons.push( son );
            });
        });

        // 交由pushStack包装成新实例返回，新实例记录了上一级链
        return this.pushStack( sons );
    },

    /*
     * function { preppendTo } 把元素添加到指定父元素的最前面
     * param { parents: DOM、jQ实例、selector } 父节点、目的地
     * return { object } 被添加子节点包装后的实例
     * */
    preppendTo: function( parents ) {
        /*
         * 实现思路：
         * 1、把parent统一包装成jQ实例
         * 2、遍历所有父元素，遍历所有子元素
         * 3、给所有父元素的最前面添加所有子元素(只有第一个父元素添加的是子元素本体，其余的是clone版本)。
         * 4、收集所有被添加的子元素(包含clone版本)
         * 5、由pushStack把所有子元素包装成实例，并记录上一级链，然后返回其值。
         * */
        var $parents = jQuery( parents ),
            $sons = this;

        var son, sons = [];

        // 遍历所有父元素
        $parents.each( function( i ) {

            var parent = this;

            // 遍历所有被添加的元素
            $sons.each( function() {

                // 只有第一个目标添加的是元素本体，以后添加的是元素clone版本
                son = i === 0? this: this.cloneNode( true );
                parent.insertBefore( son, parent.firstChild );
                sons.push( son );
            });
        });

        // 交由pushStack包装成新实例返回，新实例记录了上一级链
        return this.pushStack( sons );
    },

    /*
     * function { appendTo } 在元素的后面添加子元素
     * param { sons: DOM、jQ实例、string } 子元素
     * return { object } this
     * */
    append: function( sons ) {
        /*
         * 实现思路：
         * 1、content是字符串
         * 1.1、遍历所有元素，累加innerHTML
         * 2、不是
         * 2.1、使用jQuery包装成实例
         * 2.2、遍历所有目标，再遍历所有要添加的元素
         * 2.3、依次把所有元素添加到所有目标中(只有一个目标添加的元素是本体，其余的是clone版本)
         * 2.4、链式编程返回this
         * */

        if( jQuery.isString( sons ) ) {
            this.each( function() {
                this.innerHTML += sons;
            });
        }else {
            jQuery( sons ).appendTo( this );
        }

        // 链式编程
        return this;
    },

    /*
     * function { appendTo } 在元素的最前面添加子元素
     * param { sons: DOM、jQ实例、string } 子元素
     * return { object } this
     * */
    prepend: function( sons ) {
        /*
         * 实现思路：
         * 1、content是字符串
         * 1.1、遍历所有元素，累加到innerHTML的前面
         * 2、不是
         * 2.1、统一使用jQuery包装成实例，然后借用prependTo实现添加
         * 3、链式编程返回this
         * */

        if( jQuery.isString( sons ) ) {
            this.each( function() {
                this.innerHTML = sons + this.innerHTML;
            });
        }else {
            jQuery( sons ).prependTo( this );
        }

        return this;
    },

    /*
     * function { before } 在元素的前面添加兄弟元素
     * param { sibling: DOM、jQ实例、string } 要添加的兄弟元素
     * return { object } this
     * */
    before: function( sibling ) {
        /*
         * 实现思路：
         * 1、如果参数是字符串，使用parseHTML解析转换为DOM节点
         * 2、统一使用jQuery包装成实例
         * 3、遍历所有参照元素，遍历所有被添加的元素
         * 4、依次获取参照元素的父元素，然后添加元素到参照元素的前面(只有第一个父元素添加的是本体，其余的是clone版本)
         * 5、链式编程返回this
         * */
        if( jQuery.isString( sibling ) ) {
            sibling = jQuery.parseHTML( sibling );
        }

        var $sibling = jQuery( sibling );

        // 遍历参照元素
        this.each( function( i ) {
            
            var refer = this;

            // 遍历被添加的元素
            $sibling.each( function() {

                // 获取参照元素的父元素，然后在参照元素的前面添加子元素
                refer.parentNode.insertBefore( i === 0? this: this.cloneNode( true ), refer );
            });
        });

        return this;
    },

    /*
     * function { before } 在元素的后面添加兄弟元素
     * param { sibling: DOM、jQ实例、string } 要添加的兄弟元素
     * return { object } this
     * */
    after: function( sibling ) {
        /*
         * 实现思路：
         * 1、如果参数是字符串，使用parseHTML解析转换为DOM节点
         * 2、统一使用jQuery包装成实例
         * 3、遍历所有参照元素，遍历所有被添加的元素
         * 4、依次获取参照元素的父元素，然后添加元素到参照元素的后面(只有第一个父元素添加的是本体，其余的是clone版本)
         * 5、链式编程返回this
         * */
        if( jQuery.isString( sibling ) ) {
            sibling = jQuery.parseHTML( sibling );
        }

        var $sibling = jQuery( sibling );

        // 遍历参照元素
        this.each( function( i ) {

            var self = this;

            // 遍历被添加的元素
            $sibling.each( function() {

                // 获取参照元素的父元素，然后在参照元素的后面添加子元素
                self.parentNode.insertBefore( i === 0? this: this.cloneNode( true ), self.nextSibling );
            });
        });

        return this;
    },

    /*
     * function { insertBefore } 把元素添加到指定元素前面
     * param { refer: DOM、jQ实例、selector } 参照的兄弟元素
     * return { object } this
     * */
    insertBefore: function( refer ) {
        /*
         * 实现思路：
         * 1、统一使用jQuery包装成实例
         * 2、遍历所有参照元素，遍历所有被添加的元素
         * 3、依次获取参照元素的父元素，然后添加元素到参照元素的前面(只有第一个父元素添加的是本体，其余的是clone版本)
         * 4、链式编程返回this
         * */
        var $refer = jQuery( refer );
        var $sibling = this;
        var sibling, siblings = [];

        // 遍历参照元素
        $refer.each( function( i ) {

            var refer = this;

            // 遍历被添加元素
            $sibling.each( function() {

                // 只有第一个父元素添加的是本体，其余的是clone版本
                sibling = i === 0? this: this.cloneNode( true );

                // 获取参照元素的父元素，然后在参照元素的前面添加子元素
                refer.parentNode.insertBefore( sibling, refer );
                siblings.push( sibling );
            });
        });

        return this.pushStack( siblings );
    },

    /*
     * function { insertAfter } 在元素的后面添加兄弟元素
     * param { refer: DOM、jQ实例、selector } 参照的兄弟元素
     * return { object } this
     * */
    insertAfter: function( refer ) {
        /*
         * 实现思路：
         * 1、统一使用jQuery包装成实例
         * 2、遍历所有参照元素，遍历所有被添加的元素
         * 3、依次获取参照元素的父元素，然后添加元素到参照元素的后面(只有第一个父元素添加的是本体，其余的是clone版本)
         * 4、链式编程返回this
         * */
        var $refer = jQuery( refer );
        var $sibling = this;
        var sibling, siblings = [];

        // 遍历参照元素
        $refer.each( function( i ) {

            var refer = this;

            // 遍历被添加的元素
            $sibling.each( function() {

                // 只有第一个父元素添加的是本体，其余的是clone版本
                sibling = i === 0? this: this.cloneNode( true );

                // 获取参照元素的父元素，然后在参照元素的后面添加子元素
                refer.parentNode.insertBefore( sibling, refer.nextSibling );
                siblings.push( sibling );
            });
        });

        return this.pushStack( siblings );
    }
});
