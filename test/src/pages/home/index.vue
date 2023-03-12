<template>
  <div>
    <x-page :menus="menuList" @click="handleMenuEvent" :value="path">
      <div style="margin: 10px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">
            {{ path }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <x-upload
        type="image"
        v-model="file"
        :fileCount="2"
        :imageCrop="true"
      ></x-upload>
      <x-input type="html" v-model="html"></x-input>
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
      file: '',
      html: '',
      path: '/marketing',
      menuList: [{
        label: 'marketing',
        icon: 'el-icon-s-marketing',
        path: '/marketing',
      },
      {
        label: 'tools',
        icon: 'el-icon-s-tools',
        path: '/tools',
        children: [
          {
            path: '/home',
            icon: 'el-icon-s-home',
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
