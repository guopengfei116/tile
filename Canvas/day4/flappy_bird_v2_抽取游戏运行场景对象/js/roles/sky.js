(function( w ) {

    /*
     * constrctor { Sky } 天空
     * param { options: Object } 参数配置
     * patam { options.ctx: Context } 绘图环境
     * patam { options.img: Image } 天空图片
     * */
    function Sky( options ) {

        // 每创建一个背景，那么总数自增一次
        Sky.len++;

        this.ctx = options.ctx;
        this.img = options.img;

        // 一张背景的宽和高
        this.width = options.img.width;
        this.height = options.img.height;

        // 背景的x轴坐标按照数量动态计算
        // 例：第一个背景x轴坐标为0，第二个背景x轴坐标为一个背景宽度
        this.x = this.width * (Sky.len - 1);
        this.y = 0;

        // 背景每秒运行的速度
        this.speedSecond = 100;
    }

    // 记录创建背景对象的数量
    Sky.len = 0;

    // 置换原型
    Sky.prototype = {

        constructor: Sky,

        // 绘制背景
        draw: function() {
            this.ctx.drawImage( this.img, this.x, this.y );
        },

        // 更新背景下一次绘制时的数据
        update: function( delaySecond ) {

            // 行走的总路程 = 初速度 * 时间
            // 背景下一次的x轴坐标 = 当前x轴 - 行走的总路程
            this.x -= this.speedSecond * delaySecond;

            // 如果背景走出画布，那么向右拼接，实现无缝滚动效果
            if ( this.x < -this.width ) {
                this.x += this.width * Sky.len;
            }
        }
    };

    w.Sky = Sky;
}( window ));