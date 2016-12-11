(function( w ) {
    /*
     * constructor { LineChart } 折线图构造函数
     * param { ctx: Context } 绘图上下文
     * param { paddingArr: Array } 折线图到画布四边的距离，存储顺序为上右下左
     * param { arrowArr: Array } 折线图中箭头的宽和高
     * param { data: Array } 存储了折线图中所需的数据
     * */
    function LineChart( ctx, paddingArr, arrowArr, data ) {
        this.ctx = ctx;
        this.paddingArr = paddingArr;

        this.arrowArr = arrowArr;
        this.arrowWidth = this.arrowArr[0];
        this.arrowHeight = this.arrowArr[1];

        this.data = data;

        // 计算上顶点的坐标
        this.vertexTop = {
            x: this.paddingArr[ 3 ],
            y: this.paddingArr[ 0 ]
        };

        // 计算原点的坐标
        this.origin = {
            x: this.paddingArr[ 3 ],
            y: this.ctx.canvas.height - this.paddingArr[ 2 ]
        };

        // 计算右顶点的坐标
        this.vertexRight = {
            x: this.ctx.canvas.width - this.paddingArr[ 1 ],
            y: this.ctx.canvas.height - this.paddingArr[ 2 ]
        };

        // 根据数据得到对应的坐标
        // this.processData();
    }

// 置换原型
    LineChart.prototype = {

        constructor: LineChart,

        /*
        * 计算每一个点的坐标
        * 绘制折线图
        * */
        draw: function() {

            // 计算坐标
            this.processData();

            // 绘制
            this.drawCoordinate();
            this.drawArrow();
            this.drawPoint();
            this.drawLine();
        },

        // 绘制坐标轴中的两条线
        drawCoordinate: function() {
            this.ctx.beginPath();
            this.ctx.moveTo( this.vertexTop.x, this.vertexTop.y );
            this.ctx.lineTo( this.origin.x, this.origin.y );
            this.ctx.lineTo( this.vertexRight.x, this.vertexRight.y );
            this.ctx.stroke();
        },

        // 绘制坐标轴中的两个箭头
        drawArrow: function() {

            // 先绘制上面箭头
            this.ctx.beginPath();
            this.ctx.moveTo( this.vertexTop.x, this.vertexTop.y );
            this.ctx.lineTo( this.vertexTop.x - this.arrowWidth / 2, this.vertexTop.y + this.arrowHeight );
            this.ctx.lineTo( this.vertexTop.x, this.vertexTop.y + this.arrowHeight / 2 );
            this.ctx.lineTo( this.vertexTop.x + this.arrowWidth / 2, this.vertexTop.y + this.arrowHeight );
            this.ctx.closePath();
            this.ctx.stroke();

            // 再绘制右面箭头
            this.ctx.beginPath();
            this.ctx.moveTo( this.vertexRight.x, this.vertexRight.y );
            this.ctx.lineTo( this.vertexRight.x - this.arrowHeight, this.vertexRight.y - this.arrowWidth / 2 );
            this.ctx.lineTo( this.vertexRight.x - this.arrowHeight / 2, this.vertexRight.y );
            this.ctx.lineTo( this.vertexRight.x - this.arrowHeight, this.vertexRight.y + this.arrowWidth / 2 );
            this.ctx.closePath();
            this.ctx.stroke();
        },

        // 把传入进来的数据转化为对应画布的坐标
        processData: function() {

            // 用来存储转换后的坐标数据
            this.processArr = [];

            // 计算x轴可表示的刻度范围
            this.rangeX = this.ctx.canvas.width - this.paddingArr[3] - this.paddingArr[1] - this.arrowArr[1];
            // 计算单位数据占用多少x轴
            this.unitX = this.rangeX / (this.data.length - 1);

            // 计算y轴可表示的刻度范围
            this.rangeY = this.ctx.canvas.height - this.paddingArr[0] - this.paddingArr[2] - this.arrowArr[1];
            // 计算单位数据占用多少y轴
            this.unitY = this.rangeY / Math.max.apply( null, this.data );

            // 遍历所有的数据，依次转换为对应的坐标
            for( var i = 0, len = this.data.length; i < len; i++ ) {
                /*
                 * 数据转化为相当于画布的坐标：
                 * canvasX = this.origin.x + this.unitX * i
                 * canvasY = this.origin.y - this.unitY * y
                 * */
                this.processArr.push( this.origin.x + this.unitX * i );
                this.processArr.push( this.origin.y - this.unitY * this.data[ i ] );
            }
        },

        // 根据数据绘制相应的点
        drawPoint: function() {
            var r = 4;

            // 遍历所有的坐标，依次绘制点
            for( var i = 0, len = this.processArr.length; i < len; i+=2 ) {
                this.ctx.beginPath();
                this.ctx.arc( this.processArr[ i ], this.processArr[ i + 1 ], r, 0, Math.PI*2 );
                this.ctx.fill();
            }
        },

        // 根据数据绘制折线
        drawLine: function() {
            this.ctx.beginPath();
            for( var i = 0, len = this.processArr.length; i < len; i+=2 ) {
                this.ctx.lineTo( this.processArr[ i ], this.processArr[ i + 1 ] );
            }
            this.ctx.stroke();
        }
    };

    w.LineChart = LineChart;
}( window ));