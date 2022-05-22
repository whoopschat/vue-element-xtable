<template>
  <span v-loading="configLoading">
    <template v-if="!configLoading && configInfo">
      <el-button
        v-if="showType == 'button'"
        :loading="detailLoading"
        :style="styleValue || getValue('styleValue', configInfo)"
        :disabled="!!disabled"
        :size="size || $xSelectSize"
        @click="handleOpen"
      >
        {{ getValueLabel() }}
      </el-button>
      <el-input
        v-else
        :loading="detailLoading"
        :value="getValueLabel()"
        :placeholder="getPlaceholderLabel()"
        :style="styleValue || getValue('styleValue', configInfo)"
        :clearable="!!clearable"
        :disabled="!!disabled"
        :size="size || $xSelectSize"
        @clear="handleSelectClick(null, null)"
        @focus="handleOpen"
      />
    </template>
    <template v-else-if="!configLoading && configErrorMsg">
      <el-tag type="danger">
        {{ configErrorMsg || "获取选择器配置" }}
      </el-tag>
    </template>
    <el-dialog
      append-to-body
      v-if="configInfo"
      @closed="handleClosed"
      :close-on-click-modal="closeOnClickModal"
      :title="getPlaceholderLabel() || '选择'"
      :width="getValue('width', configInfo)"
      :visible.sync="dialog"
      custom-class="xSelectDialog"
    >
      <x-table
        v-if="!refreshElement"
        paginationLayout="total, prev, pager, next"
        @selectList="handleSelectList"
        :listApi="getValue('listApi', configInfo)"
        :selection="multipleable"
        :filterConfig="filterConfig || getValue('filterConfig', configInfo)"
        :btnList="getValue('btnList', configInfo)"
        :fieldList="getValue('fieldList', configInfo)"
        :paramList="getValue('paramList', configInfo)"
        :retryLabel="getValue('retryLabel', configInfo)"
        :emptyLabel="getValue('emptyLabel', configInfo)"
        :searchLabel="getValue('searchLabel', configInfo)"
        :actionLabel="getValue('actionLabel', configInfo)"
        :defaultSort="getValue('defaultSort', configInfo)"
        :defaultParams="getValue('defaultParams', configInfo)"
        :actionList="getActionList()"
        :actionWidth="90"
        :tag="value"
      />
      <div
        slot="footer"
        v-if="multipleable || getValue('multipleable', configInfo)"
      >
        <el-button @click="handleCancelClick" :size="size || $xSelectSize">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="handleOkClick"
          :size="size || $xSelectSize"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </span>
</template>

<style lang="less">
.xSelectDialog {
  .el-dialog__body {
    padding: 8px 20px !important;
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
    size: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    value: {
      type: String | Number,
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
    filterConfig: {
      type: Object,
    },
    selectConfig: {
      type: Object,
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
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    multipleable: {
      type: Boolean | String | Number,
      default: false,
    },
    disabled: {
      type: Boolean | String | Number,
      default: false,
    },
    clearable: {
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
    getPlaceholderLabel() {
      if (this.detailErrorMsg) {
        return this.detailErrorMsg;
      }
      return this.title || this.getValue("title", this.configInfo);
    },
    handleSelectList(list) {
      this.selectList = list;
    },
    handleSelectClick(row, value) {
      this.$emit("change", value);
      this.$emit("select", row);
      this.dispatch("ElFormItem", "el.form.change", value);
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
        return this.$xSelectDetailHandler(detailApi, params)
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
        return this.$xSelectConfigHandler(this.type)
          .then((resp) => {
            if (resp) {
              this.configInfo = Object.assign({}, resp, this.selectConfig);
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