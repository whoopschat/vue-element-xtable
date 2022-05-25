<template>
  <div class="xPage" v-resize="handleResize">
    <template v-if="print">
      <x-print>
        <template slot="header">
          <slot name="header" />
        </template>
        <slot></slot>
        <template slot="footer">
          <slot name="footer" />
        </template>
      </x-print>
    </template>
    <template v-else>
      <div ref="pageHeader" class="pageHeader">
        <div>
          <div class="headerTop">
            <slot name="header"></slot>
          </div>
          <div class="headerMenu">
            <el-menu
              mode="horizontal"
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
        <div
          class="contentLeft"
          v-if="
            currentItem &&
            currentItem.children &&
            currentItem.children.length > 1
          "
        >
          <el-menu
            mode="vertical"
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
        <div class="contentBody">
          <slot></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less">
@childerMenuWidth: 200px;

.xPage {
  min-width: 800px;

  .el-menu {
    border-right: solid 0px #e6e6e6 !important;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6 !important;
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
    .contentLeft {
      display: inline-block;
      width: @childerMenuWidth;
      background-color: #ffffff;
      border-bottom: solid 0px #e6e6e6;
      vertical-align: top;
    }

    .contentBody {
      display: inline-block;
      width: calc(100% - @childerMenuWidth - 2px);
    }
  }
}
/* 当页面宽度大于960px小于1200px */
@media screen and (min-width: 800px) and (max-width: 1200px) {
  .xPage .pageContent .contentLeft {
    width: @childerMenuWidth;
    border-bottom: solid 0px #e6e6e6;
  }
  .xPage .pageContent .contentBody {
    width: calc(100% - @childerMenuWidth - 2px);
  }
}

/* 当页面宽度小于300px*/
@media screen and (max-width: 800px) {
  .xPage .pageContent .contentLeft {
    width: 100%;
    border-bottom: solid 1px #e6e6e6;
  }
  .xPage .pageContent .contentBody {
    width: 100%;
  }
}
</style>

<script>
import XPrint from "./_print.vue";

export default {
  components: {
    XPrint,
  },
  props: {
    print: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    menus: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: "0",
      currentChildrenIndex: "0",
      currentItem: null,
      currentChildrenItem: null,
      currentHeaderHeight: 0,
    };
  },
  watch: {
    menus() {
      this.initMenu();
    },
  },
  mounted() {
    this.initMenu();
    this.handleResize();
  },
  methods: {
    initMenu() {
      let flag = false;
      this.menus.forEach((item, index) => {
        if (!flag && this.getValue("show", item, null, true)) {
          this.currentIndex = `${index}`;
          flag = true;
        }
      });
      this.handleMenuClick(this.currentIndex);
    },
    initChildren() {
      if (this.currentItem != null) {
        let flag = false;
        this.currentItem.children.forEach((children, cIndex) => {
          if (!flag && this.getValue("show", children, null, true)) {
            this.currentChildrenIndex = `${cIndex}`;
            flag = true;
          }
        });
        this.handleChildrenClick(this.currentChildrenIndex);
      }
    },
    handleResize() {
      try {
        if (this.$refs.pageHeader) {
          this.currentHeaderHeight = this.$refs.pageHeader.offsetHeight;
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
      if (this.currentItem.children && this.currentItem.children.length > 0) {
        this.initChildren();
      } else {
        this.callEvent("click", this.currentItem);
        this.$emit("click", this.currentItem);
      }
    },
    handleChildrenClick(index) {
      if (this.currentItem) {
        this.currentChildrenItem = this.currentItem.children[index];
        this.callEvent("click", this.currentChildrenItem);
        this.$emit("click", this.currentChildrenItem);
        this.currentChildrenIndex = index;
      }
    },
  },
};
</script>