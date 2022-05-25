import page from "./_page.vue";

let _installed = false;

export function _installPage(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    Vue.component('XPage', page);
}