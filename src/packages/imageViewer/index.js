import AIV from 'awesome-image-viewer'

let _installed = false;
let _defaultOptions = {};

function showImage(options = {}) {
  if (options.images && options.images instanceof Array) {
    options.images = options.images.map((image) => {
      if (typeof image === 'string') {
        return {
          mainUrl: image
        }
      } else {
        return image;
      }
    })
  }
  return new AIV(Object.assign({}, _defaultOptions, options));
}

const ImageViewer = {
  showImage
}

export function _installImageViewer(Vue, defOptions) {
  if (_installed) {
    return;
  }
  _installed = true;
  _defaultOptions = defOptions || {};
  Vue.prototype.$imageViewer = ImageViewer;
}

export default ImageViewer;
