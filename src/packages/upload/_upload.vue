<template>
  <div class="xUpload" :style="uploadStyle">
    <div class="x-upload-file-list" v-if="type == 'image'">
      <div class="x-upload-item-image" :key="i" v-for="(url, i) in currentUrls">
        <div
          class="x-upload-image-delete"
          v-if="!disabled"
          @click="handleDeleteImage(i)"
        >
          {{ deleteLabel }}
        </div>
        <el-image
          :src="url"
          :fit="imageViewFit"
          class="x-upload-image-view"
          @click="handlePreviewFile(url, $event)"
        />
      </div>
      </div>
      <div class="x-upload-file-list x-upload-file-urls" v-else>
        <div
          class="x-upload-item-file"
          :key="i"
          v-for="(url, i) in currentUrls"
        >
          <span>
            {{ url }}
          </span>
          <el-link
            type="danger"
            icon="el-icon-delete"
            @click="handleDeleteImage(i)"
          >
            {{ deleteLabel }}
          </el-link>
        </div>
      </div>
      <div
        v-if="
          !disabled &&
          (fileCount == 0 || fileCount > currentUrls.length) &&
          currentUrls.length > 0
        "
        class="x-upload-file-hr"
      ></div>
      <div
        class="x-upload-file-upload"
        v-if="!disabled && (fileCount == 0 || fileCount > currentUrls.length)"
      >
        <el-upload
          :show-file-list="false"
          :disabled="uploadLoading"
          :accept="uploadAcceptValue"
          :before-upload="handleUploadFile"
          action=""
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" v-if="uploadLoading">
            <i class="el-icon-loading" style="margin-right: 8px" />
            {{ loadingLabel }}
          </div>
          <template v-else>
            <div class="el-upload__text" v-html="uploadLabel"></div>
          </template>
        </el-upload>
        <div v-if="uploadErrorMsg" class="x-upload-file-error">
          {{ uploadErrorMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" >
.xUpload {
  border: var(--x-upload-border-width) solid var(--x-upload-border-color);
  border-radius: var(--x-upload-border-radius);

  .x-upload-file-error {
    color: #ff0000;
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .x-upload-file-upload {
    margin: 0px var(--x-upload-padding);
    .el-upload {
      display: block;

      .el-upload-dragger {
        width: 100%;
        border: 0px;
        border-radius: 0px;
      }
    }
  }

  .x-upload-file-hr {
    border-bottom: var(--x-upload-border-width) solid
      var(--x-upload-border-color);
    width: 100%;
  }

  .x-upload-file-list {
    display: flex;
    padding: calc(var(--x-upload-padding) / 2);

    &.x-upload-file-urls {
      flex-direction: column;
    }

    .x-upload-item-file {
      color: #676767;
      font-size: 14px;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      padding: calc(var(--x-upload-padding) / 2);
      line-height: 20px;
    }

    .x-upload-item-image {
      position: relative;
      overflow: hidden;
      margin: calc(var(--x-upload-padding) / 2);
      line-height: var(--x-upload-image-view-height);
      height: var(--x-upload-image-view-height);
      width: var(--x-upload-image-view-width);
      text-align: center;
      background-color: #f1f1f1;

      .x-upload-image-view {
        display: block;
        min-width: 100px;
        height: 100%;
        z-index: 0;
      }

      .x-upload-image-delete {
        right: 0;
        position: absolute;
        line-height: 20px;
        padding: 2px 8px;
        font-size: 12px;
        background-color: var(--x-upload-image-delete-color);
        color: #ffffff;
        cursor: pointer;
        opacity: 0.8;
        z-index: 1;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>

<script>
import { formatString } from '../../utils/string'
import ImageViewer from '../imageViewer'

export default {
  data() {
    return {
      currentUrls: [],
      uploadLoading: false,
      uploadErrorMsg: null,
    };
  },
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
      default: "file",
    },
    value: {
      type: String,
      default: "",
    },
    padding: {
      type: Number,
      default: 10,
    },
    borderColor: {
      type: String,
      default: "#DCDFE6",
    },
    borderRadius: {
      type: Number,
      default: 4,
    },
    borderWidth: {
      type: Number,
      default: 1,
    },
    imageViewWidth: {
      type: Number,
      default: 120,
    },
    imageViewHeight: {
      type: Number,
      default: 120,
    },
    imageViewFit: {
      type: String,
      default: "cover",
    },
    uploadAccept: {
      type: String,
    },
    uploadLabel: {
      type: String,
      default: "将文件拖到此处，或<em>点击上传</em>",
    },
    typeErrorLabel: {
      type: String,
      default: "文件格式错误",
    },
    sizeErrorLabel: {
      type: String,
      default: "文件大小不能超过{size}",
    },
    uploadErrorLabel: {
      type: String,
      default: "文件上传失败",
    },
    loadingLabel: {
      type: String,
      default: "正在上传中...",
    },
    deleteColor: {
      type: String,
      default: "#a7493d",
    },
    deleteLabel: {
      type: String,
      default: "移除",
    },
    fileType: {
      type: Array,
      default: () => [],
    },
    fileCount: {
      type: Number,
      default: 1,
    },
    fileSize: {
      type: Number,
      default: 1024,
    },
    imageCrop: {
      type: Boolean,
      default: false,
    },
    imageCropOptions: {
      type: Object,
      default: () => {
        return {}
      }
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
  computed: {
    uploadStyle() {
      return {
        "--x-upload-image-view-width": `${this.imageViewWidth}px`,
        "--x-upload-image-view-height": `${this.imageViewHeight}px`,
        "--x-upload-image-delete-color": `${this.deleteColor}`,
        "--x-upload-border-color": `${this.borderColor}`,
        "--x-upload-border-radius": `${this.borderRadius}px`,
        "--x-upload-border-width": `${this.borderWidth}px`,
        "--x-upload-padding": `${this.padding}px`,
      }
    },
    uploadFileTypes() {
      if (this.fileType && this.fileType.length > 0) {
        return this.fileType;
      }
      if (this.type == "image") {
        return ["image/png", "image/jpeg", "image/gif"];
      }
    },
    uploadAcceptValue() {
      if (this.uploadAccept) {
        return this.uploadAccept;
      }
      if (this.uploadFileTypes) {
        return this.uploadFileTypes.join(",");
      }
    },
  },
  mounted() {
    this.initValue();
  },
  methods: {
    initValue() {
      this.currentUrls = (this.value || "").split("|").filter((image) => {
        return !!image;
      });
    },
    converSize(limit) {
      var size = "";
      if (limit < 1 * 1024) {
        size = limit.toFixed(2) + "B";
      } else if (limit < 1 * 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 1 * 1024 * 1024 * 1024) {
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }
      var sizestr = size + "";
      var len = sizestr.indexOf(".");
      var dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
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
    handlePreviewFile(url, e) {
      if (this.type == 'image') {
        ImageViewer.showImage({
          images: [url]
        })
      }
    },
    handleUploadFile(file) {
      if (this.disabled) {
        return;
      }
      if (this.uploadLoading) {
        return;
      }
      if (file == null) {
        return;
      }
      if (this.uploadFileTypes && this.uploadFileTypes.length > 0) {
        if (!this.uploadFileTypes.includes(file.type)) {
          this.uploadErrorMsg = this.typeErrorLabel;
          return false;
        }
      }
      if (file.size / 1024 / 1024 > this.fileSize / 1024) {
        this.uploadErrorMsg = formatString(this.sizeErrorLabel, {
          size: this.converSize(
            this.fileSize * 1024
          )
        });
        return false;
      }
      let callUpload = (file) => {
        this.uploadLoading = true;
        this.uploadErrorMsg = null;
        this.$xUIFileUploadHandler(file, this.type)
          .then((data) => {
            this.uploadLoading = false;
            this.currentUrls.push(data);
            this.submitChange();
          })
          .catch((err) => {
            console.error(err);
            this.uploadErrorMsg = err || this.uploadErrorLabel;
          })
          .finally(() => {
            this.uploadLoading = false;
          });
      }
      if (this.imageCrop && this.type == "image") {
        this.$cropper.showCropper(Object.assign({
          img: file, // 裁剪图片的地址
          autoCropWidth: 150, // 默认生成截图框宽度
          autoCropHeight: 150, // 默认生成截图框高度
          outputType: "png", // 裁剪的默认输出格式
          centerBox: false,
        }, this.imageCropOptions || {}), res => {
          let blob = res.img;
          blob.lastModifiedDate = new Date();
          blob.name = file.name;
          callUpload(blob);
        })
      } else {
        callUpload(file)
      }
      return false;
    },
    handleDeleteImage(i) {
      if (this.disabled) {
        return;
      }
      this.currentUrls.splice(i, 1);
      this.submitChange();
    },
    submitChange() {
      this.$emit("change", this.currentUrls.join("|"));
      this.dispatch("ElFormItem", "el.form.change");
    },
  },
};
</script>