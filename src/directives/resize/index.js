import { addDirective } from "../../utils/directive";
import { get, set, del } from "../../utils/binding";
import { onChanged } from "../../utils/changed";

let _installed = false;
let _els = [];

export function _installResize(Vue) {
    if (_installed) {
        return;
    }
    _installed = true;
    onChanged(() => {
        _els.forEach(el => {
            let data = get('resize', el);
            if (data && data.value && typeof data.value === 'function') {
                data.value && data.value(el);
            }
        });
    });
    addDirective(Vue, 'resize', {
        bind: function (el, binding) {
            set('resize', el, binding);
            if (el && _els.indexOf(el) == -1) {
                _els.push(el);
            }
        },
        update: function (el, binding) {
            set('resize', el, binding);
            if (el && _els.indexOf(el) == -1) {
                _els.push(el);
            }
        },
        unbind: function (el) {
            del('resize', el);
            let index = _els.indexOf(el);
            if (index >= 0) {
                _els.splice(index, 1);
            }
        },
    })
}