<template>
  <div class="xPage" v-resize="handleResize">
    <template v-if="noFrame">
      <slot></slot>
    </template>
    <template v-else>
      <div ref="pageHeader" class="pageHeader">
        <div>
          <div class="headerTop">
            <slot name="header"></slot>
            <div class="header-right">
              <slot name="header-right"></slot>
            </div>
          </div>
          <div class="headerMenu" v-if="menus && menus.length > 1">
            <el-menu
              mode="horizontal"
              menu-trigger="click"
              :collapse-transition="false"
              :default-active="currentIndex"
              @select="handleMenuClick"
            >
              <el-menu-item
                v-show="getValue('show', item, null, true)"
                v-for="(item, index) in menus"
                :key="'x-page-menu-' + index"
                :index="'' + index"
              >
                {{ getValue("label", item) }}
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </div>
      <div
        class="pageContent"
        :style="'padding-top: ' + currentHeaderHeight + 'px;height: 100%;'"
      >
        <template v-if="hasChildren">
          <div class="contentLeft" :style="contentLeftStyle">
            <el-menu
              mode="vertical"
              menu-trigger="click"
              :collapse-transition="false"
              :default-active="currentChildrenIndex"
              @select="handleChildrenClick"
            >
              <el-menu-item
                v-show="getValue('show', children, null, true)"
                v-for="(children, cIndex) in currentItem.children"
                :key="'x-page-menu-' + cIndex"
                :index="'' + cIndex"
              >
                <i v-if="children.icon" :class="getValue('icon', children)"></i>
                {{ getValue("label", children) }}
              </el-menu-item>
            </el-menu>
          </div>
          <div class="contentBody" :style="contentBodyStyle">
            <slot></slot>
          </div>
        </template>
        <div v-else class="contentBody" :style="contentBodyStyle">
          <slot></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less">
@menuItemHeight: 50px;

.xPage {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  min-width: 500px;

  // 滚动条的宽度
  ::-webkit-scrollbar {
    width: 0px; // 横向滚动条
    height: 16px; // 纵向滚动条 必写
  }

  // 滚动条的滑块
  ::-webkit-scrollbar-thumb {
    background-color: #ddd;
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #eee;
  }

  .el-menu {
    border-right: solid 0px #e6e6e6 !important;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6 !important;
  }
  .el-menu-item {
    height: @menuItemHeight;
    line-height: @menuItemHeight;
  }

  .pageHeader {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 500;
    background-color: #ffffff;
    border-bottom: solid 1px #e6e6e6 !important;
  }

  .pageContent {
    position: fixed;
    overflow: auto;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 499;

    .contentLeft {
      display: inline-block;
      background-color: #ffffff;
      border-bottom: solid 0px #e6e6e6;
      border-right: solid 1px #e6e6e6;
      vertical-align: top;
    }

    .contentBody {
      float: right;
      overflow: auto;
      background-color: #ffffff;
      .el-card {
        border: 0px solid #ebeef5 !important;
      }
    }
  }
  @media screen and (max-width: 800px) {
    .pageHeader {
      .header-right {
        display: block;
      }
    }
  }

  @media screen and (min-width: 800px) {
    .pageHeader {
      .header-right {
        position: fixed;
        right: 10px;
        top: 0;
        z-index: 600;
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    path: {
      type: String,
      default: "",
    },
    menus: {
      type: Array,
      default: () => [],
    },
    noFrame: {
      type: Boolean,
      default: false,
    },
    childrenWidth: {
      type: Number,
      default: 170,
    },
  },
  data() {
    return {
      unChange: false,
      currentIndex: "-",
      currentChildrenIndex: "-",
      currentItem: null,
      currentChildrenItem: null,
      currentHeaderHeight: 0,
      currentContentHeight: 0,
      contentLeftStyle: {},
      contentBodyStyle: {},
    };
  },
  watch: {
    menus() {
      this.initMenu();
    },
    path() {
      this.initMenu();
    },
  },
  mounted() {
    this.initMenu();
    this.handleResize();
  },
  computed: {
    hasChildren() {
      return (
        this.currentItem &&
        this.currentItem.children &&
        this.currentItem.children.length > 1
      );
    },
  },
  methods: {
    initMenu() {
      this.currentIndex = this.getMenuIndex(this.menus, false);
      this.currentItem = this.menus[this.currentIndex];
      if (this.hasChildren) {
        this.currentChildrenIndex = this.getMenuIndex(
          this.currentItem.children,
          false
        );
        this.currentChildrenItem =
          this.currentItem.children[this.currentChildrenIndex];
      }
    },
    getMenuIndex(list, auto) {
      let actionName;
      list.forEach((item, index) => {
        if (
          item.path &&
          this.getValue("show", item, null, true) &&
          new RegExp(item.path).test(this.path)
        ) {
          actionName = `${index}`;
        }
      });
      if (!actionName && auto) {
        let flag = false;
        list.forEach((item, index) => {
          if (!flag && this.getValue("show", item, null, true)) {
            actionName = `${index}`;
            flag = true;
          }
        });
      }
      return actionName;
    },
    handleResize() {
      try {
        if (this.$refs.pageHeader) {
          this.currentHeaderHeight = this.$refs.pageHeader.offsetHeight;
        }
      } catch (error) {}
      try {
        this.currentContentHeight =
          document.documentElement.clientHeight - this.currentHeaderHeight;
      } catch (error) {}
      try {
        let width = document.documentElement.clientWidth;
        if (this.hasChildren && width > 800) {
          this.contentLeftStyle = {
            width: this.childrenWidth + "px",
            borderRight: "solid 1px #e6e6e6",
            height: this.currentContentHeight + "px",
          };
          this.contentBodyStyle = {
            width: `${width - this.childrenWidth - 2}px`,
            height: this.currentContentHeight + "px",
          };
        } else {
          this.contentLeftStyle = {
            width: "100%",
            borderRight: "none",
            borderBottom: "solid 1px #e6e6e6",
          };
          this.contentBodyStyle = {
            width: "100%",
            height: this.currentContentHeight + "px",
          };
        }
      } catch (error) {}
    },
    getValue(prop, item, param, def) {
      if (!item || !prop) {
        return def;
      }
      let propValue = item[prop];
      if (propValue && typeof propValue === "function") {
        return propValue(param, this.tag, this);
      }
      if (typeof propValue === "undefined") {
        return def;
      }
      return propValue;
    },
    callEvent(prop, item, param) {
      if (!item || !prop) {
        return;
      }
      let event = item[prop];
      if (event && typeof event === "function") {
        return event(param, this.tag, this.fetchList, this);
      }
    },
    handleMenuClick(index) {
      this.currentIndex = index;
      this.currentItem = this.menus[index];
      if (this.currentItem) {
        if (this.currentItem.children && this.currentItem.children.length > 0) {
          this.currentChildrenIndex = this.getMenuIndex(
            this.currentItem.children,
            true
          );
          this.handleChildrenClick(this.currentChildrenIndex);
        } else {
          if (!this.unChange) {
            this.callEvent("click", this.currentItem);
            this.$emit("click", this.currentItem);
          }
        }
        this.handleResize();
      }
    },
    handleChildrenClick(index) {
      if (this.currentItem) {
        this.currentChildrenIndex = index;
        this.currentChildrenItem = this.currentItem.children[index];
        if (this.currentChildrenItem && !this.unChange) {
          this.callEvent("click", this.currentChildrenItem);
          this.$emit("click", this.currentChildrenItem);
        }
      }
    },
  },
};
</script>