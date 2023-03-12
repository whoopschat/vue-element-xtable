/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import './style.less';
import vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import vueTape from 'vue-tape';
import Element from 'element-ui';
import vueXui from '../../../src/index';
import config from './config';

vue.use(Element);
vue.use(vueXui);
vue.use(vueTape);

export function init(app, name) {
  // set debug mode
  Tape.setDebug(!config.PROD);
  // init app
  Tape.initApp({
    app,
    name,
    config,
    width: 750,
    unit: 100,
    el: '#app',
  });
}
