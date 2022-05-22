<template>
  <div class="xImage">
    <span :key="i" v-for="(image, i) in currentImages">
      <div class="item">
        <div class="delete" v-if="!disabled" @click="handleDeleteImage(i)">
          {{ deleteLabel }}
        </div>
        <img
          :src="image"
          class="image"
          mode="heightFix"
          @click="handleImagePreview(image)"
        />
      </div>
    </span>
    <span
      class="upload-button"
      v-if="!disabled && fileCount > currentImages.length"
    >
      <span v-if="uploadLoading">{{ loadingLabel }}</span>
      <span v-else>
        <span>{{ uploadLabel }}</span>
        <input
          style="-ms-filter: 'alpha(opacity=0)'"
          type="file"
          @change="handleUploadFile"
        />
      </span>
    </span>
    <div v-if="uploadErrorMsg" class="error">
      {{ uploadErrorMsg }}
    </div>
  </div>
</template>


<style lang="less" >
.xImage {
  .error {
    font-size: 12px;
    color: #ff0000;
  }

  .item {
    position: relative;
    display: inline-block;
    overflow: hidden;
    max-width: 300px;
    height: 80px;
    line-height: 80px;
    margin-right: 5px;
    text-align: center;
    background-color: #f1f1f1;
    border: 1px solid #f1f1f1;

    .image {
      display: block;
      min-width: 100px;
      height: 100%;
    }

    .delete {
      position: absolute;
      right: 0;
      height: 20px;
      line-height: 20px;
      padding: 0px 5px;
      background-color: #333333;
      color: #ffffff;
      cursor: pointer;
    }
  }

  .upload-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    border: 1px dashed #8c939d;
    cursor: pointer;
  }

  .upload-button input {
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    font-size: 200px;
  }

  .disabled {
    background-color: #f1f1f1;
    cursor: no-drop;
  }

  .hide {
    display: none;
  }
}
</style>


<script>
export default {
  data() {
    return {
      currentImages: [],
      uploadLoading: false,
      uploadErrorMsg: null,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    loadingLabel: {
      type: String,
      default: "正在上传中...",
    },
    uploadLabel: {
      type: String,
      default: "+ 上传图片",
    },
    deleteLabel: {
      type: String,
      default: "删除",
    },
    fileCount: {
      type: Number,
      default: 1,
    },
    fileSize: {
      type: Number,
      default: 1024,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value() {
      this.initValue();
    },
  },
  mounted() {
    this.initValue();
  },
  methods: {
    initValue() {
      this.currentImages = (this.value || "").split(",").filter((image) => {
        return !!image;
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
        } catch (error) {}
      }, 200);
    },
    handleImagePreview(image) {
      this.$xImagePreviewHandler(image);
    },
    handleUploadFile(e) {
      if (this.disabled) {
        return;
      }
      let $target = e.target || e.srcElement;
      let upload = $target.files[0];
      if (upload == null) {
        return;
      }
      $target.value = "";
      this.uploadLoading = true;
      this.uploadErrorMsg = null;
      this.$xImageUploadHandler(upload, "image", this.fileSize)
        .then((data) => {
          this.uploadLoading = false;
          this.currentImages.push(data);
          this.submitChange();
        })
        .catch((err) => {
          console.error(err);
          this.uploadErrorMsg = err || "上传文件失败";
        })
        .finally(() => {
          this.uploadLoading = false;
        });
    },
    handleDeleteImage(i) {
      if (this.disabled) {
        return;
      }
      this.currentImages.splice(i, 1);
      this.submitChange();
    },
    submitChange() {
      let newValue = this.currentImages.join(",");
      this.$emit("change", newValue);
      this.dispatch("ElFormItem", "el.form.change");
    },
  },
};
</script>