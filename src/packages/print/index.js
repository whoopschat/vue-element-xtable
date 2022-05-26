import print from "./_print.vue";

let _installed = false;

export function _installPrint(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    Vue.component('XPrint', print);
}