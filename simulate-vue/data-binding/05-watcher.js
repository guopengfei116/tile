class Watcher {
    
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.value = this.get();
    }

    update() {
        this.run();
    }

    run() {
        let value = this.vm.$data[this.exp];
        let oldval = this.value;
        if(value !== oldval) {
            this.value = value;
            this.cb.call(this.vm, value, oldval);
        }
    }

    get() {
        Dep.target = this;
        let value = this.vm.$data[this.exp];
        Dep.target = null;
        return value;
    }
}
