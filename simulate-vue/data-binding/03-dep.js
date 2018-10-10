class Dep {

    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify() {
        this.subs.forEach(s => s.update());
    }
}

Dep.target = null;
