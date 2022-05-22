import address from "./_address.vue";

let _inited = false;

export function _installAddress(Vue) {
    if (_inited) {
        return;
    }
    _inited = true;
    Vue.component('XAddress', address);
}
