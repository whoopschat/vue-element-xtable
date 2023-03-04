<template>
  <quill-editor v-if="!disabled" v-model="inputValue" :options="editorOption" />
  <div class="ql-snow ql-editor" v-else v-html="inputValue"></div>
</template>

<style lang="less">
.ql-snow .ql-tooltip {
  z-index: 99999;
}
.ql-editor {
  min-height: 240px;
  img {
    max-width: 100%;
  }
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
</style>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor, Quill } from "vue-quill-editor";

// toolbar
import { ButtonExtend } from "./_quill/buttonExtend";
Quill.register("modules/buttonExtend", ButtonExtend);

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
    buttons: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    value() {
      this.initValue();
    },
    inputValue() {
      this.handleInputConfirm();
    },
  },
  mounted() {
    this.initValue();
  },
  data() {
    return {
      editor: null,
      inputValue: null,
      editorOption: {
        theme: "snow",
        placeholder: this.placeholder,
        modules: {
          buttonExtend: {
            buttons: this.buttons,
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
          resize: {
            // See optional "config" below
            modules: ["Resize", "Toolbar"],
          },
          toolbar: {
            container: [
              [{ size: fontSize }],
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
      },
    };
  },
  methods: {
    initValue() {
      this.inputValue = this.value;
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