(function (w) {
    /*
     * 精灵类
     * param { options : Object }  以下配置项
     * options { ctx : Object }  绘图上下文
     * options { img : Image }  精灵图
     * options { maxFrame : number }  每个动作的最大帧，从0开始计算
     * options { curFrame : number }  当前动作的第几帧，默认从第0帧开始
     * options { action : number }  当前第几个动作，默认从第0个开始
     * options { width : number }  一帧宽度
     * options { height : number }  一帧高度
     * options { x : number }  x轴坐标
     * options { y : number }  y轴坐标
     * options { renderWidth : number }  一帧渲染时的宽
     * options { renderHeight : number }  一帧渲染时的高
     * options { speed : number }  行走速度
     * */
    function Sprite(options) {
        this.ctx = options.ctx;
        this.img = options.img;
        this.maxFrame = options.maxFrame;
        this.curFrame = options.curFrame || 0;
        this.action = options.curFrame || 0;
        this.width = options.width;
        this.height = options.height;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.renderWidth = options.renderWidth || this.width;
        this.renderHeight = options.renderHeight || this.height;
        this.speed = options.speed || 3;

        this.timer = null;
        this.isRun = false;

        this._bind();
        this.draw();
    }

    // 给精灵类的原型扩展方法
    Sprite.prototype = {
        constructor: Sprite,

        // 开始走动
        run: function () {
            this.isRun = true;
            var self = this;
            this.timer = setInterval(function () {
                self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
                self.draw();
                self.update();
            }, 80);
        },

        // 停止走动
        stop: function () {
            this.isRun = false;
            clearInterval(this.timer);
        },

        // 绘制精灵某一个动作的某一帧，绘制到画布指定的位置，并指定其大小
        draw: function () {
            this.ctx.drawImage(this.img,
                this.width * this.curFrame, this.height * this.action,  this.width, this.height,
                this.x, this.y, this.renderWidth, this.renderHeight);
        },

        // 更新精灵下一帧所需的数据
        update: function () {

            // 为了让精灵动起来，所以让当前绘制的帧不断自增轮回
            this.curFrame = ++this.curFrame > this.maxFrame? 0 : this.curFrame;

            // 根据动作上下左右走，走出画布则从画布的反方向再走出来
            switch (this.action) {
                case 0:  // 下
                    this.y += this.speed;
                    this.y = this.y > this.ctx.canvas.height? -this.height : this.y;
                    break;
                case 1:  // 左
                    this.x -= this.speed;
                    this.x = this.x < -this.width? this.ctx.canvas.width : this.x;
                    break;
                case 2: // 右
                    this.x += this.speed;
                    this.x = this.x > this.ctx.canvas.width? -this.width : this.x;
                    break;
                case 3:  // 上
                    this.y -= this.speed;
                    this.y = this.y < -this.height? this.ctx.canvas.height : this.y;
                    break;
            }
        },

        // 方向事件绑定
        _bind: function () {
            var self = this;
            document.addEventListener('keydown', function (e) {

                // 开始暂停
                if (e.keyCode == 32) {
                    if (self.isRun) {
                        self.stop();
                    }else {
                        self.run();
                    }
                }

                // 如果为停止状态，则拒绝修改角色方向
                if (!self.isRun) {
                    return;
                }

                // 修改角色动作（方向的对应关系根据图片资源而定）
                switch (e.keyCode) {
                    case 37 :
                        self.action = 1;
                        break;
                    case 38 :
                        self.action = 3;
                        break;
                    case 39 :
                        self.action = 2;
                        break;
                    case 40 :
                        self.action = 0;
                        break;
                }
            });
        }
    };

    // 把Sprite构造函数暴漏到全局
    w.Sprite = Sprite;

}(window));
