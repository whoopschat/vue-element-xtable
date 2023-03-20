<template>
  <div>
    <el-drawer
      append-to-body
      destroy-on-close
      custom-class="xDrawer"
      :before-close="handleClose"
      :wrapperClosable="drawerClosable"
      :show-close="drawerShowClose"
      :visible.sync="show"
      :modal="drawerModal"
      :title="drawerTitle"
      :size="autoSize"
    >
      <template slot="title">
        <div :class="backLabel ? '' : 'hidden-back'">
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

  .hidden-back {
    .el-page-header__left {
      display: none !important;
    }
  }

  .el-card {
    border: 0px solid #ebeef5 !important;
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
    backOptions() {
      try {
        if (this.historyList.length > 1) {
          return this.historyList[this.historyList.length - 2];
        }
      } catch (error) { }
    },
    currentOptions() {
      try {
        if (this.historyList.length > 0) {
          return this.historyList[this.historyList.length - 1];
        }
      } catch (error) { }
    },
    backLabel() {
      return (
        (this.backOptions && this.backOptions.title) ||
        (this.backOptions && this.backOptions.component && this.backOptions.component.name)
      );
    },
    drawerTitle() {
      return (
        (this.currentOptions && this.currentOptions.title) ||
        (this.currentOptions && this.currentOptions.component && this.currentOptions.component.name)
      );
    },
    drawerShowClose() {
      return this.currentOptions && this.currentOptions.showClose != false;
    },
    drawerClosable() {
      return this.currentOptions && this.currentOptions.closable == true;
    },
    drawerModal() {
      return this.currentOptions && this.currentOptions.modal != false;
    },
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
    setChanged() {
      for (let index = this.historyList.length - 1; index >= 0; index--) {
        let option = this.historyList[index];
        if (option && option.refresh) {
          option.changed = true;
        }
      }
    },
    setResult(response) {
      let flag = false;
      for (let index = this.historyList.length - 1; !flag && index >= 0; index--) {
        let option = this.historyList[index];
        if (option && option.result) {
          option.response = response;
          flag = true;
        }
      }
    },
    checkResize() {
      this.autoSize = this.currentOptions && this.currentOptions.width;
      if (this.autoSize) {
        return
      }
      let maxWidth = this.currentOptions && this.currentOptions.maxWidth || this.$xUIDrawerMaxWidth;
      if (this.$xUIDrawerFullScreen) {
        this.autoSize = "100%";
        return;
      }
      try {
        let width =
          document.documentElement.clientWidth || document.body.clientWidth;
        if (width < maxWidth) {
          this.autoSize = "100%";
        } else {
          this.autoSize = maxWidth;
        }
      } catch (error) { }
    },
    checkClose(callback, force = false) {
      if (force) {
        callback && callback();
        return;
      }
      if (this.currentOptions && typeof this.currentOptions.close === "function") {
        this.currentOptions.close((_) => {
          callback && callback();
        })
      } else {
        callback && callback();
      }
    },
    checkCallback(option) {
      if (option && option.changed && typeof option.refresh === "function") {
        option.refresh();
      }
      if (option && option.response && typeof option.result === "function") {
        option.result(option.response);
      }
      if (option && typeof option.close === "function") {
        option.close();
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
      options.response = null;
      options.params = options.query = Object.assign(
        { isDrawer: 1 },
        options.query || {},
        options.params || {}
      );
      if (replace) {
        let opt = this.historyList.pop();
        this.checkCallback(opt);
      }
      this.historyList.push(options);
      this.show = true;
      this.$nextTick(() => {
        this.checkResize();
      });
    },
    closeDrawer() {
      this.historyList.splice(0, this.historyList.length).forEach((option) => {
        this.checkCallback(option);
      });
      this.show = false;
      this.checkResize();
    },
    backDrawer(force = false) {
      let done = () => {
        if (this.historyList.length == 1) {
          this.closeDrawer();
        } else {
          this.checkCallback(this.historyList.pop());
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