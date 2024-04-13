<template>
  <div v-loading="fetchLoading" class="xTable">
    <div :style="styleVar">
      <el-alert
        type="info"
        v-if="filterCount > 0"
        style="margin-bottom: 10px"
        :title="filterTips"
        :closable="false"
      >
      </el-alert>
      <div @keyup.enter="fetchList">
        <el-form :inline="true" :size="size || $xUISize" @submit.native.prevent>
          <el-form-item
            v-if="
              showRefreshBtn ||
              filterList(paramList).length > 0 ||
              filterList(btnList).length > 0
            "
          >
            <div class="x-table-param-list">
              <div
                class="x-table-param-item"
                v-for="(param, i) in filterList(paramList)"
                v-show="getValue('show', param, null, true)"
                :key="'x-table-param-' + i"
              >
                <x-input
                  v-model="param.value"
                  @change="handleChangeParams()"
                  @clear="handleClearParam(param)"
                  :disabled="getValue('disabled', param)"
                  :clearable="!!(param.value != getValue('default', param))"
                  :size="getValue('size', param) || size || $xUISize"
                  :styleValue="getValue('styleValue', param) || 'width: 150px;'"
                  :options="getParamOptions(param)"
                />
              </div>
              <slot name="param-extra" :refresh="fetchList"></slot>
              <el-button
                v-if="showRefreshBtn"
                :size="size || $xUISize"
                :loading="fetchLoading"
                class="x-table-param-item"
                icon="el-icon-search"
                @click="fetchList"
              >
                {{ refreshLabel }}
              </el-button>
              <el-button
                v-for="(btn, i) in filterList(btnList)"
                v-show="getValue('show', btn, null, true)"
                class="x-table-param-item"
                :key="'x-table-btn-' + i"
                :loading="getValue('loading', btn)"
                :disabled="getValue('disabled', btn)"
                :icon="getValue('icon', btn)"
                :type="getValue('type', btn)"
                :style="getValue('styleValue', btn)"
                :size="getValue('size', btn) || size || $xUISize"
                @click="callEvent('click', btn, dataParams)"
              >
                {{ getValue("label", btn) }}
              </el-button>
            </div>
          </el-form-item>
          <slot name="extra" :refresh="fetchList"></slot>
        </el-form>
      </div>
      <el-table
        ref="xTableEl"
        :border="border"
        :data="filterData"
        :size="size || $xUISize"
        :highlight-current-row="highlightCurrentRow"
        :show-header="headerShow"
        :empty-text="emptyLabel"
        :height="height"
        v-if="!fetchErrorMsg"
        @sort-change="handleSortChange"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="selection"
          type="selection"
          width="40"
        ></el-table-column>
        <el-table-column
          v-show="field"
          v-for="(field, i) in filterList(fieldList)"
          :key="'x-table-column-' + i"
          :label="getValue('label', field)"
          :width="getValue('width', field)"
          :min-width="getValue('minWidth', field)"
          :sortable="getValue('sortKey', field) ? 'custom' : null"
          :fixed="getValue('fixed', field)"
          :prop="getValue('sortKey', field)"
        >
          <template slot-scope="scope" v-if="field">
            <slot
              v-if="field.slot"
              :name="'row-' + field.slot"
              :row="scope.row"
            ></slot>
            <span
              :style="getValue('styleValue', field, scope.row)"
              :class="getValue('className', field, scope.row)"
              @click="callEvent('click', field, scope.row)"
            >
              <template v-if="getValue('type', field, scope.row) == 'html'">
                <div v-html="getValue('render', field, scope.row)"></div>
              </template>
              <template
                v-else-if="getValue('type', field, scope.row) == 'link'"
              >
                <el-link
                  :size="getValue('size', field, scope.row) || size || $xUISize"
                  :disabled="getValue('disabled', field, scope.row)"
                  :type="getValue('linkType', field, scope.row)"
                >
                  {{ getValue("render", field, scope.row) }}
                </el-link>
              </template>
              <template
                v-else-if="getValue('type', field, scope.row) == 'button'"
              >
                <el-button
                  :style="getValue('styleValue', field, scope.row)"
                  :size="getValue('size', field, scope.row) || size || $xUISize"
                  :disabled="getValue('disabled', field, scope.row)"
                  :type="getValue('buttonType', field, scope.row)"
                >
                  {{ getValue("render", field, scope.row) }}
                </el-button>
              </template>
              <template v-else-if="getValue('type', field, scope.row) == 'tag'">
                <el-tag
                  v-if="
                    getValue('render', field, scope.row) ||
                    getValue('label', field, scope.row)
                  "
                  :style="getValue('styleValue', field, scope.row)"
                  :type="getValue('tagType', field, scope.row)"
                  :size="getValue('size', field, scope.row) || size || $xUISize"
                >
                  {{ getValue("render", field, scope.row) }}
                </el-tag>
              </template>
              <span v-else :style="getValue('styleValue', field, scope.row)">
                {{ getValue("render", field, scope.row) }}
              </span>
              <slot
                :row="scope.row"
                :field="field"
                :index="scope.$index"
              ></slot>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="actionList.length > 0"
          :width="actionWidth"
          :label="actionLabel"
          :fixed="actionFixed"
        >
          <template slot-scope="scope">
            <slot name="action" :row="scope.row"></slot>
            <span
              :key="'x-table-action-' + i"
              v-for="(action, i) in filterList(actionList, scope.row)"
              v-show="getValue('show', action, scope.row, true)"
            >
              <template v-if="getValue('type', action, scope.row) == 'button'">
                <el-button
                  :style="getValue('styleValue', action, scope.row)"
                  :size="
                    getValue('size', action, scope.row) || size || $xUISize
                  "
                  :disabled="getValue('disabled', action, scope.row, false)"
                  :type="getValue('buttonType', action, scope.row)"
                  @click="callEvent('click', action, scope.row)"
                >
                  {{ getValue("label", action, scope.row) }}
                </el-button>
              </template>
              <template v-else>
                <el-link
                  class="x-table-action-link"
                  :style="getValue('styleValue', action, scope.row)"
                  :size="
                    getValue('size', action, scope.row) || size || $xUISize
                  "
                  :disabled="getValue('disabled', action, scope.row)"
                  :type="getValue('linkType', action, scope.row) || 'primary'"
                  @click="callEvent('click', action, scope.row)"
                >
                  {{ getValue("label", action, scope.row) }}
                </el-link>
              </template>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty
        v-else-if="!fetchLoading"
        :description="fetchErrorMsg"
        :image-size="100"
      >
        <el-button
          v-if="fetchErrorMsg"
          @click="fetchList"
          :size="size || $xUISize"
        >
          {{ retryLabel }}
        </el-button>
      </el-empty>
      <br />
      <div class="block" v-if="paginationShow">
        <el-pagination
          v-if="currentTotal > 0"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :total="currentTotal"
          :page-size="currentSize"
          :page-sizes="paginationPageSizes"
          :current-page="currentPage"
          :layout="paginationLayout"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.xTable {
  min-height: 100px;

  .el-form-item {
    margin-bottom: 5px;
  }

  .el-form-item__content .el-input-group {
    vertical-align: unset;
  }

  .el-table--medium .el-table__cell {
    padding: 12px 0;
  }

  .el-table td.el-table__cell {
    border-bottom: var(--x-table-border-bottom) solid #ebeef5;
  }

  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1.5px solid #ececec;
  }

  .el-table__body tr.current-row > td.el-table__cell {
    background-color: #ffffff;
  }

  .el-table__body tr.hover-row > td.el-table__cell {
    background-color: #ffffff;
  }

  .el-table__body tr.hover-row.current-row > td.el-table__cell,
  .el-table__body tr.hover-row > td.el-table__cell {
    background-color: #ffffff;
  }

  .x-table-action-link {
    margin-right: 8px;
  }

  .x-table-param-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .x-table-param-item {
      margin-left: 0px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>

<script>
export default {
  props: {
    tag: {
      type: Object | String | Boolean | Number,
    },
    size: {
      type: Number | String,
    },
    height: {
      type: Number | String,
    },
    listApi: {
      type: String,
    },
    btnList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    unshiftList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    paramList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fieldList: {
      type: Array,
      default: () => {
        return [
          {
            label: "Data",
            render: (row) => {
              return row;
            },
          },
        ];
      },
    },
    actionList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fetchClear: {
      type: String | Boolean,
      default: true,
    },
    showRefreshBtn: {
      type: String | Boolean,
      default: false,
    },
    actionFixed: {
      type: String | Boolean,
      default: false,
    },
    actionWidth: {
      type: Number,
      default: 140,
    },
    actionLabel: {
      type: String,
      default: "操作",
    },
    errorLabel: {
      type: String,
      default: "请求数据失败",
    },
    retryLabel: {
      type: String,
      default: "重新加载",
    },
    emptyLabel: {
      type: String,
      default: "暂无数据",
    },
    refreshLabel: {
      type: String,
      default: "刷新",
    },
    defaultSort: {
      type: String,
      default: "",
    },
    defaultPageSize: {
      type: Number,
      default: 20,
    },
    defaultParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    filterMethod: {
      type: Function,
    },
    filterLabelMethod: {
      type: Function,
    },
    handleMapList: {
      type: Function,
    },
    handleFetchList: {
      type: Function,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
    headerShow: {
      type: Boolean,
      default: true,
    },
    paginationShow: {
      type: Boolean,
      default: true,
    },
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, next, jumper",
    },
    paginationPageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 50, 100];
      },
    },
    selectionMultiple: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dataList: [],
      dataParams: {},
      selectItem: null,
      selectList: [],
      selectRefresh: false,
      fetchLoading: false,
      fetchErrorMsg: null,
      refreshElement: false,
      filterCount: 0,
      currentTotal: 0,
      currentSize: 0,
      currentPage: 1,
    };
  },
  watch: {
    listApi() {
      this.fetchList();
    },
    selection() {
      this.refreshDocment();
    },
    paramList() {
      this.handleChangeParams();
    },
    defaultParams() {
      this.handleChangeParams();
      this.fetchList();
    },
    dataList() {
      this.$emit("list-change", this.dataList);
    }
  },
  computed: {
    styleVar() {
      return {
        "--x-table-border-bottom": this.border ? "1px" : "0px"
      }
    },
    filterTips() {
      if (this.filterCount > 0) {
        if (
          this.filterLabelMethod &&
          typeof this.filterLabelMethod === "function"
        ) {
          return this.filterLabelMethod(this.filterCount);
        }
        return "已过滤了" + this.filterCount + "条数据";
      }
      return "";
    },
    filterData() {
      this.filterCount = 0;
      if (this.filterMethod && typeof this.filterMethod === "function") {
        return (this.dataList || []).filter((item) => {
          let flag = this.filterMethod(item);
          if (!flag) {
            this.filterCount += 1;
          }
          return flag;
        });
      }
      return this.dataList;
    },
  },
  methods: {
    callEvent(prop, item, param) {
      if (!item || !prop) {
        return;
      }
      let event = item[prop];
      if (event && typeof event === "function") {
        return event(param, this.tag, this.fetchList, this);
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
    refreshDocment() {
      this.refreshElement = true;
      this.$nextTick(() => {
        this.refreshElement = false;
      });
    },
    filterList(list, param) {
      return (list || []).filter((item) => {
        return this.getValue("show", item, param, true);
      });
    },
    getParamOptions(param) {
      let options = Object.assign({}, param);
      delete options.value;
      return options;
    },
    toggleSelection(rows) {
      try {
        this.selectRefresh = true;
        if (this.$refs.xTableEl) {
          this.$refs.xTableEl.clearSelection();
          if (rows) {
            rows.forEach((row) => {
              this.$refs.xTableEl.toggleRowSelection(row);
            });
          }
        }
        this.$nextTick(() => {
          this.selectRefresh = false;
        })
      } catch (error) { }
    },
    clearSelectList() {
      this.selectList = [];
      this.handleRefreshSelect();
    },
    handleSelectionChange(list) {
      if (!this.selection) {
        return;
      }
      if (this.selectRefresh) {
        return;
      }
      this.selectList = list;
      if (!this.selectionMultiple && this.selectList && this.selectList.length > 0) {
        this.selectItem = this.selectList[this.selectList.length - 1];
      }
      this.handleRefreshSelect();
      this.handleSumbitSelect();
    },
    handleRefreshSelect() {
      this.toggleSelection(this.selectList);
    },
    handleCurrentChange(val) {
      if (this.selection && val) {
        if (this.selectionMultiple) {
          let indexOf = this.selectList.indexOf(val);
          if (indexOf >= 0) {
            this.selectList.splice(indexOf, 1);
          } else {
            this.selectList.push(val);
          }
        } else {
          if (this.selectList.length > 0) {
            this.selectList.splice(0, this.selectList.length);
          }
          this.selectList.push(val);
          this.selectItem = val;
        }
        this.handleRefreshSelect();
        this.handleSumbitSelect();
        if (this.selection) {
          if (this.$refs.xTableEl) {
            this.$refs.xTableEl.setCurrentRow(null);
          }
        }
      }
    },
    handleSumbitSelect() {
      if (this.selectionMultiple) {
        this.$emit("selectList", this.selectList);
      } else {
        if (this.selectItem) {
          this.$emit("select", this.selectItem);
        } else {
          this.$emit("select", null);
        }
      }
    },
    handlePageChange(val) {
      this.currentPage = val;
      this.fetchList();
    },
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchList();
    },
    handleSortChange({ prop, order }) {
      if (prop && order) {
        this.currentOrderBy = `${prop} ${order == "ascending" ? "desc" : "asc"
          }`;
      } else {
        this.currentOrderBy = "";
      }
      this.fetchList();
    },
    handleClearParam(param) {
      param.value = this.getValue("default", param) || "";
      this.handleChangeParams();
    },
    handleChangeParams() {
      this.dataParams = {};
      (this.paramList || []).map((param) => {
        if (param.value == undefined || param.value == null) {
          param.value = this.getValue("default", param) || "";
        }
        return param;
      });
      (this.paramList || []).forEach((param) => {
        let field = this.getValue("field", param);
        let value = this.getValue("value", param, param.value) || param.value;
        if (typeof field == "string") {
          field.split(",").forEach((i) => {
            if (typeof i == "string") {
              this.dataParams[i] = value;
            }
          });
        } else if (field instanceof Array) {
          field.forEach((i) => {
            if (typeof i == "string") {
              this.dataParams[i] = value;
            }
          });
        }
      });
      this.dataParams = Object.assign({}, this.defaultParams, this.dataParams);
      this.$emit("params-change", this.dataParams);
      this.currentPage = 1;
      this.fetchList();
    },
    fetchList() {
      if (this.fetchLoading) {
        return;
      }
      this.$nextTick(() => {
        if (this.fetchClear) {
          this.dataList = [];
        }
        this.fetchLoading = true;
        this.fetchErrorMsg = null;
        let fetchPromise;
        if (this.handleFetchList) {
          fetchPromise = Promise.resolve().then(() => {
            return this.handleFetchList(this.dataParams, this.paginationShow ? {
              pageNum: this.currentPage,
              pageSize: this.currentSize || this.defaultPageSize,
              orderBy: this.currentOrderBy || this.defaultSort,
            } : {})
          })
        } else {
          fetchPromise = Promise.resolve().then(() => {
            return this.$xUIDataListHandler(this.listApi, this.dataParams, this.paginationShow ? {
              pageNum: this.currentPage,
              pageSize: this.currentSize || this.defaultPageSize,
              orderBy: this.currentOrderBy || this.defaultSort,
            } : {})
          })
        }
        fetchPromise.then(resp => {
          if (this.handleMapList) {
            return this.handleMapList(resp);
          }
          return resp;
        }).then((resp) => {
          this.dataList = resp.list || [];
          this.dataList.unshift(...(this.unshiftList || []));
          this.currentTotal = parseInt(resp.total) || 0;
          this.currentPage = parseInt(resp.page) || this.currentPage;
          this.currentSize = parseInt(resp.size) || this.currentSize;
        }).catch((err) => {
          this.fetchErrorMsg = err || this.errorLabel;
        }).finally(() => {
          this.fetchLoading = false;
        });
      });
    },
    refresh() {
      this.fetchList();
    },
  },
  mounted() {
    this.handleChangeParams();
  },
};
</script>