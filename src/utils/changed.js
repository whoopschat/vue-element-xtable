import { onAttachEvent } from "./event";

let _inited = false;
let _onchangeds = [];

function _handleChanged() {
    _onchangeds.forEach(changed => {
        changed && changed();
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

export function onChanged(onchanged) {
    _init();
    if (onchanged && typeof onchanged == 'function' && _onchangeds.indexOf(onchanged) < 0) {
        _onchangeds.push(onchanged);
        onchanged && onchanged();
    }
}