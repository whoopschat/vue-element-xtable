import Drawer, { _installDrawer } from "./packages/drawer"
import Identify, { _installIdentify } from "./packages/identify"
import ImageViewer, { _installImageViewer } from "./packages/imageViewer"
import { _installResize } from "./directives/resize"
import { _installTab } from "./packages/tab"
import { _installTable } from "./packages/table"
import { _installInput } from "./packages/input"
import { _installUpload } from "./packages/upload"
import { _installPage } from "./packages/page"

let _installed = false;
let _fileUploadHandler = null;
let _dataListHandler = null;
let _dataDetailHandler = null;
let _dataConfigHandler = null;

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

export function FileUploadHandler(file, type) {
  return Promise.resolve().then(() => {
    if (_fileUploadHandler && typeof _fileUploadHandler === 'function') {
      return _fileUploadHandler(file, type);
    }
    throw "not call setFileUploadHandler";
  })
}

export function DataListHandler(apiUrl, params, options) {
  return Promise.resolve().then(() => {
    if (_dataListHandler && typeof _dataListHandler === 'function') {
      return _dataListHandler(apiUrl, params, options);
    }
    throw "not call setDataListHandler";
  })
}

export function DataDetailHandler(apiUrl, params) {
  return Promise.resolve().then(() => {
    if (_dataDetailHandler && typeof _dataDetailHandler === 'function') {
      return _dataDetailHandler(apiUrl, params);
    }
    throw "not call setDataDetailHandler";
  })
}

export function DataConfigHandler(dataType) {
  return Promise.resolve().then(() => {
    if (_dataConfigHandler && typeof _dataConfigHandler === 'function') {
      return _dataConfigHandler(dataType);
    }
    throw "not call setDataConfigHandler";
  })
}

const install = (Vue, options) => {
  if (_installed) {
    return;
  }
  _installed = true;
  Vue.prototype.$xUISize = options && options.size ? options.size : "small";
  Vue.prototype.$xUIDrawerFullScreen = options && options.drawerFullScreen;
  Vue.prototype.$xUISelectPlacement = options && options.selectPlacement ? options.selectPlacement : "top-start";
  Vue.prototype.$xUIFileUploadHandler = FileUploadHandler;
  Vue.prototype.$xUIDataListHandler = DataListHandler;
  Vue.prototype.$xUIDataDetailHandler = DataDetailHandler;
  Vue.prototype.$xUIDataConfigHandler = DataConfigHandler;
  let imageViewerOptions = options && options.imageViewerOptions;
  _installDrawer(Vue);
  _installIdentify(Vue);
  _installImageViewer(Vue, imageViewerOptions);
  _installResize(Vue);
  _installTable(Vue);
  _installInput(Vue);
  _installUpload(Vue);
  _installPage(Vue);
  _installTab(Vue);
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  setDataListHandler,
  setDataDetailHandler,
  setDataConfigHandler,
  setFileUploadHandler,
  Drawer,
  Identify,
  ImageViewer
}
