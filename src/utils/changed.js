import { onAttachEvent } from "./event";

let _inited = false;
let _callbacks = [];

function _handleChanged() {
  _callbacks.forEach(callback => {
    callback && callback();
  });
}

function _init() {
  if (_inited) {
    return;
  }
  _inited = true;
  onAttachEvent(window, 'touchmove', _handleChanged);
  onAttachEvent(window, 'scroll', _handleChanged);
  onAttachEvent(window, 'resize', _handleChanged);
  onAttachEvent(document, 'DOMContentLoaded', _handleChanged);
}

export function offChanged(callback) {
  if (callback && typeof callback == 'function') {
    let index = _callbacks.indexOf(callback);
    if (index >= 0) {
      _callbacks.splice(index, 1);
    }
  }
}

export function onChanged(callback) {
  _init();
  if (callback && typeof callback == 'function' && _callbacks.indexOf(callback) < 0) {
    _callbacks.push(callback);
    callback && callback();
  }
}