<template>
  <div class="xPage" v-resize="handleResize" :style="pageStyle">
    <template v-if="noFrame">
      <slot></slot>
    </template>
    <template v-else>
      <div
        ref="xPageMenuParent"
        v-if="menus"
        :class="'x-page-menu' + (isCollapse ? ' x-page-menu-collapse' : '')"
      >
        <div ref="xPageMenuHeader" class="x-page-menu-header">
          <slot v-if="!isCollapse" name="menu-header"></slot>
          <slot v-else name="menu-collapse-header"></slot>
        </div>
        <div
          :class="
            'x-page-menu-list' +
            (isCollapse ? ' x-page-menu-list-collapse' : '')
          "
        >
          <el-menu
            mode="vertical"
            menu-trigger="click"
            :unique-opened="true"
            :collapse-transition="false"
            :default-active="actionName"
            @select="handleSelectClick"
          >
            <template v-for="(item, index) in menus">
              <el-submenu
                v-if="item.children && item.children.length > 0"
                v-show="getValue('show', item, null, true)"
                :disabled="getValue('disabled', item, null, false)"
                :key="'x-page-menu-' + index"
                :index="'' + index"
              >
                <template slot="title">
                  <i v-if="item.icon" :class="getValue('icon', item)"></i>
                  <span v-if="!isCollapse">
                    {{ getValue("label", item) }}
                  </span>
                </template>
                <el-menu-item
                  v-for="(children, cIndex) in item.children"
                  v-show="getValue('show', children, null, true)"
                  :disabled="getValue('disabled', children, null, false)"
                  :key="'x-page-menu-child-' + cIndex"
                  :index="index + '_' + cIndex"
                >
                  <template slot="title">
                    <i
                      v-if="children.icon"
                      :class="getValue('icon', children)"
                    ></i>
                    <span v-if="!isCollapse">
                      {{ getValue("label", children) }}
                    </span>
                  </template>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                v-show="getValue('show', item, null, true)"
                :disabled="getValue('disabled', item, null, false)"
                :index="'' + index"
              >
                <i v-if="item.icon" :class="getValue('icon', item)"></i>
                <span v-if="!isCollapse" slot="title">
                  {{ getValue("label", item) }}
                </span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
        <div ref="xPageMenuFooter" class="x-page-menu-footer">
          <slot v-if="!isCollapse" name="menu-footer"></slot>
          <slot v-else name="menu-collapse-footer"></slot>
        </div>
      </div>
      <div :class="'x-page-content' + (isCollapse ? ' x-menu-collapse' : '')">
        <div class="x-page-content-warp">
          <div class="x-page-slot-header">
            <div ref="header">
              <slot name="content-header"></slot>
            </div>
          </div>
          <div class="x-page-slot-content">
            <slot></slot>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less">
.xPage {
  z-index: 499;

  .x-page-content {
    display: flex;
    overflow-x: hidden;
    flex-direction: column;
    margin-left: calc(
      var(--x-page-menu-border-width) + var(--x-page-menu-width)
    );
    width: calc(
      100% - var(--x-page-menu-border-width) - var(--x-page-menu-width)
    );
    background-color: var(--x-page-content-bg-color);
    &.x-menu-collapse {
      margin-left: calc(
        var(--x-page-menu-border-width) + var(--x-page-menu-collapse-width)
      );
      width: calc(
        100% - var(--x-page-menu-border-width) -
          var(--x-page-menu-collapse-width)
      );
    }

    .x-page-content-warp {
      min-width: var(--x-page-content-min-width);
    }

    .el-card {
      border: 0px solid #ebeef5 !important;
    }
  }

  .x-page-menu {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    vertical-align: top;
    display: inline-block;
    width: var(--x-page-menu-width);
    color: var(--x-page-menu-text-color);
    background-color: var(--x-page-menu-bg-color);
    border-right: solid var(--x-page-menu-border-width)
      var(--x-page-menu-border-color);

    .x-page-menu-list {
      overflow: auto;
      display: inline-block;
      width: calc(var(--x-page-menu-width) - var(--x-page-menu-border-width));
      height: var(--x-page-menu-list-height);
      &.x-page-menu-list-collapse {
        width: var(--x-page-menu-collapse-width);

        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }

    .el-menu {
      width: auto;
      color: var(--x-page-menu-text-color);
      background-color: var(--x-page-menu-bg-color);
      border: 0px;

      .el-submenu__title {
        width: auto;
        height: var(--x-page-menu-item-height);
        background-color: var(--x-page-menu-group-bg-color);
        line-height: var(--x-page-menu-item-height);
        min-width: calc(
          var(--x-page-menu-collapse-width)- var(--x-page-menu-border-width)
        );
        max-width: calc(
          var(--x-page-menu-width)- var(--x-page-menu-border-width)
        );
        color: var(--x-page-menu-group-text-color);

        i {
          color: var(--x-page-menu-group-text-color);
        }
      }

      .el-submenu__title.is-active {
        background-color: var(--x-page-menu-group-bg-active-color);
        color: var(--x-page-menu-group-text-active-color);

        i {
          color: var(--x-page-menu-group-text-active-color);
        }
      }
      .el-submenu__title:hover {
        background-color: var(--x-page-menu-group-bg-hover-color);
        color: var(--x-page-menu-group-text-hover-color);

        i {
          color: var(--x-page-menu-group-text-hover-color);
        }
      }

      .el-menu-item {
        width: auto;
        padding: 0px;
        height: var(--x-page-menu-item-height);
        line-height: var(--x-page-menu-item-height);
        background-color: var(--x-page-menu-bg-color);
        padding-left: var(--x-page-menu-item-padding-left) !important;
        min-width: calc(
          var(--x-page-menu-collapse-width)- var(--x-page-menu-border-width)
        );
        max-width: calc(
          var(--x-page-menu-width)- var(--x-page-menu-border-width)
        );
        color: var(--x-page-menu-text-color);

        i {
          color: var(--x-page-menu-text-color);
        }
      }
      .el-menu-item.is-active {
        background-color: var(--x-page-menu-bg-active-color);
        color: var(--x-page-menu-text-active-color);

        i {
          color: var(--x-page-menu-text-active-color);
        }
      }
      .el-menu-item:hover {
        background-color: var(--x-page-menu-bg-hover-color);
        color: var(--x-page-menu-text-hover-color);

        i {
          color: var(--x-page-menu-text-hover-color);
        }
      }
    }
    .el-submenu .el-menu-item {
      background-color: var(--x-page-menu-sub-bg-color);
      color: var(--x-page-menu-sub-text-color);

      i {
        color: var(--x-page-menu-sub-text-color);
      }
    }

    .el-submenu .el-menu-item.is-active {
      background-color: var(--x-page-menu-sub-bg-active-color);
      color: var(--x-page-menu-sub-text-active-color);

      i {
        color: var(--x-page-menu-sub-text-active-color);
      }
    }

    .el-submenu .el-menu-item:hover {
      background-color: var(--x-page-menu-sub-bg-hover-color);
      color: var(--x-page-menu-sub-text-hover-color);

      i {
        color: var(--x-page-menu-sub-text-hover-color);
      }
    }

    &.x-page-menu-collapse {
      width: var(--x-page-menu-collapse-width);

      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }
  // 隐藏滚动条
  .x-page-menu-list::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  @media print {
    .x-page-menu {
      display: none;

      .x-page-menu-collapse {
        display: none;
      }
    }

    .x-page-slot-header {
      display: none;
    }

    .x-page-content {
      width: calc(100%);
      margin-left: 0px;

      &.x-menu-collapse {
        width: calc(100%);
        margin-left: 0px;
      }
    }
  }
}
</style>

<script>
import { getPosition } from "../../utils/position";

export default {
  props: {
    value: {
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
    collapseEnable: {
      type: Boolean,
      default: false,
    },
    collapseWidth: {
      type: Number,
      default: 800,
    },
    forceCollapse: {
      type: Boolean,
      default: false,
    },
    menuSubBgColor: {
      type: String,
    },
    menuSubBgHoverColor: {
      type: String,
    },
    menuSubBgActiveColor: {
      type: String,
    },
    menuSubTextColor: {
      type: String,
    },
    menuSubTextHoverColor: {
      type: String,
    },
    menuSubTextActiveColor: {
      type: String,
    },
    menuGroupBgColor: {
      type: String,
    },
    menuGroupBgHoverColor: {
      type: String,
    },
    menuGroupBgActiveColor: {
      type: String,
    },
    menuGroupTextColor: {
      type: String,
    },
    menuGroupTextHoverColor: {
      type: String,
    },
    menuGroupTextActiveColor: {
      type: String,
    },
    menuBgColor: {
      type: String,
      default: "#c25b4e",
    },
    menuBgHoverColor: {
      type: String,
      default: "#a7493d",
    },
    menuBgActiveColor: {
      type: String,
      default: "#a7493d",
    },
    menuTextColor: {
      type: String,
      default: "#ffffff",
    },
    menuTextHoverColor: {
      type: String,
      default: "#c5e1fd",
    },
    menuTextActiveColor: {
      type: String,
      default: "#c5e1fd",
    },
    menuBorderColor: {
      type: String,
      default: "#ff0000",
    },
    menuBorderWidth: {
      type: Number,
      default: 0,
    },
    menuCollapseWidth: {
      type: Number,
      default: 60,
    },
    menuWidth: {
      type: Number,
      default: 170,
    },
    menuItemHeight: {
      type: Number,
      default: 50,
    },
    menuItemPaddingLeft: {
      type: Number,
      default: 20,
    },
    contentBgColor: {
      type: String,
      default: "#ffffff",
    },
    contentMinWidth: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      isReckonCollapse: false,
      isCollapse: false,
      actionName: "-",
      pageStyle: null,
    };
  },
  watch: {
    menus() {
      this.initMenu();
    },
    value() {
      this.initMenu();
    },
    forceCollapse() {
      this.handleResize();
    },
    isReckonCollapse() {
      this.$emit("reckonCollapse", this.isReckonCollapse);
    },
  },
  mounted() {
    this.initMenu();
  },
  created() {
    this.handleResize();
  },
  methods: {
    initMenu() {
      this.actionName = '-';
      this.$nextTick(() => {
        this.actionName = this.getActionName(this.menus);
      })
      this.handleResize();
    },
    getActionName(list) {
      let actionName;
      let matchFull = false;
      list.forEach((item, index) => {
        if (!matchFull) {
          if (item.children && item.children.length > 0) {
            let subIndex = this.getActionName(item.children);
            if (subIndex) {
              actionName = `${index}_${subIndex}`
            }
          } else if (item.path
            && this.getValue("show", item, null, true)
            && !this.getValue("disabled", item, null, false)
            && new RegExp(item.path).test(this.value)
          ) {
            if (item.path == this.value) {
              matchFull = true;
            }
            actionName = `${index}`;
          }
        }
      });
      return actionName;
    },
    handleResize() {
      try {
        let parentInfo = getPosition(this.$refs.xPageMenuParent);
        let footerInfo = getPosition(this.$refs.xPageMenuFooter);
        let headerInfo = getPosition(this.$refs.xPageMenuHeader);
        this.pageStyle = {
          "--x-page-menu-width": `${this.menuWidth}px`,
          "--x-page-menu-list-height": `${parentInfo.height - footerInfo.height - headerInfo.height}px`,
          "--x-page-menu-item-height": `${this.menuItemHeight}px`,
          "--x-page-menu-item-padding-left": `${this.menuItemPaddingLeft}px`,
          "--x-page-menu-collapse-width": `${this.menuCollapseWidth}px`,
          "--x-page-menu-sub-bg-color": this.menuSubBgColor || this.menuBgColor,
          "--x-page-menu-sub-bg-hover-color": this.menuSubBgHoverColor || this.menuBgHoverColor,
          "--x-page-menu-sub-bg-active-color": this.menuSubBgActiveColor || this.menuBgActiveColor,
          "--x-page-menu-sub-text-color": this.menuSubTextColor || this.menuTextColor,
          "--x-page-menu-sub-text-hover-color": this.menuSubTextHoverColor || this.menuTextHoverColor,
          "--x-page-menu-sub-text-active-color": this.menuSubTextActiveColor || this.menuTextActiveColor,
          "--x-page-menu-group-bg-color": this.menuGroupBgColor || this.menuBgColor,
          "--x-page-menu-group-bg-hover-color": this.menuGroupBgHoverColor || this.menuBgHoverColor,
          "--x-page-menu-group-bg-active-color": this.menuGroupBgActiveColor || this.menuBgActiveColor,
          "--x-page-menu-group-text-color": this.menuGroupTextColor || this.menuTextColor,
          "--x-page-menu-group-text-hover-color": this.menuGroupTextHoverColor || this.menuTextHoverColor,
          "--x-page-menu-group-text-active-color": this.menuGroupTextActiveColor || this.menuTextActiveColor,
          "--x-page-menu-bg-color": this.menuBgColor,
          "--x-page-menu-bg-hover-color": this.menuBgHoverColor,
          "--x-page-menu-bg-active-color": this.menuBgActiveColor,
          "--x-page-menu-text-color": this.menuTextColor,
          "--x-page-menu-text-hover-color": this.menuTextHoverColor,
          "--x-page-menu-text-active-color": this.menuTextActiveColor,
          "--x-page-menu-border-color": this.menuBorderColor,
          "--x-page-menu-border-width": `${this.menuBorderWidth || 0}px`,
          "--x-page-content-bg-color": this.contentBgColor,
          "--x-page-content-min-width": `${this.contentMinWidth || 300}px`,
        }
        let width = document.documentElement.clientWidth;
        if (width > this.collapseWidth) {
          this.isCollapse = false;
          this.isReckonCollapse = false;
        } else {
          this.isCollapse = true;
          this.isReckonCollapse = true;
        }
        if (this.forceCollapse) {
          this.isCollapse = true;
        } else if (!this.collapseEnable) {
          this.isCollapse = false;
        }
      } catch (error) { }
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
    handleSelectClick(index) {
      let splitIndex = `${index}`.split("_");
      let currentItem = this.menus[Number(splitIndex[0])];
      if (currentItem) {
        if (currentItem.children && currentItem.children.length > 0) {
          let childrenIndex = 0;
          if (splitIndex.length > 1) {
            childrenIndex = Number(splitIndex[1])
          }
          let currentChildrenItem = currentItem.children[childrenIndex];
          this.callEvent("click", currentChildrenItem);
          this.$emit("click", currentChildrenItem);
        } else {
          this.callEvent("click", currentItem);
          this.$emit("click", currentItem);
        }
        this.$emit("change", index);
        this.handleResize();
      }
    }
  },
};
</script>