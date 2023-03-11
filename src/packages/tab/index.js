import tab from "./_tab.vue";

let _installed = false;

export function _installTab(Vue) {
  if (_installed) {
    return;
  }
  _installed = true;
  Vue.component('XTab', tab);
}