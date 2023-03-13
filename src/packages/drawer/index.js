import drawer from "./_drawer.vue";
import { onChanged } from "../../utils/changed";

let _installed = false;
let _drawerInstance = null;
let _openDrawer = null;
let _replaceDrawer = null;
let _refreshDrawer = null;
let _resultDrawer = null;
let _closeDrawer = null;
let _backDrawer = null;

function isOpened() {
  return _drawerInstance && _drawerInstance.isOpened();
}

function openDrawer(drawerParams) {
  _openDrawer && _openDrawer(drawerParams);
}

function replaceDrawer(drawerParams) {
  _replaceDrawer && _replaceDrawer(drawerParams);
}

function backDrawer() {
  _backDrawer && _backDrawer();
}

function closeDrawer() {
  _closeDrawer && _closeDrawer();
}

function refreshDrawer() {
  _refreshDrawer && _refreshDrawer();
}

function resultDrawer(result) {
  _resultDrawer && _resultDrawer(result);
}

const Drawer = {
  isOpened,
  backDrawer,
  closeDrawer,
  replaceDrawer,
  refreshDrawer,
  resultDrawer,
  openDrawer
}

export function _installDrawer(Vue) {
  if (_installed) {
    return;
  }
  _installed = true;
  const comp = Vue.extend(drawer);
  _drawerInstance = new comp();
  _drawerInstance.$mount(document.createElement('div'))
  document.body.appendChild(_drawerInstance.$el);
  onChanged(() => {
    _drawerInstance && _drawerInstance.checkResize();
  });
  _openDrawer = function (options) {
    _drawerInstance && _drawerInstance.openDrawer(options, false);
  }
  _replaceDrawer = function (options) {
    _drawerInstance && _drawerInstance.openDrawer(options, true);
  }
  _backDrawer = function () {
    _drawerInstance && _drawerInstance.backDrawer(true);
  }
  _refreshDrawer = function () {
    _drawerInstance && _drawerInstance.setRefresh();
  }
  _resultDrawer = function (result) {
    _drawerInstance && _drawerInstance.setResult(result);
  }
  _closeDrawer = function () {
    _drawerInstance && _drawerInstance.closeDrawer();
  }
  Vue.prototype.$drawer = Drawer;
}

export default Drawer;
