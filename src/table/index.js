import table from "./_table.vue";

let _inited = false;
let _listHandler = null;

function setListHandler(handler) {
    if (handler && typeof handler === 'function') {
        _listHandler = handler;
    }
}

export function _installTable(Vue, options) {
    if (_inited) {
        return;
    }
    _inited = true;
    Vue.prototype.$xTableSize = options && options.size ? options.size : "mini";
    Vue.prototype.$xTableListHandler = (apiUrl, params, options) => {
        return Promise.resolve().then(() => {
            if (_listHandler && typeof _listHandler === 'function') {
                return _listHandler(apiUrl, params, options);
            }
            throw "not settting Table.setListHandler";
        })
    }
    Vue.component('XTable', table);
}

export default {
    setListHandler
}
