<template>
  <div class="xHtmlEditor">
    <div v-if="!loading">
      <quill-editor
        ref="myQuillEditor"
        v-model="inputValue"
        :class="[disabled ? 'is-disabled' : '']"
        :options="editorOption"
      />
    </div>
    <div v-else :style="loadingStyle">{{ loadingLabel }}</div>
  </div>
</template>

<style lang="less">
.xHtmlEditor {
  .quill-editor {
    background: #ffffff;
    &.is-disabled {
      background: #f1f1f1;
    }
  }
  .ql-editor {
    max-width: 100%;
    min-height: 240px;
    img {
      max-width: 100%;
    }
  }
  .ql-snow .ql-formats {
    line-height: 20px;
  }
  .ql-snow .ql-tooltip {
    z-index: 99999;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
    content: "10px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
    content: "12px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
    content: "14px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
    content: "16px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
    content: "20px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
    content: "24px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
    content: "36px";
  }
}
</style>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor, Quill } from "vue-quill-editor";

// toolbar
import { CustomExtend } from "./_quill/customExtend";
Quill.register("modules/customExtend", CustomExtend);

// image upload
import { ImageExtend } from "./_quill/imageExtend";
import { QuillWatch } from "./_quill/QuillWatch";
Quill.register("modules/ImageExtend", ImageExtend);
// image resize
import QuillResize from "./_quill/resize/index";
Quill.register("modules/resize", QuillResize);
// 自定义文字大小
let fontSize = ['10px', '12px', '14px', '16px', '20px', '24px', '36px']
Quill.imports['attributors/style/size'].whitelist = fontSize;
Quill.register(Quill.imports['attributors/style/size']);

export default {
  components: {
    quillEditor,
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledLabel: {
      type: String,
      default: "只读模式",
    },
    disabledStyle: {
      type: String,
      default: "color: #919191",
    },
    loadingLabel: {
      type: String,
      default: "正在加载编辑器",
    },
    loadingStyle: {
      type: String,
      default: "color: #919191",
    },
    loadingDelay: {
      type: Number,
      default: 200,
    },
    customs: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    editorOption() {
      return {
        theme: "snow",
        placeholder: this.placeholder,
        modules: {
          resize: {
            // See optional "config" below
            modules: ["DisplaySize", "Resize", "Keyboard"],
          },
          customExtend: {
            customs: this.disabled ? [{
              type: "label",
              innerHTML: this.disabledLabel,
              styleValue: this.disabledStyle,
            }] : this.customs,
          },
          ImageExtend: {
            fileType: ["image/png", "image/jpeg", "image/gif", "image/bmp"],
            uploadHandler: (file, callback, failure) => {
              this.$xUIFileUploadHandler(file, "image")
                .then((data) => {
                  callback && callback(data);
                })
                .catch((err) => {
                  failure && failure(err);
                });
            },
          },
          toolbar: {
            container: this.disabled ? [] : [
              [{ size: [false, ...fontSize] }],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["bold", "italic", "underline", "strike"],
              ["blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["clean"],
              ["image"],
            ],
            handlers: {
              image: function () {
                QuillWatch.emit(this.quill.id);
              },
            },
          },
        },
      }
    }
  },
  watch: {
    value() {
      this.initValue();
    },
    disabled() {
      this.refreshDisabled();
    },
    inputValue() {
      this.handleInputConfirm();
    },
  },
  destroyed() {
    if (this.initObj) {
      clearTimeout(this.initObj);
    }
  },
  mounted() {
    this.initValue();
  },
  data() {
    return {
      loading: true,
      inputValue: null,
      initObj: null,
    };
  },
  methods: {
    initValue() {
      this.inputValue = this.value;
      if (!this.initObj) {
        this.initObj = setTimeout(this.initEditor, this.loadingDelay);
      }
    },
    initEditor() {
      this.loading = false;
      this.$nextTick(() => {
        this.refreshDisabled();
      })
    },
    refreshDisabled() {
      if (this.$refs.myQuillEditor) {
        this.$refs.myQuillEditor.quill.enable(!this.disabled);
      }
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
    handleInputConfirm() {
      this.$emit("blur");
      this.$emit("change", this.inputValue);
      this.dispatch("ElFormItem", "el.form.change");
    },
  },
};
</script>