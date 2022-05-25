import table from "./_table.vue";

let _installed = false;

export function _installTable(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    Vue.component('XTable', table);
}