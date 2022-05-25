<template>
  <el-cascader
    ref="input"
    style="width: 100%"
    v-model="selected"
    @change="handleInputConfirm"
    @visible-change="handleBlur"
    filterable
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :placeholder="placeholder"
    :options="options"
    :props="{
      value: 'value',
      label: 'label',
    }"
  />
</template>

<script>
import { getData } from "./_address/index";

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    size: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      required: true,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请选择省市区",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cityInfo: [],
      selected: [],
    };
  },
  watch: {
    value() {
      this.initValue();
    },
  },
  mounted() {
    this.initValue();
  },
  computed: {
    options() {
      return getData();
    },
  },
  methods: {
    focus() {
      this.$nextTick(() => {
          this.$refs.input.focus();
      });
    },
    initValue() {
      if (this.value) {
        this.selected = this.value.split("-");
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
      this.$emit("blur");
      this.$emit("change", this.selected.join("-"));
      this.dispatch("ElFormItem", "el.form.change");
    },
    handleBlur(flag) {
      if (!flag) {
        this.$emit("blur");
        this.dispatch("ElFormItem", "el.form.blur");
      }
    },
  },
};
</script>