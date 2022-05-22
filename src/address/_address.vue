<template>
  <div>
    <el-cascader
      filterable
      style="width: 100%"
      v-model="selected"
      @change="handleInputConfirm"
      :placeholder="placeholder"
      :options="cityInfo"
      :props="{
        value: 'value',
        label: 'label',
      }"
    />
  </div>
</template>

<script>
import { toAny } from "jsutil-toany";
import { getData } from "./_data";

export default {
  model: {
    prop: "current",
    event: "change",
  },
  props: {
    current: {
      type: String | Object,
      required: true,
      default: "",
    },
    level: {
      type: Number,
      required: false,
      default: 3,
    },
    format: {
      type: "string" | "object",
      default: "object",
    },
    placeholder: {
      type: String,
      default: "请选择省市区",
    },
  },
  data() {
    return {
      cityInfo: [],
      selected: [],
    };
  },
  watch: {
    current() {
      this.init();
    },
    level() {
      this.initOptions();
    },
  },
  mounted() {
    this.init();
    this.initOptions();
  },
  methods: {
    init() {
      if (this.current) {
        if (typeof this.current == "string") {
          this.selected = this.current.split(",");
        } else {
          this.selected = toAny(this.current, []);
        }
      } else {
        this.selected = [];
      }
      this.selected = this.selected.filter((item) => !!item);
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
        } catch (error) {}
      }, 200);
    },
    initOptions() {
      this.cityInfo = getData(this.level);
    },
    fetchIndex(list, label) {
      if (list instanceof Array) {
        let arrLabel = list.map((item) => {
          return item.label;
        });
        return arrLabel.indexOf(label);
      }
      return -1;
    },
    filterLabel(list, value) {
      if (list instanceof Array) {
        let arrValue = list.map((item) => {
          return item.value;
        });
        return arrValue.indexOf(value);
      }
      return -1;
    },
    handleInputConfirm() {
      if (this.format == "string") {
        this.$emit("change", this.selected.join(","));
      } else {
        this.$emit("change", this.selected);
      }
      this.dispatch("ElFormItem", "el.form.change");
    },
  },
  created() {
    this.init();
  },
};
</script>