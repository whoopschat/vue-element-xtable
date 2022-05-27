<template>
  <span v-loading="configLoading">
    <template v-if="!configLoading && configInfo">
      <el-button
        v-if="showType == 'button'"
        :loading="detailLoading"
        :size="size"
        :style="
          styleValue || getValue('styleValue', configInfo) || 'width: 100%'
        "
        :disabled="!!disabled"
        @click="handleOpen"
      >
        {{ getValueLabel() }}
      </el-button>
      <el-input
        v-else
        :size="size"
        :value="getValueLabel()"
        :placeholder="getPlaceholderLabel()"
        :style="
          styleValue || getValue('styleValue', configInfo) || 'width: 100%'
        "
        :clearable="!!clearable"
        :disabled="!!disabled"
        @clear="handleSelectClick(null, null)"
        @focus="handleOpen"
      >
        <i
          slot="prefix"
          v-if="detailLoading"
          class="el-input__icon el-icon-loading"
        ></i>
      </el-input>
    </template>
    <template v-else-if="!configLoading && configErrorMsg">
      <el-tag
        type="danger"
        :style="
          styleValue || getValue('styleValue', configInfo) || 'width: 100%'
        "
      >
        {{ configErrorMsg || "获取选择器配置" }}
      </el-tag>
    </template>
    <el-dialog
      append-to-body
      v-if="configInfo"
      @closed="handleClosed"
      :close-on-click-modal="closeOnClickModal"
      :title="getTitleLabel() || '选择'"
      :width="getValue('width', configInfo)"
      :visible.sync="dialog"
      custom-class="xInputSelectDialog"
    >
      <x-table
        v-if="!refreshElement"
        paginationLayout="total, prev, pager, next"
        @selectList="handleSelectList"
        :listApi="getValue('listApi', configInfo)"
        :selection="multipleable"
        :btnList="getValue('btnList', configInfo)"
        :fieldList="getValue('fieldList', configInfo)"
        :paramList="getValue('paramList', configInfo)"
        :retryLabel="getValue('retryLabel', configInfo)"
        :emptyLabel="getValue('emptyLabel', configInfo)"
        :searchLabel="getValue('searchLabel', configInfo)"
        :actionLabel="getValue('actionLabel', configInfo)"
        :defaultSort="getValue('defaultSort', configInfo)"
        :defaultParams="getValue('defaultParams', configInfo)"
        :filterMethod="filterMethod"
        :filterLabelMethod="filterLabelMethod"
        :actionList="getActionList()"
        :actionWidth="90"
        :tag="value"
      />
      <div
        slot="footer"
        v-if="multipleable || getValue('multipleable', configInfo)"
      >
        <el-button @click="handleCancelClick" :size="size"> 取 消 </el-button>
        <el-button type="primary" @click="handleOkClick" :size="size">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </span>
</template>

<style lang="less">
.xInputSelectDialog {
  .el-dialog__body {
    padding: 10px 20px;
    border-top: 0px solid #eeeeee;
  }
}
</style>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String | Number,
    },
    size: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    showType: {
      type: String,
      default: "",
    },
    styleValue: {
      type: String,
      default: "",
    },
    renderLabel: {
      type: String,
    },
    currentLabel: {
      type: String,
      default: "当前",
    },
    selectLabel: {
      type: String,
      default: "选择",
    },
    filterMethod: {
      type: Function,
    },
    filterLabelMethod: {
      type: Function,
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    multipleable: {
      type: Boolean | String | Number,
      default: false,
    },
    clearable: {
      type: Boolean | String | Number,
      default: false,
    },
    disabled: {
      type: Boolean | String | Number,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      select: null,
      selectList: null,
      configInfo: null,
      configLoading: false,
      configErrorMsg: null,
      detailErrorMsg: null,
      detailLoading: false,
      refreshElement: false,
    };
  },
  watch: {
    value() {
      this.fetchDetail();
    },
    type() {
      this.dialog = false;
      this.selectList = [];
      this.refreshDocment();
      this.refreshConfig();
    },
  },
  methods: {
    focus() {
      this.handleOpen();
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
    handleOpen() {
      this.selectList = [];
      this.refreshDocment();
      this.dialog = true;
    },
    handleClosed() {
      this.$emit("close");
    },
    getValue(prop, item, param, def) {
      if (!item || !prop) {
        return def;
      }
      let propValue = item[prop];
      if (propValue && typeof propValue === "function") {
        return propValue(param, this.value);
      }
      if (typeof propValue === "undefined") {
        return def;
      }
      return propValue;
    },
    getActionList() {
      return [
        {
          label: (row, tag, table) => {
            return this.getValue("value", this.configInfo, row) == tag
              ? this.currentLabel
              : this.selectLabel;
          },
          linkType: (row, tag, table) => {
            return this.getValue("value", this.configInfo, row) == tag
              ? "info"
              : "primary";
          },
          disabled: (row, tag, table) => {
            return this.getValue("value", this.configInfo, row) == tag;
          },
          click: (row, refresh, table) => {
            let value = this.getValue("value", this.configInfo, row);
            this.handleSelectClick(row, value || row);
          },
        },
      ];
    },
    refreshDocment() {
      this.refreshElement = true;
      this.$nextTick(() => {
        this.refreshElement = false;
      });
    },
    getValueLabel() {
      if (!this.select) {
        return;
      }
      if (this.renderLabel) {
        return this.renderLabel;
      }
      return this.getValue("render", this.configInfo, this.select);
    },
    getTitleLabel() {
      return this.title || this.getValue("title", this.configInfo);
    },
    getPlaceholderLabel() {
      if (this.detailErrorMsg) {
        return this.detailErrorMsg;
      }
      return this.getTitleLabel();
    },
    handleSelectList(list) {
      this.selectList = list;
    },
    handleSelectClick(row, value) {
      this.$emit("select", row);
      this.$emit("change", value);
      this.dispatch("ElFormItem", "el.form.change");
      this.handleClosed();
      this.dialog = false;
    },
    handleCancelClick() {
      this.handleClosed();
      this.dialog = false;
    },
    handleOkClick() {
      (this.selectList || []).forEach((item) => {
        this.$emit("select", item);
      });
      this.handleClosed();
      this.dialog = false;
    },
    fetchDetail() {
      if (!this.configInfo) {
        return;
      }
      if (this.detailLoading) {
        return;
      }
      if (!this.value) {
        this.select = null;
        this.detailErrorMsg = null;
        return;
      }
      this.$nextTick(() => {
        this.select = null;
        this.detailLoading = true;
        this.detailErrorMsg = null;
        let detailApi = this.getValue("detailApi", this.configInfo);
        let params =
          this.getValue("params", this.configInfo, this.value) || this.value;
        return this.$xUIDataDetailHandler(detailApi, params)
          .then((resp) => {
            this.select = resp;
            this.$emit("select", this.select);
          })
          .catch((err) => {
            console.error(err);
            this.detailErrorMsg = err || "请求数据失败";
          })
          .finally(() => {
            this.detailLoading = false;
          });
      });
    },
    refreshConfig() {
      if (this.configLoading) {
        return;
      }
      this.$nextTick(() => {
        this.configInfo = null;
        this.configLoading = true;
        this.configErrorMsg = null;
        return this.$xUIDataConfigHandler(this.type)
          .then((resp) => {
            if (resp) {
              this.configInfo = Object.assign({}, resp);
              this.fetchDetail();
            } else {
              throw "找不到选择器配置信息";
            }
          })
          .catch((err) => {
            console.error(err);
            this.configErrorMsg = err || "请求数据失败";
          })
          .finally(() => {
            this.configLoading = false;
          });
      });
    },
  },
  created() {
    this.refreshConfig();
  },
};
</script>