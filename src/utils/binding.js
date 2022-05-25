let _bindings = {};
let _incr_id = 1;

function getBindKey(key, el) {
    try {
        let id = el.getAttribute("__id");
        if (!id) {
            id = _incr_id++;
            el.setAttribute("__id", id);
        }
        return key + "-" + id;
    } catch (error) {
    }
}

export function del(key, el) {
    let realKey = getBindKey(key, el);
    if (!realKey) {
        return;
    }
    delete _bindings[realKey];
}

export function get(key, el) {
    let realKey = getBindKey(key, el);
    if (!realKey) {
        return;
    }
    return _bindings[realKey];
}

export function set(key, el, binding) {
    let realKey = getBindKey(key, el);
    if (!realKey) {
        return;
    }
    _bindings[realKey] = binding;
}