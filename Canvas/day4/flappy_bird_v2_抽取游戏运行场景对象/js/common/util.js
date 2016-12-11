var util = {

    // 角度转换为弧度
    angleToRadian: function( angle ) {
        return Math.PI / 180 * angle;
    },

    // 随机生成指定范围内的随机数
    random: function( min, max ) {

        // 最小值，因为+min保证了
        // 最大值，因为*max保证了
        // 但是又*又+，最终的最大值会多了一个min，所以max要去min
        return Math.random() * (max - min) + min
    },

    // 混入（copy）继承
    extend: function( o1, o2 ) {
        for ( var key in o2 ) {
            if ( o2.hasOwnProperty( key ) ) {
                o1[ key ] = o2[ key ];
            }
        }
    },
};