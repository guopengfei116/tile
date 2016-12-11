/*
 * 因为传入的是一批图像的地址，
 * 返回的也是一批加载好的图像，
 * 所以src的数据结构是这个样式的：{ name1: src1, name2: src2... }
 * 返回给调用者的数据结构是这个样子的：{ name1: img1, name2: img2... }
 * */
function loadImg( src, fn ) {
    /*
     * 实现思路：
     * 1、遍历得到所有的src地址
     * 2、依据遍历到的每一个src，创建对应的img，然后把新创建的img存储到一个返回结果对象中
     * 3、创建每一个img时监听onload事件，只要有一个img加载完毕了，那么就记录一下，
     * 每次记录完毕后，判断(已经加载的总数)有没有达到(要加载的总数)，如果达到了，
     * 那么指定回调，把所有已经加载好的图片传入给对方使用。
     * */

    var key;
    var tempImg, resultImg = {};
    var loadedTotal = 0, total = 0;

    for( key in src ) {

        // 求要加载图片的总数
        total++;

        // 创建对应的img
        tempImg = new Image();
        tempImg.src = src[ key ];

        // 存储起来
        resultImg[ key ] = tempImg;

        // 为了保证所有img加载完毕后，执行回调，必须要监听每一个img的onload事件
        tempImg.onload = function() {

            if( ++loadedTotal >= total ) {
                fn( resultImg );
            }
        };
    }
}