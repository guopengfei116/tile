class Vue {

    static nothing() {}

    constructor(options) {
        this.$data = options.data;
        this.$methods = options.methods;

        // 数据代理
        options.beforeCreate && options.beforeCreate.call(this);
        Object.keys(this.$data).forEach(k => this.proxyKeys(this.$data, k));
        Object.keys(this.$methods).forEach(k => this.proxyKeys(this.$methods, k));

        // 数据劫持
        Observer.observe(this.$data);
        options.created && options.created.call(this);
        
        // 模板编译
        this.$el = options.el instanceof Element? options.el: document.querySelector(options.el);
        options.beforeMount && options.beforeMount.call(this, this.fragment);
        let html = new Compile(this);

        // 挂载
        this.$el && this.mount(html);
        options.mounted && options.mounted.call(this, this.fragment);
    }

    proxyKeys(data, key) {
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get() {
                return data[key];
            },
            set(newVal) {
                data[key] = newVal;
            }
        });
    }

    // 挂载
    mount(html) {
        this.$el.appendChild(html);
    }

}
