(function(w) {
    /**
     * 精灵类
     * @param {[object]} config [相关配置]
     */
    function RuningMan(config) {
        if (!config || !config.img || !config.frame || !config.context)
            throw new Error('参数异常.');
        this.context = config.context;
        this.img = config.img;
        this.frame = config.frame;
        this.width = config.width || this.img.width / this.frame;
        this.height = config.height || this.img.height / this.frame;
        this.curFrame = config.curFrame || 0;
        this.direction = config.direction || 0;
        this.speed = config.speed || 3;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.fps = config.fps || 6.25;

        this.timer = null;
        this.isRun = false;
        this.draw();
        this.bind();
    }
    RuningMan.prototype = {
        constructor: RuningMan,
        draw: function() {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.drawImage(this.img,
                this.width * this.curFrame, this.height * this.direction, this.width, this.height,
                this.x, this.y, this.width, this.height);
        },
        update: function() {
            var canvas;
            this.curFrame = ++this.curFrame % this.frame;
            canvas = this.context.canvas;
            switch (this.direction) {
                case 0: // down
                    this.y += this.speed;
                    this.y = this.y > canvas.height ? -this.height : this.y;
                    break;
                case 1: // this.speed
                    this.x -= this.speed;
                    this.x = this.x < -this.width ? canvas.width : this.x;
                    break;
                case 2: // right
                    this.x += this.speed;
                    this.x = this.x > canvas.width ? -this.width : this.x;
                    break;
                case 3:
                    this.y -= this.speed;
                    this.y = this.y < -this.height ? canvas.height : this.y;
                    break; // up
            }
        },
        stop: function() {
            if (this.isRun) {
                this.isRun = false;
                clearInterval(this.timer);
            }
        },
        run: function() {
            var self;
            if (this.isRun) return;
            this.isRun = true;
            self = this;
            this.timer = setInterval(function() {
                self.draw();
                self.update();
            }, 1000 / this.fps);
        },
        bind: function() {
            var self = this;
            w.document.addEventListener('keydown', function(e) {
                var keyCode = e.keyCode;

                if (keyCode === 32) {
                    if (self.isRun) self.stop();
                    else self.run();
                }

                if (!self.isRun) return;

                switch (keyCode) {
                    case 37: // left
                        self.direction = 1;
                        break;
                    case 38: // up
                        self.direction = 3;
                        break;
                    case 39: // right
                        self.direction = 2;
                        break;
                    case 40: // down
                        self.direction = 0;
                        break;
                }
            });
        }
    };
    w.RM = RuningMan;
}(window));

function render(container, imgSrc) {
    var canvas, rm, img;
    canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 240;

    document.querySelector(container).appendChild(canvas);
    img = new Image();
    img.src = imgSrc;
    img.addEventListener('load', function() {
        rm = new RM({
            context: canvas.getContext('2d'),
            img: img,
            frame: 4
        });
    });
}

render('#container', './imgs/TANK-IFV.png');
