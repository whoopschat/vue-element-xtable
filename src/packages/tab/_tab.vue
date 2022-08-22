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
            :params="tab.params"
            :query="tab.query"
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
            key: "tab1",
            label: "Tab 1",
          },
        ];
      },
    },
  },
};
</script>