<template>
  <quill-editor v-model="inputValue" :options="editorOption" />
</template>

<style lang="less">
.ql-snow .ql-tooltip {
  z-index: 99999;
}
</style>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import { ImageExtend } from "./_quill/imageExtend";
import { QuillWatch } from "./_quill/QuillWatch";

Quill.register("modules/ImageExtend", ImageExtend);

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
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image", "video"],
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
        } catch (error) {}
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