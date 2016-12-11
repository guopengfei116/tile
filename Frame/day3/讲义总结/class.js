$.fn.extend({

    // 判断元素中是否含有指定的class
    hasClass: function( className ) {
        /*
         * 实现思路：
         * 1、遍历所有的元素
         * 2、依次获取每一个元素的className，为了方便判断，首尾加空格
         * 3、利用处理过的className字符串的indexOf方法判断有没有指定的className(这个className首尾也加空格)
         * 4、如果有一个元素的判断结果不为-1，就返回true
         * 5、否则返回false。
         * */
        for( var i = 0, len = this.length; i < len; i++ ) {

            // 只要有一个元素存在指定的className，那么就可以true了
            if ( (' ' + this[ i ].className + ' ').indexOf(' ' + className + ' ') > -1 ) {
                return true;
            }
        }

        // 所有的元素都没有，那么返回false
        return false;
    },

    // 判断元素中是否含有指定的class
    _hasClass: function( className ) {
        /*
         * 实现思路：
         * 1、遍历所有的元素
         * 2、依次获取每一个元素的className，为了方便判断，首尾加空格
         * 3、利用处理过的className字符串的indexOf方法判断有没有指定的className(这个className首尾也加空格)
         * 4、如果有一个元素的判断结果不为-1，就返回true
         * 5、否则返回false。
         * */

        // 用来记录元素有没有指定的className，默认为没有
        var has = false;

        this.each( function() {

            // 只要有一个元素存在指定的className，那么就修改has变量的值为true
            if ( (' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1 ) {
                has = true;

                // 中断遍历
                return false;
            }
        });

        // 返回has
        return has;
    },

    // 给所有的元素添加指定的class
    addClass: function( classNames ) {
        /*
         * 实现思路：
         * 1、遍历所有的元素
         * 2、依次判断每一个元素有没有要添加的className，
         * 3、有则忽略(防止重复)，没有则添加( className += ' ' + classNames )
         * 4、处女座最后可以考虑trim一下
         * 5、链式编程返回this
         * */
        this.each( function() {

            // 如果没有则添加
            if ( !jQuery( this ).hasClass( classNames ) ){
                this.className += ' ' + classNames;
            }
        });

        return this;
    },

    // 给所有的元素添加指定的class
    _addClass: function( classNames ) {
        /*
         * 实现思路：
         * 1、传入的不是字符串，直接return this
         * 2、如果传入了字符串，先trim一下，然后使用split(' ')劈成数组存起来
         * 3、外层遍历所有的元素，
         * 4、内层遍历数组，得到每一个要添加的class
         * 5、然后依次判断每一个元素有没有要添加的class，有则忽略，没有则添加(记得空格)
         * 6、最后处女座可以考虑整体trim一下去掉首尾可能多余的空格
         * 7、链式编程返回this
         * */
        if( !jQuery.isString( classNames ) ) {
            return this;
        }

        // 得到存储所有class的数组
        var classNames = jQuery.trim( classNames ).split( ' ' );

        // 遍历所有元素
        this.each( function() {
            var self = this;

            // 遍历所有要添加的class
            jQuery.each( classNames, function( i, val ) {

                // 如果遍历到的元素没有遍历到的class，那么添加
                if ( !jQuery( self ).hasClass( val ) ){
                    self.className += ' ' + val;
                }
            });
        });

        return this;
    },

    // 删除所有的元素指定的class
    removeClass: function( className ) {
        /*
         * 实现思路：
         * 1、没有参数，遍历所有的元素，设置他们的className为空
         * 2、有参数，遍历所有的元素，删除指定的className(元素.className.replace())
         * 把指定的className替换为空格，最后整体trim一下。
         * 3、链式编程返回this
         * */

        // 不传参，清除全部class
        if ( arguments.length === 0 ) {
            this.each( function() {
                this.className = '';
            });
        }

        // 传参，删除指定的
        else {
            this.each( function() {
                this.className = ( ' ' + this.className + ' ' ).replace( ' ' + jQuery.trim(className) + ' ', ' ' );
            });
        }

        return this;
    },

    // 删除所有的元素指定的class
    _removeClass: function( classNames ) {
        /*
         * 实现思路：
         * 1、没有传参，遍历所有的元素，清空他们的className
         * 2、传入的不是字符串，直接return this
         * 3、如果传入了字符串，先trim一下，然后使用split(' ')劈成数组存起来
         * 4、外层遍历所有的元素
         * 5、内层遍历数组
         * 6、遍历到的元素删除遍历到的class( 删除方式和hasClass类似 )
         * 7、链式编程返回this
         * */
        // 不传参，清除全部class
        if ( arguments.length === 0 ) {
            this.each( function() {
                this.className = '';
            });
        }

        // 传的参数是字符串，删除指定的class
        else if( jQuery.isString( classNames ) ){

            // 得到存储所有class的数组
            classNames = jQuery.trim( classNames ).split( ' ' );

            // 遍历所有元素
            this.each( function() {
                var self = this;

                // 遍历所有要添加的class
                jQuery.each( classNames, function( i, val ) {

                    // 分别删除每一个元素遍历到的class
                    //self.className = ( ' ' + self.className + ' ' ).replace( ' ' + jQuery.trim(val) + ' ', ' ' );
                    self.className = self.className.replace( new RegExp( '\\b' + val + '\\b' ), '' );
                });
            });
        }

        return this;
    },

    // 有则删除，没有则添加
    toggleClass: function( className ) {
        /*
         * 实现思路：
         * 1、遍历所有的元素，
         * 2、判断每一个元素有则删除，没有则添加
         * 3、链式编程返回this
         * */
        this.each( function() {

            // 包装遍历到的每一个元素
            var $this = jQuery( this );

            // 有则删除，没有则添加
            if( $this.hasClass( className ) ) {
                $this.removeClass( className );
            }else {
                $this.addClass( className );
            }
        });
    },

    // 有则删除，没有则添加
    _toggleClass: function( classNames ) {
        /*
         * 实现思路：
         * 1、传入的不是字符串，直接return this
         * 2、如果传入了字符串，先trim一下，然后使用split(' ')劈成数组存起来
         * 3、外层遍历所有的元素
         * 4、内层遍历数组
         * 5、遍历到的每一个元素判断有没有遍历到的每一个class，有则删除，没有则添加( 可以考虑复用 )
         * 6、链式编程返回this
         * */

        if( !jQuery.isString( classNames ) ) {
            return this;
        }

        // 参数转化为存储所有class的数组
        classNames = jQuery.trim( classNames ).split( ' ' );

        // 遍历所有的元素
        this.each( function() {

            // 包装遍历到的每一个元素
            var $self = jQuery( this );

            // 遍历所有的class
            jQuery.each( classNames, function( i, val ) {

                // 有则删除，没有则添加
                if( $self.hasClass( val ) ) {
                    $self.removeClass( val );
                }else {
                    $self.addClass( val );
                }
            } );
        });
    }
});
