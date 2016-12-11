(function( w ) {

    /*
     * constrctor { Land } 大地
     * param { options: Object } 参数配置
     * patam { options.ctx: Context } 绘图环境
     * patam { options.img: Image } 大地图片
     * */
    function Land( options ) {

        // 没创建一个大地就自增一下总数
        Land.len++;
        
        this.ctx = options.ctx;
        this.img = options.img;

        // 大地的宽和高
        this.width = this.img.width;
        this.height = this.img.height;

        // 大地的坐标
        this.x = this.width * (Land.len - 1);
        this.y = this.ctx.canvas.height - this.height;

        // 大地每秒运行的速度
        this.speedSecond = 100;
    }

    // 记录创建了多少大地
    Land.len = 0;

    // 置换原型
    Land.prototype = {
        constructor: Land,

        // 绘制大地
        draw: function() {
            this.ctx.drawImage( this.img, this.x, this.y );
        },

        // 更新大地下一次绘制时的数据
        update: function( delaySecond ) {

            // 大地最新的位置 = 当前位置 - 总运动距离( 速度 * 时间 )
            this.x -= this.speedSecond * delaySecond;

            // 当大地走出画布时，向右拼接，实现无缝滚动
            if( this.x < -this.width ) {
                this.x += this.width * Land.len;
            }
        }
    };

    w.Land = Land;

}( window ));