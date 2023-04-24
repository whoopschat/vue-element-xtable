import drawer from "./_drawer.vue";
import { onChanged } from "../../utils/changed";

let _installed = false;
let _drawerComp = null;
let _drawerInstances = [];
let _openDrawer = null;
let _replaceDrawer = null;
let _refreshDrawer = null;
let _resultDrawer = null;
let _closeDrawer = null;
let _backDrawer = null;

function isOpened() {
  return _drawerInstance && _drawerInstance.isOpened();
}

function openDrawer(drawerParams, newDrawer) {
  _openDrawer && _openDrawer(drawerParams, newDrawer);
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

function getInstance(create) {
  if (create || !_drawerInstances || _drawerInstances.length <= 0) {
    let instance = new _drawerComp();
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el);
    instance.setCloseCallback(() => {
      let index = _drawerInstances.indexOf(instance);
      _drawerInstances.splice(index, 1);
      document.body.removeChild(instance.$el);
    })
    _drawerInstances.push(instance);
    return instance;
  }
  return _drawerInstances[_drawerInstances.length - 1];
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
  _drawerComp = Vue.extend(drawer);
  _openDrawer = function (options, newDrawer) {
    getInstance(newDrawer).openDrawer(options, false);
  }
  _replaceDrawer = function (options) {
    getInstance().openDrawer(options, true);
  }
  _backDrawer = function () {
    getInstance().backDrawer(true);
  }
  _refreshDrawer = function () {
    _drawerInstances.forEach(instance => {
      instance.setChanged();
    });
  }
  _resultDrawer = function (result) {
    _drawerInstances.forEach(instance => {
      instance.setResult(result);
    });
  }
  _closeDrawer = function () {
    _drawerInstances.forEach(instance => {
      instance.closeDrawer();
    });
  }
  onChanged(() => {
    _drawerInstances.forEach(instance => {
      instance.checkResize();
    });
  });
  Vue.prototype.$drawer = Drawer;
}

export default Drawer;
