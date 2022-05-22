import drawer from "./_drawer.vue";

let _inited = false;
let _showDrawer = null;
let _closeDrawer = null;
let _refreshDrawer = null;
let _backDrawer = null;

function openDrawer(drawerParams) {
    _showDrawer && _showDrawer(drawerParams);
}

function closeDrawer() {
    _closeDrawer && _closeDrawer();
}

function backDrawer() {
    _backDrawer && _backDrawer();
}

function refreshDrawer() {
    _refreshDrawer && _refreshDrawer();
}

const Drawer = {
    backDrawer,
    closeDrawer,
    refreshDrawer,
    openDrawer
}

export function _installDrawer(Vue) {
    if (_inited) {
        return;
    }
    _inited = true;
    const comp = Vue.extend(drawer);
    const instance = new comp();
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el);
    _showDrawer = function (options) {
        instance.showDrawer(options);
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
