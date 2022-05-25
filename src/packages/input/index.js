import input from "./_input.vue";

let _installed = false;

export function _installInput(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    Vue.component('XInput', input);
}