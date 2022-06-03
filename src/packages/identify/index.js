import identify from "./_identify.vue";

let _installed = false;
let _checkIdentify = null;

function check(callback, options) {
    _checkIdentify && _checkIdentify(callback, options);
}

const Identify = {
    check
}

export function _installIdentify(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    const comp = Vue.extend(identify);
    const instance = new comp();
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el);
    _checkIdentify = function (callback, options) {
        instance.check(callback, options);
    }
    Vue.prototype.$identify = Identify;
}

export default Identify;
