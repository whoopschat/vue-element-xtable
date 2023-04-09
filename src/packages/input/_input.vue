<template>
  <span class="xInput">
    <template v-if="getValue('type', options, null, type) == 'data'">
      <x-select
        ref="input"
        @close="handleBlur"
        @change="handleChange"
        @select="handleSelect"
        v-model="inputValue"
        :size="getValue('size', options) || $xUISize"
        :type="getValue('dataType', options)"
        :styleValue="styleValue"
        :placeholder="placeholder || getValue('label', options)"
        :filterLabelMethod="filterLabelMethod"
        :filterMethod="filterMethod"
        :multipleable="multipleable"
        :clearable="clearable"
        :disabled="disabled"
        :options="options"
      >
        <template slot="extra">
          <slot name="extra" />
        </template>
      </x-select>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'html'">
      <x-html
        ref="input"
        v-model="inputValue"
        @blur="handleBlur"
        @change="handleChange"
        :size="getValue('size', options) || $xUISize"
        :customs="getValue('customs', options)"
        :disabledLabel="getValue('disabledLabel', options)"
        :disabledStyle="getValue('disabledStyle', options)"
        :loadingLabel="getValue('loadingLabel', options)"
        :loadingStyle="getValue('loadingStyle', options)"
        :loadingDelay="getValue('loadingDelay', options)"
        :style="styleValue || getValue('styleValue', options)"
        :placeholder="placeholder || getValue('label', options)"
        :clearable="clearable"
        :disabled="disabled"
      >
      </x-html>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'select'">
      <el-select
        ref="input"
        @blur="handleBlur"
        @change="handleChange"
        v-model="inputValue"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :placeholder="placeholder || getValue('label', options)"
        :clearable="clearable"
        :disabled="disabled"
      >
        <template
          v-if="
            getValue('options', options) &&
            getValue('options', options).length > 0
          "
        >
          <el-option
            :label="opt.label"
            :value="opt.value"
            :key="'x-input-select-o-' + oIndex"
            v-for="(opt, oIndex) in getValue('options', options)"
          />
        </template>
        <template v-else>
          <el-option label="可选项为空" value=""></el-option>
        </template>
      </el-select>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'number'">
      <el-input-number
        ref="input"
        @blur="handleBlur"
        @change="handleChange"
        v-model="inputValue"
        :controls="false"
        :max="getValue('max', options)"
        :min="getValue('min', options)"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :maxlength="getValue('maxlength', options)"
        :placeholder="placeholder || getValue('label', options)"
        :precision="getValue('precision', options, null, 2)"
        :clearable="clearable"
        :disabled="disabled"
      >
      </el-input-number>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'datetime'">
      <el-date-picker
        ref="input"
        @blur="handleBlur"
        @change="handleChange"
        v-model="inputValue"
        type="datetime"
        value-format="timestamp"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :placeholder="placeholder || getValue('label', options)"
        :clearable="clearable"
        :disabled="disabled"
      >
      </el-date-picker>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'textarea'">
      <el-input
        ref="input"
        type="textarea"
        @blur="handleBlur"
        @change="handleChange"
        v-model="inputValue"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :maxlength="getValue('maxlength', options)"
        :show-word-limit="getValue('limit', options)"
        :placeholder="placeholder || getValue('label', options)"
        :rows="getValue('rows', options)"
        :clearable="clearable"
        :disabled="disabled"
      >
      </el-input>
    </template>
    <el-input
      v-else
      ref="input"
      @blur="handleBlur"
      @change="handleChange"
      v-model="inputValue"
      :size="getValue('size', options) || $xUISize"
      :style="styleValue || getValue('styleValue', options)"
      :maxlength="getValue('maxlength', options)"
      :placeholder="placeholder || getValue('label', options)"
      :clearable="clearable"
      :disabled="disabled"
    >
      <template slot="prepend">
        <slot name="prepend" />
      </template>
    </el-input>
  </span>
</template>

<style lang="less" >
.xInput {
  .el-input-number {
    width: 100% !important;
  }

  .el-input-number .el-input__inner {
    width: 100% !important;
    text-align: left !important;
  }
}
</style>

<script>
import XHtml from "./_html.vue";
import XSelect from "./_select.vue";

export default {
  components: {
    XSelect,
    XHtml,
  },
  props: {
    value: {
      type: Object | String | Number | Array,
    },
    type: {
      type: String,
      default: "",
    },
    cacheKey: {
      type: String,
      default: "",
    },
    cacheEnable: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: String | Object | Array,
      default: "",
    },
    styleValue: {
      type: String,
      default: "",
    },
    focusable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterMethod: {
      type: Function,
    },
    filterLabelMethod: {
      type: Function,
    },
    placeholder: {
      type: String,
      default: "",
    },
    multipleable: {
      type: Boolean,
      default: false,
    },
    options: {
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
  data() {
    return {
      inputValue: "",
      changeFlag: false,
      changeTimeout: null,
    };
  },
  watch: {
    value() {
      this.initInput();
    },
  },
  mounted() {
    this.initInput();
  },
  methods: {
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
    getValueLabel() {
      let valueLabel;
      if (this.getValue("type", this.options) == "select") {
        try {
          let options = this.getValue("options", this.options);
          if (options && options.length > 0) {
            options.forEach((opt) => {
              if (opt.value == this.value) {
                valueLabel = opt.label;
              }
            });
          }
        } catch (error) { }
      }
      if (!valueLabel) {
        valueLabel = this.getValue("valueLabel", this.options, this.value);
      }
      if (!valueLabel) {
        valueLabel = this.inputValue;
      }
      if (!valueLabel) {
        valueLabel = this.getValue("label", this.options);
      }
      return valueLabel;
    },
    handleBlur() {
      this.delayChange();
    },
    handleSelect(select) {
      this.$emit("select", select);
    },
    handleChange() {
      if (this.options.type == "number" && !this.inputValue) {
        this.inputValue = 0;
      }
      this.changeFlag = true;
      this.$emit("change", this.inputValue);
      this.dispatch("ElFormItem", "el.form.change");
      if (this.cacheEnable) {
        localStorage.setItem(`xui-input-cache-${this.cacheKey}`, this.inputValue);
      }
    },
    delayChange() {
      if (this.changeTimeout) {
        return;
      }
      this.changeTimeout = setTimeout(() => {
        this.changeTimeout = null;
        if (this.changeFlag) {
          this.handleChange();
          this.changeFlag = false;
        } else {
          this.$emit("blur");
          this.dispatch("ElFormItem", "el.form.blur");
        }
      }, 100);
    },
    initInput() {
      try {
        this.inputValue =
          (this.value && JSON.parse(JSON.stringify(this.value))) || "";
      } catch (error) {
        this.inputValue = "";
      }
      if (this.cacheEnable && !this.inputValue) {
        this.inputValue = localStorage.getItem(`xui-input-cache-${this.cacheKey}`) || this.defaultValue;
      }
      if (this.focusable) {
        this.focus();
      }
    },
  },
};
</script>