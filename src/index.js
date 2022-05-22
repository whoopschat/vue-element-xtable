import Drawer, { _installDrawer } from "./drawer"
import Select, { _installSelect } from "./select"
import Table, { _installTable } from "./table"
import Image, { _installImage } from "./image"
import { _installAddress } from "./address"
import { _installInput } from "./input"

const install = (Vue, options) => {
    _installDrawer(Vue);
    _installSelect(Vue, options);
    _installTable(Vue, options);
    _installAddress(Vue, options);
    _installInput(Vue, options);
    _installImage(Vue, options);
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    Select,
    Drawer,
    Table,
    Image,
}
