<template>
  <div class="xTab">
    <el-tabs :value="activeName" type="border-card" @tab-click="onClickTab">
      <el-tab-pane
        :key="i"
        :label="tab.label"
        :name="tab.name"
        v-show="tab.show"
        v-for="(tab, i) in tabs"
      >
        <template v-if="tab.component && checkTabVisiable(tab)">
          <component
            :is="tab.component"
            :params="tab.params || params"
            :query="tab.query || query"
            @xEvent="callOnEvent"
          />
        </template>
        <div v-else>
          <el-empty :description="tab.emptyLabel | ''"></el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: null,
    };
  },
  props: {
    value: {
      type: String | Number,
    },
    tabs: {
      type: Array,
      default: () => {
        return [
          {
            name: "tab1",
            label: "Tab 1",
            interval: false,
          },
          {
            name: "tab2",
            label: "Tab 2",
            interval: false,
          },
        ];
      },
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    query: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  model: {
    event: "change",
    prop: "value",
  },
  watch: {
    value() {
      this.refreshActiveName();
    },
    tabs() {
      this.refreshActiveName();
    },
  },
  methods: {
    dispatch(componentName, eventName, params) {
      setTimeout(() => {
        try {
          var parent = this.$parent || this.$root;
          var name = parent.$options.componentName;
          while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;
            if (parent) {
              name = parent.$options.componentName;
            }
          }
          if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params));
          }
        } catch (error) {}
      }, 200);
    },
    callOnEvent(...params) {
      this.$emit("xEvent", ...params);
    },
    checkTabVisiable(tab) {
      if (tab.interval && tab.name != this.activeName) {
        return false;
      }
      return true;
    },
    onClickTab(tab) {
      this.activeName = tab.name;
      this.$emit("change", this.activeName);
      this.dispatch("ElFormItem", "el.form.change");
    },
    refreshActiveName() {
      this.activeName = this.value;
      let names = (this.tabs || []).map((tab) => {
        return tab.name;
      });
      if (!this.activeName || names.indexOf(this.activeName) < 0) {
        this.activeName = names[0];
      }
    },
  },
  mounted() {
    this.refreshActiveName();
  },
};
</script>