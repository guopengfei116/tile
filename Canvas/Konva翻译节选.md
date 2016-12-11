#形状/Shape

## 矩形/Rect

矩形的创建：
	
	var rect = new Konva.Rect({
		// 定位属性，左上宽高
	    x: 50,
	    y: 50,
	    width: 100,
	    height: 50,
		// 样式属性
	    fill: 'green', // 填充色
	    stroke: 'black', // 描边色
	    strokeWidth: 4 // 描边宽度
	});

## 线/Line

线的创建：

    var redLine = new Konva.Line({
		// 定位属性，每两个数值决定一个点
    	points: [5, 70, 140, 23, 250, 60, 300, 20],

		// 样式属性
    	stroke: 'red', 
    	strokeWidth: 15,
    	lineCap: 'round', // 即线条的起点和终点的样式
    	lineJoin: 'round', // 每个折点的样式
		dash: [33, 10], // 虚线样式，这里指每隔33个单位，有10个单位的间隔

		// 闭合，可以用于绘制不规则多边形
		fill: '#00D2FF',
		closed : true,

		// 平滑度 越低过渡越平滑
		tension : 1,
    });

## 图片/Image

      var img = new Konva.Image({
		// 定位属性
      	x: 50,
      	y: 50,
      	width: 106,
      	height: 118,

		// 资源属性 接收一个Image对象（标签）
      	image: imageObj,
      });

## 文字/Text

	var simpleText = new Konva.Text({
		// 定位属性
      	x: stage.getWidth() / 2,
      	y: 15,
		
		// 文本内容
      	text: 'Simple Text',

		// 字体样式
      	fontSize: 30, // 字体大小
      	fontFamily: 'Calibri', // 字体
      	fill: 'green' // 填充颜色
    });

# 事件/Event

## 绑定事件

    obj.on('click', function() {
		...
    });

    obj.on('tap.s', function() {
		...
    });

## 移除事件

	obj.off('click')
	obj.off('.s')

## 判定区域

形状可以为hitFunc属性添加一个函数，用于自定义一个形状的点击判定区域。

	hitFunc: function(context) {
        context.beginPath();
        context.arc(0, 0, this.getOuterRadius() + 10, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStrokeShape(this);
    }

# 动画

## Tween动画

### 创建

    var tween = new Konva.Tween({
        node: rect, // 目标节点
        duration: 1, // 动画时间
		
		// 结束时的属性
        x: 140,
        y: 90,
        fill : 'red',
        rotation: Math.PI * 2,
        opacity: 1,
        strokeWidth: 6,
        scaleX: 1.5，

		// 动画结束时的回调
		onFinish:finishFn
    });

### 控制

tween对象自带六种方法，用于控制动画播放：

`play()`播放, `pause()`暂停, `reverse()`反转, `reset()`重置, `finish()`结束

## Animation动画

### 创建

Animation动画，实际上就是浏览器通知开发者进行绘制，并提供当前的时间。

	var anim = new Konva.Animation(function(frame) {
	  var time = frame.time, // 动画执行的总时间
	      timeDiff = frame.timeDiff, // 距离上一帧的时间
	      frameRate = frame.frameRate; // 帧率（既1000/间隔时间）
	   // update stuff
	}, layer);
	
	anim.start();

### 控制

animation对象提供start()和stop()两个方法。