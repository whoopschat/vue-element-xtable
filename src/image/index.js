import image from "./_image.vue";

let _inited = false;
let _uploadHandler = null;
let _previewHandler = null;

function setUploadHandler(handler) {
    if (handler && typeof handler === 'function') {
        _uploadHandler = handler;
    }
}

function setPreviewHandler(handler) {
    if (handler && typeof handler === 'function') {
        _previewHandler = handler;
    }
}

export function _installImage(Vue, options) {
    if (_inited) {
        return;
    }
    _inited = true;
    Vue.prototype.$xImageUploadHandler = (apiUrl, params, options) => {
        return Promise.resolve().then(() => {
            if (_uploadHandler && typeof _uploadHandler === 'function') {
                return _uploadHandler(apiUrl, params, options);
            }
            throw "not settting Image.setUploadHandler";
        })
    }
    Vue.prototype.$xImagePreviewHandler = (imageUrl) => {
        return Promise.resolve().then(() => {
            if (_previewHandler && typeof _previewHandler === 'function') {
                return _previewHandler(imageUrl);
            }
            throw "not settting Image.setPreviewHandler";
        })
    }
    Vue.component('XImage', image);
}

export default {
    setUploadHandler,
    setPreviewHandler
}
