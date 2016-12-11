/*
* 管道的特性：
* 1、上下管道是成对出现的，所以x轴坐标可以共享
* 2、第一根管道第一次绘制时，需要和画布产生一个比较大距离，防止游戏还没开始就结束了
* 3、上下管道之间的间距是固定的，由用户自由调节
* 4、左右管道之间的间距是固定的，由用户自由调节
* 5、随机生成上管道的高度，那么下管道的高度就可以计算出来了
* 6、需要指定管道的最小高度和最大高度
* 7、当一对管道走出画布的时候，需要重新随机生成高度从右边出来
* */

(function( w ) {

    /*
    * constructor { Pipe } 管道构造函数
    * param { options: Object } 参数配置
    * param { options.ctx: Context } 绘制上下文
    * param { options.imgDown: Image } 口朝下的管道，在画布的上面
    * param { options.imgUp: Image } 口朝上的管道，在画布的下面
    * param { options.pipeTBSpace: number } 上下管道之间的间隔
    * param { options.pipeLRSpace: number } 管道与管道之间的间隔
    * param { options.minHeight: number } 管道最小高度
    * param { options.maxHeight: number } 管道最大高度
    * param { renderHeight：number } 上下管道绘制区域的高度
    * */
    function Pipe( options ) {

        // 每创建一对管道，那么总数自增一次
        Pipe.len++;

        this.ctx = options.ctx;
        this.imgDown = options.imgDown;
        this.imgUp = options.imgUp;

        // 管道图像的宽和高
        this.imgWidth = this.imgDown.width;
        this.imgHeight = this.imgDown.height;

        // 管道上下间距和管道左右间距
        this.pipeTBSpace = options.pipeTBSpace || 150;
        this.pipeLRSpace = options.pipeLRSpace || 100;

        // 管道最小高度和最大高度
        this.minHeight = options.minHeight || 50;
        this.maxHeight = options.maxHeight || 300;
        //this.maxHeight = options.renderHeight - this.pipeTBSpace - this.minHeight;

        // 管道的坐标
        this.x = 400 + (this.imgWidth + this.pipeLRSpace) * (Pipe.len - 1);
        this.y = 0;
        this.computePipeY();

        // 管道每秒运行的初始速度&每秒加速度
        this.speedSecond = 100;
        this.accelerate = 10;
    }

    // 记录管道的数量
    Pipe.len = 0;

    // 置换原型
    Pipe.prototype = {

        constructor: Pipe,

        // 计算上下管道y轴的坐标
        // 创建管道对象的时候，需要随机生成管道的高，然后计算上下管道的y轴坐标
        // 以后管道每次走出画布，右边重新出现时还需要再次随机生成管道的高，然后计算上下管道的y轴坐标
        computePipeY: function() {

            // 随机生成上管道的高度
            var pipeUpViewHeight = util.random( this.minHeight, this.maxHeight );

            // 计算上管道的Y轴坐标
            this.downY = pipeUpViewHeight - this.imgHeight;

            // 计算下管道的Y轴坐标
            this.upY = pipeUpViewHeight + this.pipeTBSpace;
        },

        // 绘制管道
        draw: function() {
            this.ctx.drawImage( this.imgDown, this.x, this.downY );
            this.ctx.drawImage( this.imgUp, this.x, this.upY );
            this.drawPath();
        },

        // 绘制管道对应的矩形路径
        drawPath: function() {
            this.ctx.rect( this.x, this.downY, this.imgWidth, this.imgHeight );
            this.ctx.rect( this.x, this.upY, this.imgWidth, this.imgHeight );
        },

        // 更新下一次管道绘制时的数据
        update: function( delaySecond ) {

            // 总路程 = 初始速度 * 时间 + 加速度 * 时间^2 / 2
            // 最新的位置 = 当前位置 + 总路程
            this.x -= this.speedSecond * delaySecond + this.accelerate * delaySecond * delaySecond / 2;
            
            // 根据时间和加速度，更新速度
            this.speedSecond += this.accelerate * delaySecond;

            // 如果管道走出画布，向右拼接
            if( this.x < -this.imgWidth ) {
                this.x += (this.imgWidth + this.pipeLRSpace) * Pipe.len;
                this.computePipeY();
            }
        }
    };

    w.Pipe = Pipe;

}( window ));