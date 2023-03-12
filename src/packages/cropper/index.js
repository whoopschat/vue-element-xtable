import cropper from "./_cropper.vue";

let _installed = false;
let _cropperInstance = null;
let _showCropper = null;

function showCropper(options, callback) {
  _showCropper && _showCropper(options, callback);
}

const Cropper = {
  showCropper,
}

export function _installCropper(Vue) {
  if (_installed) {
    return;
  }
  _installed = true;
  const comp = Vue.extend(cropper);
  _cropperInstance = new comp();
  _cropperInstance.$mount(document.createElement('div'))
  document.body.appendChild(_cropperInstance.$el);
  _showCropper = function (options, callback) {
    _cropperInstance && _cropperInstance.showCropper(options, callback);
  }
  Vue.prototype.$cropper = Cropper;
}

export default Cropper;