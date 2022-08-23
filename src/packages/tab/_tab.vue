<template>
  <div class="xTab">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane
        :key="i"
        :label="tab.label"
        :name="tab.name"
        v-show="tab.show"
        v-for="(tab, i) in tabs"
      >
        <template v-if="tab.component">
          <component
            :is="tab.component"
            :params="tab.params || params"
            :query="tab.query || query"
          />
        </template>
        <div v-else>
          <el-empty description="空"></el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "",
    };
  },
  props: {
    tabs: {
      type: Array,
      default: () => {
        return [
          {
            name: "tab1",
            label: "Tab 1",
          },
          {
            name: "tab2",
            label: "Tab 2",
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
  watch: {
    tabs() {
      this.refreshActiveName();
    },
  },
  methods: {
    refreshActiveName() {
      let names = (this.tabs || []).map((tab) => {
        return tab.name;
      });
      if (!this.activeName || names.indexOf(this.activeName) < 0) {
        this.activeName = names[0];
      }
    },
  },
  created() {
    this.refreshActiveName();
  },
};
</script>