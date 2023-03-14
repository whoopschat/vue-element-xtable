<template>
  <span v-loading="configLoading">
    <template v-if="!configLoading && configInfo">
      <el-popover
        :value="visible"
        :disabled="!!disabled"
        :visible-arrow="false"
        :placement="getValue('placement', configInfo) || $xUISelectPlacement"
        :width="getValue('width', configInfo)"
        trigger="click"
      >
        <div class="xInputSelect">
          <div class="x-input-select-close" @click="hideDialog">
            <i class="el-icon-close"></i>
          </div>
          <div class="x-input-select-title">
            {{ getTitleLabel() || "请选择" }}
          </div>
          <div class="x-input-select-content">
            <x-table
              ref="table"
              paginationLayout="total, sizes, prev, next"
              @selectList="handleSelectList"
              @event="handleEvent"
              :selection="multipleable"
              :btnList="computedBtnList"
              :tag="getValue('tag', configInfo)"
              :listApi="getValue('listApi', configInfo)"
              :fieldList="getValue('fieldList', configInfo)"
              :paramList="getValue('paramList', configInfo)"
              :retryLabel="getValue('retryLabel', configInfo)"
              :emptyLabel="getValue('emptyLabel', configInfo)"
              :searchLabel="getValue('searchLabel', configInfo)"
              :actionLabel="getValue('actionLabel', configInfo)"
              :actionFixed="getValue('actionFixed', configInfo)"
              :actionWidth="getValue('actionWidth', configInfo)"
              :unshiftList="getValue('unshiftList', configInfo)"
              :defaultSort="getValue('defaultSort', configInfo)"
              :defaultPageSize="getValue('defaultPageSize', configInfo)"
              :defaultParams="getValue('defaultParams', configInfo)"
              :filterLabelMethod="filterLabelMethod"
              :filterMethod="filterMethod"
              :actionList="getActionList()"
            >
              <template slot="extra">
                <slot name="extra"></slot>
              </template>
            </x-table>
          </div>
          <div class="x-input-select-footer" v-if="multipleable">
            <el-button @click="handleCancelClick" :size="size">
              {{ getValue("cancelLabel", configInfo) || "取消" }}
            </el-button>
            <el-button
              type="primary"
              @click="handleOkClick"
              :disabled="!(selectList && selectList.length > 0)"
              :size="size"
            >
              {{ getValue("confirmLabel", configInfo) || "确定" }}
            </el-button>
          </div>
        </div>
        <template slot="reference">
          <el-button
            v-if="getValue('showType', configInfo) == 'button'"
            :size="size"
            :style="
              styleValue || getValue('styleValue', configInfo) || 'width: 100%'
            "
            :loading="detailLoading"
            :disabled="!!disabled"
            @click="handleOpenClick"
          >
            {{ getValueLabel() || getPlaceholderLabel() }}
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
            @click.native="handleOpenClick"
            @clear="handleClearClick"
          >
            <i
              slot="prefix"
              v-if="detailLoading"
              class="el-input__icon el-icon-loading"
            ></i>
          </el-input>
        </template>
      </el-popover>
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
  </span>
</template>

<style lang="less">
.xInputSelect {
  .x-input-select-content {
    padding: 20px;
    min-height: 100px;
  }

  .x-input-select-close {
    float: right;
    padding: 2px 0;
    font-size: 14px;
    cursor: pointer;
    color: #919191;
  }

  .x-input-select-close:hover {
    color: #676767;
  }

  .x-input-select-title {
    padding: 2px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .x-input-select-footer {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<script>
import { deepAssign } from "../../utils/assign";

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
    styleValue: {
      type: String,
      default: "",
    },
    selectLabel: {
      type: String,
      default: "选择",
    },
    currentLabel: {
      type: String,
      default: "当前",
    },
    errorLabel: {
      type: String,
      default: "获取数据失败",
    },
    filterMethod: {
      type: Function,
    },
    filterLabelMethod: {
      type: Function,
    },
    options: {
      type: Object,
      default: () => { },
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
      select: null,
      visible: false,
      selectList: null,
      configInfo: null,
      configLoading: false,
      configErrorMsg: null,
      detailErrorMsg: null,
      detailLoading: false,
      clearTime: 0
    };
  },
  watch: {
    type() {
      this.visible = false;
      this.selectList = [];
      this.refreshConfig();
    },
    value() {
      this.fetchDetail();
    },
    options() {
      this.visible = false;
      this.selectList = [];
      this.refreshConfig();
    },
    visible() {
      if (!this.visible) {
        this.$emit("close");
      }
    },
    select() {
      if (this.select) {
        let selectValue = this.selectValue;
        if (selectValue != this.value) {
          this.$emit("change", selectValue);
        }
        this.$emit("select", this.select);
        this.dispatch("ElFormItem", "el.form.change");
      } else if (this.value) {
        this.$emit("change", "");
        this.$emit("select", null);
        this.dispatch("ElFormItem", "el.form.change");
      }
    },
  },
  computed: {
    computedBtnList() {
      let list = [];
      let btnList = this.getValue('btnList', this.configInfo);
      let customBtnList = this.getValue('customBtnList', this.configInfo);
      if (btnList && btnList instanceof Array) {
        list.push(...btnList);
      }
      if (customBtnList && customBtnList instanceof Array) {
        list.push(...customBtnList);
      }
      return list;
    },
    selectValue() {
      if (!this.select) {
        return this.getValue("defaultValue", this.configInfo);
      }
      return this.getValue("value", this.configInfo, this.select);
    },
  },
  methods: {
    focus() {
      this.handleOpenClick();
    },
    handleEvent(type, ...params) {
      if (type == 'hide') {
        this.hideDialog();
      } else {
        this.$emit("event", type, ...params)
      }
    },
    hideDialog() {
      this.visible = false;
    },
    showDialog() {
      if (Date.now() - this.clearTime < 1000) {
        return;
      }
      this.visible = true;
    },
    handleOpenClick() {
      this.selectList = [];
      this.showDialog();
      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.clearSelectList();
        }
      });
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
            return this.getValue("value", this.configInfo, row) ==
              this.selectValue
              ? this.getValue("currentLabel", this.configInfo) || this.currentLabel
              : this.getValue("selectLabel", this.configInfo) || this.selectLabel;
          },
          linkType: (row, tag, table) => {
            return this.getValue("value", this.configInfo, row) ==
              this.selectValue
              ? "info"
              : "primary";
          },
          click: (row, refresh, table) => {
            this.handleSelectClick(row);
          },
        },
      ];
    },
    getValueLabel() {
      if (!this.select) {
        return this.getValue("defaultValueLabel", this.configInfo);
      }
      return (
        this.getValue("renderLabel", this.configInfo) ||
        this.getValue("render", this.configInfo, this.select)
      );
    },
    getTitleLabel() {
      return (
        this.getValue("titleLabel", this.configInfo) ||
        this.getValue("title", this.configInfo)
      );
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
    handleClearClick() {
      this.clearTime = Date.now();
      this.handleSelectClick(null);
    },
    handleSelectClick(row) {
      this.select = row;
      this.hideDialog();
    },
    handleCancelClick() {
      this.hideDialog();
    },
    handleOkClick() {
      (this.selectList || []).forEach((item) => {
        this.$emit("select", item);
      });
      if (this.$refs.table) {
        this.$refs.table.clearSelectList();
      }
      this.hideDialog();
    },
    fetchDetail() {
      if (this.select) {
        return;
      }
      if (this.detailLoading) {
        return;
      }
      if (!this.configInfo) {
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
        let defaultParams = this.getValue("defaultParams", this.configInfo) || {};
        let dataParams = this.getValue("params", this.configInfo, this.value) || {};
        let requestParams = Object.assign({}, defaultParams, dataParams);
        return Promise.resolve().then(() => {
          return this.getValue("handleFetchDetail", this.configInfo, requestParams)
        }).catch(() => { }).then(resp => {
          if (!resp) {
            return this.$xUIDataDetailHandler(detailApi, requestParams);
          }
          return resp;
        }).then((resp) => {
          this.select = resp;
        }).catch((err) => {
          console.error(err);
          this.detailErrorMsg = err || this.errorLabel;
        }).finally(() => {
          this.detailLoading = false;
        });
      });
    },
    refreshConfig() {
      if (this.configLoading) {
        return;
      }
      this.$nextTick(() => {
        this.configLoading = true;
        this.configErrorMsg = null;
        return this.$xUIDataConfigHandler(this.type).then((resp) => {
          if (resp) {
            this.configInfo = deepAssign({}, resp, this.options);
            this.fetchDetail();
          } else {
            throw "Not found select config: " + this.type;
          }
        }).catch((err) => {
          console.error(err);
          this.configErrorMsg = err;
        }).finally(() => {
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