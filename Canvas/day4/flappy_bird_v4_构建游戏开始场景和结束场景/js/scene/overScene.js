(function( w ) {

    /*
     * constructor { OverScene } 结束场景
     * param { options: Object } 参数配置
     * param { options.ctx: Context } 绘图环境
     * param { options.text: string } 提示语
     * param { options.btnText: string } 按钮提示语
     * */
    function OverScene( options ) {

        this.ctx = options.ctx;
        this.text = options.text || 'GAME OVER!';
        this.btnText = options.btnText || '重新开始';

        // 提示语大小和坐标
        this.font = '900 30px 微软雅黑';
        this.textX = 0;
        this.textY = 0;

        // 按钮大小和坐标
        this.btnWidth = 400;
        this.btnHeight = 100;
        this.btnFont = '900 50px 微软雅黑';
        this.btnX = 0;
        this.btnY = 0;

        // 所有重新开始游戏按钮点击的订阅者
        this.subLish = [];

        this.base64 = null;

        this.computeBtnTextCoord();
    }

    util.extend( OverScene.prototype, {

        // 初始化，取一张游戏截取结束背景
        init: function() {
            this.base64 = this.ctx.canvas.toDataURL( 'image/png' );
            this.ctx.canvas.style.backgroundImage = 'url(' + this.base64 + ')';
        },

        // 计算按钮和文字的坐标
        computeBtnTextCoord: function() {

            // 画布中心
            var gameCenterX = this.ctx.canvas.width / 2,
                gameCenterY = this.ctx.canvas.height / 2;

            // 按钮绘制在画布正中间
            this.btnX = gameCenterX - this.btnWidth / 2;
            this.btnY = gameCenterY - this.btnHeight / 2;

            // 提示语绘制在按钮上面
            this.textX = gameCenterX;
            this.textY = this.btnY - 50;
        },

        // 绘制该场景
        run: function() {
            this.ctx.save();

            // 绘制一个遮盖层
            this.ctx.fillStyle = 'rgba( 100, 100, 100, 0.7 )';
            this.ctx.fillRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height );

            // 绘制文字
            this.ctx.font = this.font;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillStyle = 'orange';
            this.ctx.fillText( this.text, this.textX, this.textY );

            // 绘制按钮
            this.ctx.strokeStyle = 'deeppink';
            this.ctx.fillStyle = 'deeppink';
            this.ctx.lineWidth = 4;
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeRect( this.btnX, this.btnY, this.btnWidth, this.btnHeight );
            this.ctx.fillText( this.btnText, this.btnX + this.btnWidth / 2, this.btnY + this.btnHeight / 2 );

            this.ctx.restore();
            this.bind();
        },

        // 重新开始按钮点击事件
        bind: function() {
            var self = this;

            // 防止重复的事件绑定
            if( this.isBind ) {
                return;
            }

            this.isBind = true;
            this.ctx.canvas.addEventListener('click', function handle( e ) {

                // 求鼠标点击时相对于画布的路径
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;

                // 画按钮对应的矩形路径
                self.ctx.rect( self.btnX, self.btnY, self.btnWidth, self.btnHeight );

                // 判断鼠标是否点中按钮，点中则取消事件绑定，触发退场事件
                if ( self.ctx.isPointInPath( mouseX, mouseY ) ) {
                    self.ctx.canvas.removeEventListener( 'click', handle );
                    self.publish();
                    self.isBind = false;
                }
            });
        },

        // 订阅重新开始游戏按钮点击消息
        subscribe: function( fn ) {
            this.subLish.push( fn );
        },

        // 发布重新开始游戏按钮点击消息
        publish: function() {
            this.subLish.forEach( function( fn ) {
                fn();
            });
        }
    });

    w.OverScene = OverScene;

}( window ));