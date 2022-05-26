<template>
  <div v-loading="fetchLoading" class="xTable">
    <div @keyup.enter="fetchList">
      <el-form :inline="true" :size="size || $xUISize" @submit.native.prevent>
        <el-form-item v-if="filterList(paramList).length > 0">
          <span
            style="margin-right: 12px"
            v-for="(param, i) in filterList(paramList)"
            v-show="getValue('show', param, null, true)"
            :key="'x-table-param-' + i"
          >
            <x-input
              v-model="param.value"
              @change="handleChangeParams()"
              :disabled="getValue('disabled', param)"
              :clearable="!getValue('default', param)"
              :size="getValue('size', param) || size || $xUISize"
              :styleValue="getValue('styleValue', param) || 'width: 150px;'"
              :options="param"
            />
          </span>
          <el-button
            class="x-table-param-btn"
            icon="el-icon-search"
            @click="fetchList"
          >
            {{ searchLabel }}
          </el-button>
          <el-button
            class="x-table-param-btn"
            @click="handleChangeParams(true)"
          >
            {{ resetLabel }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="filterList(btnList).length > 0">
          <el-button
            v-for="(btn, i) in filterList(btnList)"
            v-show="getValue('show', btn, null, true)"
            class="x-table-param-btn"
            :key="'x-table-btn-' + i"
            :disabled="getValue('disabled', btn)"
            :icon="getValue('icon', btn)"
            :type="getValue('type', btn)"
            :style="getValue('styleValue', btn)"
            :size="getValue('size', btn) || size || $xUISize"
            @click="callEvent('click', btn)"
          >
            {{ getValue("label", btn) }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="xTableEl"
      style="width: 100%"
      :data="filterData"
      :border="border"
      :size="size || $xUISize"
      :highlight-current-row="true"
      v-if="filterData.length > 0"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        v-show="field"
        v-for="(field, i) in filterList(fieldList)"
        :key="'x-table-column-' + i"
        :label="getValue('label', field)"
        :width="getValue('width', field)"
        :min-width="getValue('minWidth', field)"
        :sortable="getValue('sortKey', field) ? 'custom' : null"
        :prop="getValue('sortKey', field)"
      >
        <template slot-scope="scope" v-if="field">
          <span
            :style="getValue('styleValue', field, scope.row)"
            :class="getValue('className', field, scope.row)"
            @click="callEvent('click', field, scope.row)"
          >
            <template v-if="getValue('type', field, scope.row) == 'html'">
              <div v-html="getValue('render', field, scope.row)"></div>
            </template>
            <template v-else-if="getValue('type', field, scope.row) == 'link'">
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
            <slot :row="scope.row" :field="field" :index="scope.$index"></slot>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!selection && actionList.length > 0"
        :width="actionWidth"
        :label="actionLabel"
      >
        <template slot-scope="scope">
          <span
            :key="'x-table-action-' + i"
            v-for="(action, i) in filterList(actionList, scope.row)"
            v-show="getValue('show', action, scope.row, true)"
          >
            <template v-if="getValue('type', action, scope.row) == 'button'">
              <el-button
                :style="getValue('styleValue', action, scope.row)"
                :size="getValue('size', action, scope.row) || size || $xUISize"
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
                :size="getValue('size', action, scope.row) || size || $xUISize"
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
      :description="fetchErrorMsg || emptyLabel"
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
    <div class="block">
      <el-pagination
        v-if="filterData && filterData.length > 0"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :total="currentTotal"
        :page-size="currentSize"
        :current-page="currentPage"
        :layout="paginationLayout"
      ></el-pagination>
    </div>
    <el-alert
      type="info"
      v-if="filterCount > 0"
      :title="filterTips"
      :closable="false"
    >
    </el-alert>
  </div>
</template>

<style lang="less">
.xTable {
  min-height: 100px;
  .el-form-item {
    margin-bottom: 5px;
  }
  .x-table-param-btn {
    margin-left: 0px;
    margin-right: 8px;
    margin-top: 8px;
  }
  .x-table-action-link {
    margin-right: 8px;
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
      type: Number,
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
    actionWidth: {
      type: Number,
      default: 140,
    },
    actionLabel: {
      type: String,
      default: "操作",
    },
    retryLabel: {
      type: String,
      default: "重新加载",
    },
    emptyLabel: {
      type: String,
      default: "暂无数据",
    },
    searchLabel: {
      type: String,
      default: "搜索",
    },
    resetLabel: {
      type: String,
      default: "重置",
    },
    defaultSort: {
      type: String,
      default: "",
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
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
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
      selectList: [],
      noCallFetch: false,
      fetchLoading: false,
      fetchErrorMsg: null,
      refreshElement: false,
      filterCount: 0,
      currentTotal: 0,
      currentSize: 10,
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
    selectList() {
      this.$emit("selectList", this.selectList);
    },
  },
  computed: {
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
    refreshDocment() {
      this.refreshElement = true;
      this.$nextTick(() => {
        this.refreshElement = false;
      });
    },
    setCurrentRow(val) {
      if (this.$refs.xTableEl) {
        this.$refs.xTableEl.setCurrentRow(val);
      }
    },
    toggleSelection(rows) {
      this.$refs.xTableEl.clearSelection();
      if (rows) {
        rows.forEach((row) => {
          this.$refs.xTableEl.toggleRowSelection(row);
        });
      }
    },
    filterList(list, param) {
      return (list || []).filter((item) => {
        return this.getValue("show", item, param, true);
      });
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
    callEvent(prop, item, param) {
      if (!item || !prop) {
        return;
      }
      let event = item[prop];
      if (event && typeof event === "function") {
        return event(param, this.tag, this.fetchList, this);
      }
    },
    handleSelectionChange(selected) {
      this.selectList = selected;
    },
    handleCurrentChange(val) {
      if (val) {
        this.$emit("current-change", val, this);
        let indexOf = this.selectList.indexOf(val);
        if (indexOf >= 0) {
          this.selectList.splice(indexOf, 1);
        } else {
          this.selectList.push(val);
        }
        this.toggleSelection(this.selectList);
        if (this.selection) {
          this.setCurrentRow(null);
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
        this.currentOrderBy = `${prop} ${
          order == "ascending" ? "desc" : "asc"
        }`;
      } else {
        this.currentOrderBy = "";
      }
      this.fetchList();
    },
    handleChangeParams(reset) {
      this.dataParams = {};
      (this.paramList || []).map((param) => {
        if (!param.value || reset) {
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
      this.fetchList();
    },
    fetchList() {
      if (this.fetchLoading) {
        return;
      }
      this.$nextTick(() => {
        this.fetchLoading = true;
        this.fetchErrorMsg = null;
        return this.$xUIDataListHandler(this.listApi, this.dataParams, {
          pageNum: this.currentPage,
          pageSize: this.currentSize,
          orderBy: this.currentOrderBy || this.defaultSort,
        })
          .then((resp) => {
            this.dataList = resp.list || [];
            this.currentTotal = parseInt(resp.total) || 0;
            this.currentPage = parseInt(resp.page) || this.currentPage;
            this.currentSize = parseInt(resp.size) || this.currentSize;
            if (!this.noCallFetch) {
              this.$emit("fetch-list", this.dataList, this);
              this.noCallFetch = false;
            }
          })
          .catch((err) => {
            this.fetchErrorMsg = err || "请求数据失败";
            this.$emit("fetch-error", err);
          })
          .finally(() => {
            this.fetchLoading = false;
          });
      });
    },
    refresh() {
      this.noCallFetch = true;
      this.fetchList();
    },
  },
  mounted() {
    this.handleChangeParams();
  },
};
</script>