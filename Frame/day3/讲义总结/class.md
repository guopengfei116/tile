# jQuery使用

#### hasClass
- 只要有一个有那就返回true
- 只能判断一个class

#### addClass
- 可以批量添加，重复的添加会过滤

#### removeClass
- 可以批量删除

#### toggleClass
- 可以批量操作，有则删除，无则添加

# 实现思路

## 如何判断某元素是否含有某个class？
1. 获取元素的className属性值，然后首尾加空格，得到元素默认的className字符串，
这个字符串中的每个class前后都具有空格，有了共同点就可以统一处理
2. 被判断的class防止首尾多余空格所以先trim一下，
然后首尾再加空格，得到被判断的class字符串
3. 元素默认的className字符串利用indexOf方法判断是否含有某class
4. 返回结果>-1即表示含有，===-1即表示未含有。

## 如何删除某元素指定的class？
1. 获取元素的className属性值，然后首尾加空格，得到元素默认的className字符串，
这个字符串中的每个class前后都具有空格，有了共同点就可以统一处理
2. 被判断的class防止首尾多余空格所以先trim一下，
然后首尾再加空格，得到被判断的class字符串
3. 元素默认的className字符串利用replace方法替换要删除的class为空格，得到新的className
4. 新的className整体可以再trim一下去掉首尾空格

#### hasClass
1. 遍历所有的元素
2. 依次获取每一个元素的className，加工处理
3. 加工处理后使用indexOf方法判断有没有指定的class(同样加工处理)
4. 只要indexOf有一个结果>-1，就返回true
5. 否则返回false。

#### addClass
1. 传入的不是字符串，直接return this
2. 如果传入了字符串，先trim一下，然后使用split(' ')劈成数组存起来
3. 外层遍历所有的元素，
4. 内层遍历数组，得到每一个要添加的class
5. 然后依次判断每一个元素有没有要添加的class，有则忽略，没有则添加(记得空格)
6. 最后处女座可以考虑整体trim一下去掉首尾可能多余的空格
7. 链式编程返回this

#### removeClass
1. 没有传参，遍历所有的元素，清空他们的className
2. 传入的不是字符串，直接return this
3. 如果传入了字符串，先trim一下，然后使用split(' ')劈成数组存起来
4. 外层遍历所有的元素
5. 内层遍历数组
6. 遍历到的元素删除遍历到的class( 删除方式和hasClass类似 )
7. 链式编程返回this

#### toggleClass
1. 传入的不是字符串，直接return this
2. 如果传入了字符串，先trim一下，然后使用split(' ')劈成数组存起来
3. 外层遍历所有的元素
4. 内层遍历数组
5. 遍历到的元素判断遍历到的class，有则删除，没有则添加( 可以考虑复用前面方法 )
6. 链式编程返回this
