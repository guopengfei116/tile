(function( w ) {

    function FlappyBird( container ) {
        this.cvs = document.createElement('canvas');
        this.ctx = this.cvs.getContext('2d');
        this.cvs.width = 800;
        this.cvs.height = 600;
        this.container = w.document.querySelector( container );
        this.container.appendChild( this.cvs );

        // 游戏所需图像资源地址
        this.imgSrc = {
            bird: './imgs/birds.png',
            land: './imgs/land.png',
            pipeDown: './imgs/pipeDown.png',
            pipeUp: './imgs/pipeUp.png',
            sky: './imgs/sky.png'
        };

        // 存储所有加载好的图像资源
        this.imgs = null;

        // 游戏开关
        this.isRun = false;

        // 游戏上一次绘制时间，当前绘制时间，和两次绘制的间隔时间
        this.gameLastTime = Date.now();
        this.gameCurrentTime = Date.now();
        this.delaySecond = 0;

        // 当前绘制的场景
        this.currentScene = null;

        // 事件监听
        this.bind();
    }

    util.extend( FlappyBird.prototype, {

        // 运行游戏
        run: function() {
            var self = this;

            // 不断渲染游戏画面
            (function loop() {

                // 时事计算游戏两帧之间的刷新率
                self.gameCurrentTime = Date.now();
                self.delaySecond = ( self.gameCurrentTime - self.gameLastTime ) / 1000;
                self.gameLastTime = self.gameCurrentTime;

                // 如果游戏没有暂停，清除画布，清除路径，重新渲染新游戏画面
                if( !self.isPause ) {
                    self.ctx.clearRect( 0, 0, self.ctx.canvas.width, self.ctx.canvas.height );
                    self.ctx.beginPath();
                    self.currentScene.run( self.delaySecond );
                }

                // 小鸟没有死亡，继续
                if( self.isRun ) {
                    requestAnimationFrame( loop );
                }
            })();
        },

        // 创建游戏所需场景
        createScene: function() {
            var self = this;

            // 游戏运行场景
            this.gameScene = new GameScene( { ctx: this.ctx, imgs: this.imgs } );
            this.gameScene.subscribe( function() {
                self.end();
            } );

            // 游戏结束场景
            this.overScene = new OverScene( { ctx: this.ctx } );
            this.overScene.subscribe( function() {
                self.restart();
            });
        },

        // 开始游戏
        start: function() {
            var self = this;
            self.isRun = true;

            // 如果资源已就绪，直接运行，否则资源加载完毕后再运行
            if( self.imgs ) {
                self.currentScene = self.gameScene;
                self.run();
            }else {
                loadImg( this.imgSrc, function( loadedImg ) {
                    self.imgs = loadedImg;
                    self.createScene();
                    self.currentScene = self.gameScene;
                    self.run();
                } );
            }
        },

        // 暂停游戏 ==> 通过变量控制是否继续绘制下一帧游戏画面
        pause: function() {
            this.isPause = true;
        },

        // 结束游戏 ==> 当前场景替换为结束场景
        end: function() {
            //this.isRun = false;
            this.overScene.init();
            this.currentScene = this.overScene;
        },

        // 重新开始 ==> 初始化游戏场景，当前场景替换为游戏场景
        restart: function() {
            this.gameScene.init();
            this.currentScene = this.gameScene;
        },

        // 事件监听
        bind: function() {
            var self = this;

            // 空格键控制游戏暂停
            w.document.addEventListener('keydown', function( e ) {
                if( e.keyCode == 32 ) {
                    self.isPause = !self.isPause;
                }
            });
        }
    });

    w.FlappyBird = FlappyBird;

}( window ));
