import input from "./_input.vue";

let _inited = false;

export function _installInput(Vue, options) {
    if (_inited) {
        return;
    }
    _inited = true;
    Vue.prototype.$xInputSize = options && options.size ? options.size : "mini";
    Vue.component('XInput', input);
}