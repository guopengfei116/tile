class Vue {

    constructor(options) {
        this.$el = options.el instanceof Element? options.el: document.querySelector(options.el);
        this.$data = options.data;
        this.$methods = options.methods;

        // 数据代理
        Object.keys(this.$data).forEach(k => this.proxyKeys(this.$data, k));
        Object.keys(this.$methods).forEach(k => this.proxyKeys(this.$methods, k));

        // 数据劫持
        Observer.observe(this.$data);

        // 模板编译
        let el = new Compile(this);

        // 挂载
        this.mount(el);
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
    mount(el) {
        if(this.$el) {
            this.befoerMounted && this.befoerMounted(this.fragment);
            this.$el.appendChild(el);
            this.mounted && this.mounted(this.fragment);
        }
    }

}
