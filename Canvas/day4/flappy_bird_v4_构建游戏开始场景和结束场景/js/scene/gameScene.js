(function( w ) {

    /*
     * constructor { GameScene } 游戏场景
     * param { ctx: Context } 绘图环境
     * param { imgs: Object } 创建角色所需的图像资源
     * */
    function GameScene( options ) {

        this.ctx = options.ctx;
        this.imgs = options.imgs;

        // 所有的游戏角色
        this.roles = [];

        // 初始化该场景的数据
        this.init();

        // 所有小鸟死亡的订阅者
        this.subLish = [];
    }

    // 给原型混入方法
    util.extend( GameScene.prototype, {

        // 初始化游戏场景，为了重新开始游戏所准备
        init: function() {
            this.roles = [];
            Sky.len = 0;
            Pipe.len = 0;
            Land.len = 0;

            this.createRoles();
        },

        // 创建所有角色
        createRoles: function() {

            // 创建2个背景对象
            for( var i = 0; i < 2; i++ ) {
                this.roles.push( new Sky( { ctx: this.ctx, img: this.imgs.sky } ) );
            }

            // 创建7个管道对象
            for( var i = 0; i < 7; i++ ) {
                this.roles.push(new Pipe( { ctx: this.ctx, imgDown: this.imgs.pipeDown, imgUp: this.imgs.pipeUp,
                    pipeTBSpace: 150, pipeLRSpace: 100, minHeight: 50,
                    maxHeight: this.ctx.canvas.height - this.imgs.land.height - 50 - 150 } ));
            }

            // 创建4个大地对象
            for( var i = 0; i < 4; i++ ) {
                this.roles.push( new Land( { ctx: this.ctx, img: this.imgs.land } ) );
            }

            // 创建1个计时器对象
            this.roles.push( new Timer( { ctx: this.ctx } ) );

            // 创建1个鸟对象
            this.roles.push( new Bird( { ctx: this.ctx, img: this.imgs.bird, widthFrame: 3, heightFrame: 1 } ) );
        },

        // 运行该场景
        run: function( delaySecond ) {

            this.roles.forEach( function( role ) {
                role.draw();
                role.update( delaySecond );
            });

            // 判断小鸟是否死亡，死亡则发布消息通知
            if( this.isBirdDie() ) {
                this.publish();
            }
        },

        // 判断小鸟是否死亡
        isBirdDie: function() {
            var bird = this.roles[ this.roles.length - 1 ];
            var birdCoreX = bird.x + bird.width / 2;
            var birdCoreY = bird.y + bird.height / 2;
            if( this.ctx.isPointInPath( birdCoreX, birdCoreY ) || birdCoreY < 0 ||
                birdCoreY > (this.ctx.canvas.height - this.imgs.land.height) ) {
                return true;
            }
            return false;
        },

        // 订阅小鸟死亡的消息
        subscribe: function( fn ) {
            this.subLish.push( fn );
        },

        // 发布小鸟死亡的消息，通知每一个订阅者
        publish: function() {
            this.subLish.forEach( function( fn ) {
                fn();
            });
        }
    });

    w.GameScene = GameScene;

}( window ));
