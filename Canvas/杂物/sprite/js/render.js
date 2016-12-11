function render(container, imgPath) {
    // 初始化画布
    var cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d');
    cvs.style = 'border:1px solid orangeRed';
    cvs.width = 500;
    cvs.height = 200;
    document.querySelector(container).appendChild(cvs);

    // 创建一角色
    var img = new Image();
    img.src = imgPath;
    img.addEventListener('load', function () {
        var sprite = new Sprite({
            ctx : ctx,
            img : img,
            maxFrame : 3,
            width : img.width/4,
            height : img.height/4
        });
    });
}