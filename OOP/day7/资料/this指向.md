## 函数内this的指向

1. 函数直接调用this指向window
2. 方法方式调用this指向调用这个方法的对象
(dom中事件绑定的函数，就是这种调用方式，所以this指向对应的dom对象)
3. 构造函数方式调用this指向新创建的对象
4. call调用this指向call指定的对象，如果没有指定就是window
