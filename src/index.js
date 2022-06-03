import Drawer, { _installDrawer } from "./packages/drawer"
import Identify, { _installIdentify } from "./packages/identify"
import { _installTable } from "./packages/table"
import { _installInput } from "./packages/input"
import { _installResize } from "./directives/resize"
import { _installPrint } from "./packages/print"
import { _installPage } from "./packages/page"

let _installed = false;
let _fileUploadHandler = null;
let _filePreviewHandler = null;
let _dataListHandler = null;
let _dataDetailHandler = null;
let _dataConfigHandler = null;

function setFilePreviewHandler(handler) {
    if (handler && typeof handler === 'function') {
        _filePreviewHandler = handler;
    }
}

function setFileUploadHandler(handler) {
    if (handler && typeof handler === 'function') {
        _fileUploadHandler = handler;
    }
}

function setDataListHandler(handler) {
    if (handler && typeof handler === 'function') {
        _dataListHandler = handler;
    }
}

function setDataDetailHandler(handler) {
    if (handler && typeof handler === 'function') {
        _dataDetailHandler = handler;
    }
}

function setDataConfigHandler(handler) {
    if (handler && typeof handler === 'function') {
        _dataConfigHandler = handler;
    }
}

const install = (Vue, options) => {
    if (_installed) {
        return;
    }
    _installed = true;
    Vue.prototype.$xUISize = options && options.size ? options.size : "mini";
    Vue.prototype.$xUIPlacement = options && options.placement ? options.placement : "top-start";
    Vue.prototype.$xUIFileUploadHandler = (file, type) => {
        return Promise.resolve().then(() => {
            if (_fileUploadHandler && typeof _fileUploadHandler === 'function') {
                return _fileUploadHandler(file, type);
            }
            throw "not call setFileUploadHandler";
        })
    }
    Vue.prototype.$xUIFilePreviewHandler = (url, type) => {
        return Promise.resolve().then(() => {
            if (_filePreviewHandler && typeof _filePreviewHandler === 'function') {
                return _filePreviewHandler(url, type);
            }
            throw "not call setFilePreviewHandler";
        })
    }
    Vue.prototype.$xUIDataListHandler = (apiUrl, params, options) => {
        return Promise.resolve().then(() => {
            if (_dataListHandler && typeof _dataListHandler === 'function') {
                return _dataListHandler(apiUrl, params, options);
            }
            throw "not call setDataListHandler";
        })
    }
    Vue.prototype.$xUIDataDetailHandler = (apiUrl, params) => {
        return Promise.resolve().then(() => {
            if (_dataDetailHandler && typeof _dataDetailHandler === 'function') {
                return _dataDetailHandler(apiUrl, params);
            }
            throw "not call setDataDetailHandler";
        })
    }
    Vue.prototype.$xUIDataConfigHandler = (dataType) => {
        return Promise.resolve().then(() => {
            if (_dataConfigHandler && typeof _dataConfigHandler === 'function') {
                return _dataConfigHandler(dataType);
            }
            throw "not call setDataConfigHandler";
        })
    }
    _installDrawer(Vue);
    _installIdentify(Vue);
    _installResize(Vue);
    _installTable(Vue);
    _installInput(Vue);
    _installPrint(Vue);
    _installPage(Vue);
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    setFilePreviewHandler,
    setFileUploadHandler,
    setDataListHandler,
    setDataDetailHandler,
    setDataConfigHandler,
    Drawer,
    Identify
}
