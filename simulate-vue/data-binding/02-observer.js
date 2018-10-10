class Observer {

    constructor(data) {
        this.data = data;
        this.walt(data);
    }
    
    static observe(value) {
        if(!value || typeof value !== "object") return;
        
        return new Observer(value);
    }

    walt(data) {
        Object.keys(data).forEach(k => this.defineReactive(data, k, data[k]));
    }

    defineReactive(data, key, val) {
        let dep = new Dep();
        let that = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                if(Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set(newVal) {
                if(newVal === val) return;
                val = newVal;
                Observer.observe(newVal);
                dep.notify();
            }
        })
    }
}
