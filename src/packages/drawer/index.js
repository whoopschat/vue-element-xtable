import drawer from "./_drawer.vue";
import { onChanged } from "../../utils/changed";

let _installed = false;
let _openDrawer = null;
let _refreshDrawer = null;
let _replaceDrawer = null;
let _closeDrawer = null;
let _backDrawer = null;

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

const Drawer = {
    backDrawer,
    closeDrawer,
    replaceDrawer,
    refreshDrawer,
    openDrawer
}

export function _installDrawer(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    const comp = Vue.extend(drawer);
    const instance = new comp();
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el);
    onChanged(() => {
        instance.handleResize();
    });
    _openDrawer = function (options) {
        instance.openDrawer(options, false);
    }
    _replaceDrawer = function (options) {
        instance.openDrawer(options, true);
    }
    _backDrawer = function () {
        instance.backDrawer(true);
    }
    _closeDrawer = function () {
        instance.closeDrawer();
    }
    _refreshDrawer = function () {
        instance.setRefresh();
    }
    Vue.prototype.$drawer = Drawer;
}

export default Drawer;
