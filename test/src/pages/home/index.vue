<template>
  <div>
    <x-page :menus="menuList" @click="handleMenuEvent" :value="path">
      <x-upload v-model="file" :fileCount="2" type="image1"></x-upload>
    </x-page>
  </div>
</template>

<style lang="less" scoped>
@import url("./index.less");
</style>

<script>
export default {
  methods: {
    handleMenuEvent(event) {
      this.path = event.redirect || event.path;
    },
  },
  data() {
    return {
      file: "http://game.iwxerp.com/drly/www-948843138501361664/05e009abe357a8e70b64d98e6b735ef0.png,http://game.iwxerp.com/drly/www-948843138501361664/05e009abe357a8e70b64d98e6b735ef0.png",
      path: "/22",
      menuList: [{
        label: '功能',
        icon: 'el-icon-s-home',
        path: '/22',
      },
      {
        label: '功能',
        icon: 'el-icon-s-home',
        path: '/22',
        children: [
          {
            path: '/',
            label: '首页一览',
          },
          {
            path: '/main/workbench/task',
            icon: 'el-icon-s-order',
            label: '任务中心',
          },
          {
            path: '/main/workbench/paper',
            icon: 'el-icon-question',
            label: '调查问卷',
          },
          {
            path: '/main/workbench/training',
            icon: 'el-icon-s-claim',
            label: '培训问卷',
          },
          {
            path: '/main/workbench/store',
            icon: 'el-icon-s-shop',
            label: '门店管理',
          },
          {
            path: '/main/workbench/area',
            icon: 'el-icon-location',
            label: '区域管理',
          },
          {
            path: '/main/workbench/wallet',
            icon: 'el-icon-money',
            label: '我的钱包',
          },
          {
            path: '/main/workbench/business',
            icon: 'el-icon-info',
            label: '商户信息',
          },
          {
            path: '/main/workbench/user',
            icon: 'el-icon-user-solid',
            label: '子账号管理',
            actions: [],
          },
        ],
      },
      ],
    };
  },
};
</script>
