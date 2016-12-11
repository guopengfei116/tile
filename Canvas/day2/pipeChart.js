(function( w ) {
    // 角度转换为弧度
    function angleToRadian( angle ) {
        return Math.PI / 180 * angle;
    }

    /*
     * constructor { PipeChart } 饼图构造函数
     * param { ctx: Context } 绘图上下文
     * param { data: Array } 绘制饼图所需的数据
     * param { x: number } 圆心x坐标
     * param { y: number } 圆心y坐标
     * param { r: number } 饼图半径
     * */
    function PipeChart( ctx, data, x, y, r ) {

        this.ctx = ctx;
        this.data = data;
        this.x = x;
        this.y = y;
        this.r = r;

        // 文字衬托线到圆的距离
        this.lineSpace = 20;

        // 扇形和文字的杨色
        this.colors = 'blue,hotpink,green,deeppink,violet,skyblue,lavender,lavenderblush'.split(',');

        // 存储所有扇形所占用的弧度
        // 存储所有扇形绘制时的起始弧度和结束弧度
        this.computedRadian = [];
        this.computedRadianPosition = [];
    }

    // 置换原型
    PipeChart.prototype = {
        constructor: PipeChart,

        /*
        * 计算每一个扇所占用的弧度
        * 计算每一个扇绘制时的起始弧度和结束弧度
        * 绘制饼图
        * */
        draw: function() {

            // 清空计算好的数据，重新计算
            this.computedRadian = [];
            this.computedRadianPosition = [];
            this.computeRadian();
            this.computeRadianPosition();

            // 绘制
            this.drawPipe();
            this.drawText();
        },

        // 根据数据计算每一个扇所占用的弧度
        computeRadian: function() {
            /*
             * 实现思路：
             * 1、求单位数据所占用的角度 ==> 360 / 数据总和
             * 2、使用单位数据所占用角度 * 每一份数据值得到每一份数据所占用的角度
             * 3、把计算好的角度使用一个数据存储起来，供其他方法使用
             * */
            var self = this;

            // 求数据总和
            var num = 0;
            this.data.forEach( function( obj ) {
                num += obj.val;
            });

            // 求单位数据所占用的弧度
            var unitRadian = Math.PI*2 / num;

            // 计算并存储每一个扇所占用的弧度
            this.data.forEach( function( obj ) {

                // 这里的this不是饼图实例，所以使用self
                self.computedRadian.push( unitRadian * obj.val );
            });
        },

        // 根据扇的弧度大小，计算该扇绘制时的起始弧度和结束弧度
        computeRadianPosition: function() {
            var self = this;

            var startRadian = 0;
            var endRadian = 0;

            // 计算并存储每一个扇绘制时的起始弧度和结束弧度
            this.computedRadian.forEach( function( val ) {

                // 当前扇形\的起始弧度 = 上一个扇形的结束弧度
                // 当前扇的结束弧度 = 上一个扇形的结束弧度 + 当前扇所占用的弧度
                startRadian = endRadian;
                endRadian = endRadian + val;
                self.computedRadianPosition.push( startRadian, endRadian );
            });
        },

        // 绘制饼图中的每一个扇形
        drawPipe: function() {

            // 根据每一个扇的起始弧度和结束弧度进行绘制
            for( var i = 0, len = this.computedRadianPosition.length; i < len; i+=2 ) {

                this.ctx.beginPath();
                this.ctx.moveTo( this.x, this.y );
                this.ctx.arc( this.x, this.y, this.r, this.computedRadianPosition[ i ], this.computedRadianPosition[ i + 1 ] );
                this.ctx.closePath();

                // 因为每次i+=2，为了能够按照顺序设置填充色，所以要i/2
                this.ctx.fillStyle = this.colors[ i / 2 ];
                this.ctx.fill();
            }
        },

        // 绘制文字和文字衬托线
        drawText: function() {

            var lineRadian = 0;
            var lineX = 0, lineY = 0;
            var text = '', textWidth = 0;

            // 遍历每一个计算好的扇起始弧度和结束弧度，
            // 求出该扇平分线的弧度，
            // 利用平分线弧度求平分线终点坐标和文字参考点坐标
            for( var i = 0, len = this.computedRadianPosition.length; i < len; i+=2 ) {

                // 当前扇形的描述文字&该文字绘制时所占用的宽
                text = this.data[i / 2].msg;
                textWidth = this.ctx.measureText( text ).width;

                // 平分线弧度 = 扇起始弧度 + 扇自身所占弧度 / 2
                lineRadian = this.computedRadianPosition[ i ] + this.computedRadian[ i / 2 ] / 2;

                /*
                 * 求平分线终点坐标：
                 * lineX: 圆心x + (r + 文字到圆的距离) * Math.cos( 平分线弧度 )
                 * lineY: 圆心y + (r + 文字到圆的距离) * Math.sin( 平分线弧度 )
                 * */
                lineX = this.x + ( this.r + this.lineSpace ) * Math.cos( lineRadian );
                lineY = this.y + ( this.r + this.lineSpace ) * Math.sin( lineRadian );

                // 画扇形平分线
                this.ctx.beginPath();
                this.ctx.moveTo( this.x, this.y );
                this.ctx.lineTo( lineX, lineY );

                // 根据左右方向画文字衬托线，设置文字水平对其方式
                if( lineRadian >= Math.PI/2 & lineRadian <= Math.PI/2*3 ) {
                    this.ctx.lineTo( lineX - textWidth, lineY );
                    this.ctx.textAlign = 'right';
                }else {
                    this.ctx.lineTo( lineX + textWidth, lineY );
                    this.ctx.textAlign = 'left';
                }

                // 设置颜色，绘制
                this.ctx.strokeStyle = this.colors[ i / 2 ];
                this.ctx.fillStyle = this.colors[ i / 2 ];
                this.ctx.stroke();
                this.ctx.fillText( text, lineX, lineY - 6 );
            }
        }
    };

    w.PipeChart = PipeChart;
}( window ));