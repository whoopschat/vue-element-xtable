import upload from "./_upload.vue";

let _installed = false;

export function _installUpload(Vue) {
  if (_installed) {
    return;
  }
  _installed = true;
  Vue.component('XUpload', upload);
}