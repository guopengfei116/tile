class Compile {

    constructor(vm) {
        this.vm = vm;
        this.fragment = null;
        return this.init();
    }

    init() {
        let el = null;

        // 模板获取
        if(this.vm.render) {
            el = this.vm.render();
        } else if(this.vm.template) {
            el = this.parseHTML(this.vm.template);
        } else {
            el = this.vm.$el;
        }

        // 编译
        this.fragment = this.nodeToFragment(el);
        this.compileElement(this.fragment);

        return this.fragment;
    }

    // 模板放置到内存碎片，防止DOM操作引起重绘
    nodeToFragment(el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while(child) {
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    }

    compileElement(el) {
        [].slice.call(el.childNodes).forEach(node => {
            let reg = /\{\{\s*([^\s]*)\s*\}\}/;
            let text = node.textContent;

            if(this.isElementNode(node)) {
                this.compile(node);
            }else if(this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1]);
            }

            if(node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        })
    }

    compile(node) {
        [].forEach.call(node.attributes, attr => {
            let attrName = attr.name;
            if(this.isDirective(attrName)) {
                let exp = attr.value;
                let dir = attrName.substring(2);
                if(this.isEventDirective(dir)) {
                    this.compileEvent(node, this.vm, exp, dir);
                }else if(this.isModelDirective(dir)) {
                    this.compileModel(node, this.vm, exp, dir)
                }else {
                    this.compileOther(node, this.vm, exp, dir);
                }
            }
        });
    }

    // "xx{{a}}xx"的问题
    compileText(node, exp) {
        let that = this;
        let initText = this.vm[exp];
        this.updateText(node, initText);

        new Watcher(this.vm, exp, function(value) {
            that.updateText(node, value);
        });
    }

    compileEvent(node, vm, exp, dir) {
        let eventType = dir.split(":")[1];
        let cb = vm[exp];

        if(eventType && typeof cb === "function") {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    }

    compileModel(node, vm, exp) {
        let that = this;
        let val = this.vm[exp];
        this.modelUpdater(node, val);

        new Watcher(this.vm, exp, function(value) {
            that.modelUpdater(node, value);
        });

        node.addEventListener("input", function(e) {
            let newValue = e.target.value;
            if(val === newValue) return;

            that.vm[exp] = newValue;
            val = newValue;
        });
    }

    parseHTML(html) {
        let tempDiv = document.createElement();
        tempDiv.innerHTML = html;
        return tempDiv.children[0];
    }

    updateText(node, value) {
        node.textContent = typeof value === "undefined"? "": value;
    }

    modelUpdater(node, value) {
        node.value = typeof value === "undefined"? "": value;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }

    isTextNode(node) {
        return node.nodeType === 3;
    }

    isDirective(attr) {
        return attr.indexOf("v-") === 0 || attr.indexOf(":") === 0 || attr.indexOf("@") === 0;
    }

    isEventDirective(dir) {
        return dir.indexOf("on:") === 0 || dir.indexOf("@") === 0;
    }

    isModelDirective(dir) {
        return dir.indexOf("model") === 0;
    }
}
