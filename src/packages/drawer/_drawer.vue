<template>
  <div>
    <el-drawer
      append-to-body
      destroy-on-close
      custom-class="xDrawer"
      :before-close="handleClose"
      :wrapperClosable="drawerClosable"
      :visible.sync="show"
      :modal="drawerModal"
      :title="drawerTitle"
      :size="autoSize"
    >
      <template slot="title">
        <div :class="backLabel ? '' : 'hide-back'">
          <el-page-header
            @back="backDrawer"
            :title="backLabel"
            :content="drawerTitle"
          ></el-page-header>
        </div>
      </template>
      <div v-if="show" ref="drawer-content">
        <div
          v-for="(opt, i) in historyList"
          :style="opt.bodyStyle"
          :key="opt.key"
        >
          <component
            v-show="i == historyList.length - 1"
            :ref="opt.key"
            :is="opt.component"
            :params="opt.params"
            :query="opt.query"
          >
          </component>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="less">
.xDrawer {
  // 滚动条的宽度
  ::-webkit-scrollbar {
    width: 0px !important;
    height: 16px !important;
  }

  // 滚动条的滑块
  ::-webkit-scrollbar-thumb {
    background-color: #ddd !important;
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #eee !important;
  }

  .el-drawer__header {
    margin-bottom: 0px !important;
    padding: 10px 15px 8px !important;
    border: 0px solid #ddd !important;
  }

  .el-drawer__body {
    -webkit-box-flex: 1 !important;
    -ms-flex: 1 !important;
    flex: 1 !important;
    overflow: auto !important;
  }

  .el-page-header__content {
    font-size: 16px !important;
    color: #303133 !important;
  }

  .el-card {
    border: 0px solid #ebeef5 !important;
  }

  .hide-back {
    .el-page-header__left {
      display: none !important;
    }
  }
}
</style>

<script>
function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

export default {
  data() {
    return {
      show: false,
      refresh: false,
      options: null,
      autoSize: "80%",
      historyList: [],
    };
  },
  computed: {
    currentOptions() {
      try {
        if (this.historyList.length > 0) {
          return this.historyList[this.historyList.length - 1];
        }
      } catch (error) { }
    },
    backLabel() {
      try {
        if (this.historyList.length > 1) {
          return this.getTitle(this.historyList[this.historyList.length - 2]);
        }
      } catch (error) { }
    },
    drawerTitle() {
      return this.getTitle(this.currentOptions);
    },
    drawerModal() {
      return this.currentOptions && this.currentOptions.modal != false;
    },
    drawerClosable() {
      return this.currentOptions && this.currentOptions.closable == true;
    }
  },
  mounted() {
    this.checkResize();
  },
  created() {
    this.checkResize();
  },
  methods: {
    isOpened() {
      return this.show;
    },
    getTitle(option) {
      return (
        (option && option.title) ||
        (option && option.component && option.component.name)
      );
    },
    getCurComp() {
      if (this.currentOptions && this.$refs[this.currentOptions.key]) {
        let refComp = this.$refs[this.currentOptions.key];
        if (refComp instanceof Array) {
          return refComp[0];
        }
        return refComp;
      }
    },
    setRefresh() {
      this.refresh = true;
    },
    checkResize() {
      let curComponent = this.getCurComp();
      if (curComponent && typeof curComponent['getDrawerWidth'] == 'function') {
        this.autoSize = curComponent['getDrawerWidth']();
        if (this.autoSize) {
          return
        }
      }
      if (this.$xUIDrawerFullScreen) {
        this.autoSize = "100%";
        return;
      }
      try {
        let width =
          document.documentElement.clientWidth || document.body.clientWidth;
        if (width < 1000) {
          this.autoSize = "100%";
        } else {
          this.autoSize = 1000;
        }
      } catch (error) { }
    },
    checkClose(callback, force = false) {
      if (force) {
        callback && callback();
        return;
      }
      let curComponent = this.getCurComp();
      if (curComponent && typeof curComponent['onDrawerClose'] == 'function') {
        curComponent['onDrawerClose']((_) => {
          callback && callback();
        })
      } else {
        callback && callback();
      }
    },
    checkRefresh(option) {
      if (option && this.refresh && typeof option.refresh === "function") {
        option.refresh();
      }
    },
    openDrawer(options = {}, replace = false) {
      if (this.historyList.length > 0) {
        try {
          let opt = this.historyList[this.historyList.length - 1];
          let currentKey = `drawer-content`;
          if (this.$refs[currentKey]) {
            let parentElement = this.$refs[currentKey].parentElement;
            opt.scrollTop = (parentElement && parentElement.scrollTop) || 0;
          }
        } catch (err) { }
      }
      options.key = createUUID();
      options.params = options.query = Object.assign(
        { isDrawer: 1 },
        options.query || {},
        options.params || {}
      );
      if (replace) {
        let opt = this.historyList.pop();
        this.checkRefresh(opt);
        if (!options.refresh) {
          options.refresh = opt.refresh;
        }
      }
      this.historyList.push(options);
      this.show = true;
      this.$nextTick(() => {
        this.checkResize();
      });
    },
    closeDrawer() {
      this.historyList.splice(0, this.historyList.length).forEach((option) => {
        this.checkRefresh(option);
      });
      this.refresh = false;
      this.show = false;
      this.checkResize();
    },
    backDrawer(force = false) {
      let done = () => {
        if (this.historyList.length == 1) {
          this.closeDrawer();
        } else {
          this.checkRefresh(this.historyList.pop());
          this.$nextTick(() => {
            try {
              let currentKey = `drawer-content`;
              if (this.$refs[currentKey]) {
                let parentElement = this.$refs[currentKey].parentElement;
                parentElement.scrollTop = this.currentOptions.scrollTop;
              }
            } catch (error) { }
            this.checkResize();
          });
        }
      };
      this.checkClose((_) => {
        done();
      }, force);
    },
    handleClose() {
      this.checkClose(this.closeDrawer, true);
    },
  },
};
</script>