<template>
  <div v-if="identifyOptions && identifyCode">
    <el-dialog
      :title="getValue('title', identifyOptions)"
      :width="getValue('width', identifyOptions)"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <span>
        <el-form
          ref="form"
          v-if="dialogVisible"
          @submit.native.prevent
          :model="identifyForm"
          :rules="identifyRules"
          :label-width="getValue('formLabelWidth', identifyOptions)"
        >
          <el-form-item
            :label="getValue('formLabel', identifyOptions)"
            prop="inputCode"
          >
            <i-code
              :size="getValue('size', identifyOptions) || $xUISize"
              :identifyCode="identifyCode"
              :contentWidth="120"
              :contentHeight="38"
              @click="refreshClick"
            />
            <div @keyup.enter="okClick">
              <el-input
                :style="'width:' + getValue('formInputWidth', identifyOptions)"
                :placeholder="getValue('formPlaceholder', identifyOptions)"
                :size="getValue('size', identifyOptions) || $xUISize"
                v-model="identifyForm.inputCode"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              :size="getValue('size', identifyOptions) || $xUISize"
              @click="cancelClick"
            >
              {{ getValue("cancelLabel", identifyOptions) }}
            </el-button>
            <el-button
              type="primary"
              :disabled="!identifyForm.inputCode"
              :size="getValue('size', identifyOptions) || $xUISize"
              @click="okClick"
            >
              {{ getValue("okLabel", identifyOptions) }}
            </el-button>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ICode from "./_code.vue";

const defaultOptions = {
  title: "请验证",
  width: "400px",
  size: "small",
  formLabel: "图形验证码",
  formLabelWidth: "100px",
  formPlaceholder: "请输入图中验证码",
  formErrorText: "验证码错误",
  formInputWidth: "180px",
  cancelLabel: "取消",
  okLabel: "验证",
  codeLen: 4,
  codeStr: "ABCDEFGHJKLMNPQRSTUVWXYabcdefhijkmnpqrstuvwxy0123456789",
};

export default {
  components: {
    ICode,
  },
  data() {
    return {
      callback: null,
      dialogVisible: false,
      identifyOptions: null,
      identifyCode: null,
      identifyForm: {
        inputCode: "",
      },
      identifyRules: {
        inputCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback();
              } else if (
                `${value}`.toLowerCase() !==
                `${this.identifyCode}`.toLowerCase()
              ) {
                callback(
                  new Error(
                    this.getValue("formErrorText", this.identifyOptions)
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    random(max, min) {
      return Math.round(Math.random() * (max - min) + min);
    },
    genCode(len, str = "0123456789") {
      var res = "";
      for (var i = 0; i < len; i++) {
        res += str[this.random(0, str.length - 1)];
      }
      return res;
    },
    getValue(prop, item, param, def) {
      if (!item || !prop) {
        return def;
      }
      let propValue = item[prop];
      if (propValue && typeof propValue === "function") {
        return propValue(param);
      }
      if (typeof propValue === "undefined") {
        return def;
      }
      return propValue;
    },
    okClick() {
      if (!this.identifyForm.inputCode) {
        return;
      }
      if (this.$refs.form) {
        this.$refs.form.validate((valid, data) => {
          if (valid) {
            this.dialogVisible = false;
            this.callback && this.callback(true);
          }
        });
      }
    },
    cancelClick() {
      this.dialogVisible = false;
      this.callback && this.callback(false);
    },
    refreshClick() {
      let len = this.getValue("codeLen", this.identifyOptions);
      let str = this.getValue("codeStr", this.identifyOptions);
      this.identifyCode = this.genCode(len, str);
    },
    check(callback, options) {
      this.callback = callback;
      this.dialogVisible = true;
      this.identifyForm.inputCode = "";
      this.identifyOptions = Object.assign({}, defaultOptions, options || {});
      this.refreshClick();
    },
  },
};
</script>