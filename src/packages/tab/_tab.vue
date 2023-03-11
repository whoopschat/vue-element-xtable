<template>
  <div class="xTab">
    <el-tabs v-model="activeName" :type="type" @tab-click="onClickTab">
      <el-tab-pane
        v-show="getValue('show', tab)"
        v-for="(tab, i) in tabs"
        :name="tab.name"
        :label="getValue('label', tab)"
        :key="'x-tab-' + tab.name + '-' + i"
      >
        <div v-if="checkTabVisiable(tab)">
          <component
            :is="tab.component"
            :params="tab.params || params"
            :query="tab.query || query"
            @event="callOnEvent"
          />
        </div>
        <div v-else>
          <el-empty :description="tab.emptyLabel"></el-empty>
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
    tag: {
      type: Object | String | Boolean | Number,
    },
    type: {
      type: String,
      default: "border-card",
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
    callEvent(prop, item, param) {
      if (!item || !prop) {
        return;
      }
      let event = item[prop];
      if (event && typeof event === "function") {
        return event(param, this.tag, this);
      }
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
        } catch (error) { }
      }, 200);
    },
    callOnEvent(...params) {
      this.$emit("event", ...params);
    },
    checkTabVisiable(tab) {
      if (!tab.component) {
        return false;
      }
      if (tab.interval && tab.name != this.activeName) {
        return false;
      }
      return true;
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
    onClickTab(tab) {
      this.activeName = tab.name;
      this.$emit("change", this.activeName);
      this.dispatch("ElFormItem", "el.form.change");
    },
  },
  mounted() {
    this.refreshActiveName();
  },
};
</script>