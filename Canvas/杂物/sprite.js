(function (w) {

    /*
    * 小鸟类
    * param { ctx : Context }  绘图上下文
    * param { img : Image }  图片资源
    * param { maxFrame : number }  最大帧
    * param { x : number }  精灵渲染到画布的x轴坐标
    * param { y : number }  精灵渲染到画布的y轴坐标
    * param { sizeW : number }  精灵渲染时候的宽
    * param { sizeH : number }  精灵渲染时候的高
    * param { index : number }  精灵渲染到画布时的第一帧
    * param { speed : number }  精灵运动的速度
    * */
    function Sprite(ctx, img, maxFrame, x, y, width, height, speed) {
        this.ctx = ctx;
        this.img = img;
        this.maxFrame = maxFrame;
        this.x = x;
        this.y = y;
        this.initialY = this.y;
        this.width = width;
        this.height = height;
        this.speed = speed || 5;
        this.speedPlus = 0.2;  // 加减速度
        this.maxJumpHeight = 80;  // 最大跳跃高度
        this.jumpHeight = 0;  // 当前跳跃高度
        this.index = 0; // 恐龙初始帧
        this._bind();
    }

    // 给Sprite原型扩充方法
    util.extend(Sprite.prototype, {

        // 把小鸟绘制到画布上
        draw: function () {

            // 绘制旋转的小鸟
            this.ctx.drawImage(this.img,
                this.width * this.index, 0, this.width, this.height,
                this.x, this.y, this.width, this.height);
        },

        // 更新小鸟下一帧的数据
        update: function () {

            // 刷新动画帧数
            this.index = ++this.index > this.maxFrame? 0 : this.index;

            // 是否跳跃中
            if (this.isJump) {
                this.y -= this.speed;  // 刷新y轴显示坐标
                this.speed -= this.speedPlus;  // 减缓上跳速度，加快下降速度

                // 停止跳跃
                if (this.y >= this.initialY) {
                    this.y = this.initialY;
                    this.speed = 5;
                    this.isJump = false;
                }

                // 跳跃时显示第0帧图像
                this.index = 0;
            }

            /*// 是否跳跃中
            if (this.isJump) {

                // 如果已到达最大跳跃高度，则下降；否则上跳
                if (this.jumpHeight >= this.maxJumpHeight) {
                    this.speed = 4;
                    this.y += this.speed;  // 刷新y轴显示坐标

                    // 停止跳跃
                    if (this.y >= this.initialY) {
                        this.y = this.initialY;
                        this.jumpHeight = 0;
                        this.speed = 4;
                        this.isJump = false;
                    }
                }else {
                    this.jumpHeight += this.speed; // 记录已跳跃高度
                    this.y -= this.speed;  // 刷新y轴显示坐标
                }

                this.speed += this.speedPlus;  // 减缓上跳速度，加快下降速度
            }*/
        },

        // 绑定点击事件
        _bind: function () {

            // 先缓存一下当前的this
            var self = this;

            // 监听上跳事件
            document.addEventListener('keydown', function (e) {
                if (e.keyCode == 38) {
                    self.isJump = true;
                }
            });
        }
    });

    // 公开到全局
    w.Sprite = Sprite;

}(window));
