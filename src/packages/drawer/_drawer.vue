<template>
  <div>
    <el-drawer
      append-to-body
      destroy-on-close
      custom-class="xDrawer"
      :before-close="handleClose"
      :wrapperClosable="!drawerEditable && drawerClosable"
      :visible.sync="show"
      :title="drawerTitle"
      :size="autoSize"
      :modal="false"
    >
      <template slot="title">
        <div>
          <el-page-header
            @back="backDrawer"
            :title="backLabel"
            :content="drawerTitle"
          ></el-page-header>
        </div>
      </template>
      <div v-if="show" ref="drawer-content">
        <div v-for="(opt, i) in historyList" :key="opt.key">
          <component
            v-show="i == historyList.length - 1"
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
}
</style>

<script>
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
      } catch (error) {}
    },
    backLabel() {
      try {
        if (this.historyList.length > 1) {
          return this.getTitle(this.historyList[this.historyList.length - 2]);
        }
      } catch (error) {}
    },
    drawerTitle() {
      return this.getTitle(this.currentOptions);
    },
    drawerClosable() {
      return this.currentOptions && this.currentOptions.closable !== false;
    },
    drawerEditable() {
      return this.currentOptions && this.currentOptions.editable;
    },
    drawerEditableText() {
      return (
        (this.currentOptions && this.currentOptions.editableText) ||
        "确定退出编辑模式？"
      );
    },
    drawerTipLabel() {
      return (
        (this.currentOptions && this.currentOptions.editableTipLabel) || "提示"
      );
    },
  },
  mounted() {
    this.handleResize();
  },
  created() {
    this.handleResize();
  },
  methods: {
    createUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    getTitle(option) {
      return (
        (option && option.title) ||
        (option && option.component && option.component.name)
      );
    },
    handleResize() {
      if (this.$xUIDrawerFullScreen){
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
      } catch (error) {}
    },
    setRefresh() {
      this.refresh = true;
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
        } catch (err) {}
      }
      options.key = this.createUUID();
      options.params = options.query = Object.assign(
        { isDrawer: 1 },
        options.query || {},
        options.params || {}
      );
      if (replace) {
        let opt = this.historyList.pop();
        this.checkRefresh(opt);
        if (!options.refresh){
          options.refresh = opt.refresh;
        }
      }
      this.historyList.push(options);
      this.show = true;
    },
    closeDrawer() {
      this.historyList.splice(0, this.historyList.length).forEach((option) => {
        this.checkRefresh(option);
      });
      this.refresh = false;
      this.show = false;
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
            } catch (error) {}
          });
        }
      };
      if (this.drawerEditable && !force) {
        this.$confirm(this.drawerEditableText, {
          title: this.drawerTipLabel,
          type: "info",
        })
          .then((_) => {
            done();
          })
          .catch((_) => {});
      } else {
        done();
      }
    },
    handleClose(done) {
      if (this.drawerEditable) {
        this.$confirm(this.drawerEditableText, {
          title: this.drawerTipLabel,
          type: "info",
        })
          .then((_) => {
            this.closeDrawer();
          })
          .catch((_) => {});
      } else {
        this.closeDrawer();
      }
    },
  },
};
</script>