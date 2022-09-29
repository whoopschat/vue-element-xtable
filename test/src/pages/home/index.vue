<template>
  <div>
    <h1>vue-element-xui - create by vue-tape 4.1.5</h1>
    <hr />page name: home
    <x-tab  />
  </div>
</template>

<style lang="less" scoped>
@import url("./index.less");
</style>

<script>
import test from './comps/test.vue';

export default {
    data() {
        return {
            tabs: [{
                name: 't1',
                label: '田',
                component: test,
            }, {
                name: 't2',
                label: '田',
                component: test,
            }],
        };
    },
};
</script>
