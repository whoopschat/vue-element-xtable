import select from "./_select.vue";

let _inited = false;
let _detailHandler = null;
let _configHandler = null;

function setDetailHandler(handler) {
    if (handler && typeof handler === 'function') {
        _detailHandler = handler;
    }
}

function setConfigHandler(handler) {
    if (handler && typeof handler === 'function') {
        _configHandler = handler;
    }
}

export function _installSelect(Vue, options) {
    if (_inited) {
        return;
    }
    _inited = true;
    Vue.prototype.$xSelectSize = options && options.size ? options.size : "mini";
    Vue.prototype.$xSelectDetailHandler = (apiUrl, params) => {
        return Promise.resolve().then(() => {
            if (_detailHandler && typeof _detailHandler === 'function') {
                return _detailHandler(apiUrl, params);
            }
            throw "not settting Select.setSelectDetailHandler";
        })
    }
    Vue.prototype.$xSelectConfigHandler = (dataType) => {
        return Promise.resolve().then(() => {
            if (_configHandler && typeof _configHandler === 'function') {
                return _configHandler(dataType);
            }
            throw "not settting Select.setSelectConfigHandler";
        })
    }
    Vue.component('XSelect', select);
}

export default {
    setDetailHandler,
    setConfigHandler
}
