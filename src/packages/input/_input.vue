<template>
  <span class="xTableDataInput">
    <template v-if="getValue('type', options, null, type) == 'data'">
      <x-select
        ref="input"
        @close="handleBlur"
        @change="handleChange"
        @select="handleSelect"
        v-model="inputValue"
        :size="getValue('size', options) || $xUISize"
        :type="getValue('dataType', options)"
        :showType="getValue('showType', options)"
        :renderLabel="getValue('renderLabel', options)"
        :selectLabel="getValue('selectLabel', options)"
        :currentLabel="getValue('currentLabel', options)"
        :titleLabel="getValue('titleLabel', options)"
        :styleValue="styleValue || getValue('styleValue', options)"
        :filterLabelMethod="filterLabelMethod"
        :filterMethod="filterMethod"
        :multipleable="multipleable"
        :clearable="clearable"
        :disabled="disabled"
      />
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'upload'">
      <x-upload
        ref="input"
        v-model="inputValue"
        @blur="handleBlur"
        @change="handleChange"
        :style="styleValue || getValue('styleValue', options)"
        :size="getValue('size', options) || $xUISize"
        :type="getValue('uploadType', options)"
        :fileType="getValue('fileType', options)"
        :fileSize="getValue('fileSize', options)"
        :fileCount="getValue('fileCount', options)"
        :deleteLabel="getValue('deleteLabel', options)"
        :uploadLabel="getValue('uploadLabel', options)"
        :loadingLabel="getValue('loadingLabel', options)"
        :tipsLabel="getValue('tipsLabel', options)"
        :placeholder="getValue('label', options)"
        :preview="getValue('preview', options)"
        :clearable="clearable"
        :disabled="disabled"
      />
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'address'">
      <x-address
        ref="input"
        v-model="inputValue"
        @blur="handleBlur"
        @change="handleChange"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :placeholder="getValue('label', options)"
        :clearable="clearable"
        :disabled="disabled"
      >
      </x-address>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'select'">
      <el-select
        ref="input"
        @blur="handleBlur"
        @change="handleChange"
        v-model="inputValue"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :placeholder="getValue('label', options)"
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
        :placeholder="getValue('label', options)"
        :rows="getValue('rows', options)"
        :clearable="clearable"
        :disabled="disabled"
      >
        <template slot="prepend">
          <slot name="prepend" />
        </template>
      </el-input>
    </template>
    <template v-else-if="getValue('type', options, null, type) == 'number'">
      <el-input-number
        ref="input"
        @blur="handleBlur"
        @change="handleChange"
        v-model="inputValue"
        :controls="false"
        :size="getValue('size', options) || $xUISize"
        :style="styleValue || getValue('styleValue', options)"
        :maxlength="getValue('maxlength', options)"
        :placeholder="getValue('label', options)"
        :max="getValue('max', options)"
        :min="getValue('min', options)"
        :precision="getValue('precision', options, null, 2)"
        :clearable="clearable"
        :disabled="disabled"
      >
        <template slot="prepend">
          <slot name="prepend" />
        </template>
      </el-input-number>
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
      :placeholder="getValue('label', options)"
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
.xTableDataInput {
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
import XSelect from "./_select.vue";
import XAddress from "./_address.vue";
import XUpload from "./_upload.vue";

export default {
  components: {
    XSelect,
    XAddress,
    XUpload,
  },
  props: {
    value: {
      type: Object | String | Number | Array,
    },
    type: {
      type: String,
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
        } catch (error) {}
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
    },
    getValue(prop, item, param, def) {
      if (!item || !prop) {
        return def;
      }
      let propValue = item[prop];
      if (propValue && typeof propValue === "function") {
        return propValue(param, this.tag);
      }
      if (typeof propValue === "undefined") {
        return def;
      }
      return propValue;
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
      if (this.focusable) {
        this.focus();
      }
    },
  },
};
</script>