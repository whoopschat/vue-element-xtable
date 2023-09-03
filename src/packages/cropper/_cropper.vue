<template>
  <div class="xCroper">
    <el-dialog
      :title="option.title"
      :visible.sync="dialogVisiblex"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :width="(option.cropperWidth || 550) + 'px'"
      custom-class="xCroper"
      append-to-body
      top="50px"
    >
      <div class="cropper-content">
        <div class="cropper" :style="styleValue">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            :fixed="option.fixed"
            :fixedNumber="[option.autoCropWidth, option.autoCropHeight]"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :full="option.full"
            :enlarge="option.enlarge"
            :mode="option.mode"
          >
          </vue-cropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="$xUISize" @click="dialogVisiblex = false">
          {{ option.cancelLabel }}
        </el-button>
        <el-button :size="$xUISize" type="primary" @click="finish">
          {{ option.okLabel }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from './src/vue-cropper.vue'

const defaultOptions = {
  info: true, // 裁剪框的大小信息
  full: false, // 是否输出原图比例的截图
  title: "图片剪裁", // 裁剪弹窗标题
  okLabel: "确认", // 裁剪弹窗确认按钮
  cancelLabel: "取消", // 裁剪弹窗取消按钮
  outputSize: 1, // 裁剪生成图片的质量
  outputType: 'png', // 裁剪生成图片的格式 jpeg, png, webp
  canScale: true, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixed: true, // 是否开启截图框宽高固定比例
  fixedBox: true, // 固定截图框大小 不允许改变
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: false, // 截图框是否被限制在图片里面
  infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  enlarge: 1, // 图片根据截图框输出比例倍数
  mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto
}

export default {
  components: {
    VueCropper
  },
  data() {
    return {
      dialogVisiblex: false,
      unimgurl: '',
      option: {
        img: '', // 裁剪图片的地址 url 地址, base64, blob
      },
    }
  },
  computed: {
    styleValue() {
      return {
        "--x-cropper-height": `${this.option.cropperHeight || 512}px`,
        "--x-cropper-width": `${this.option.cropperWidth || 550}px`,
        "text-align": "center",
      }
    }
  },
  methods: {
    showCropper(obj, callback) {
      this.option = Object.assign({}, defaultOptions, { callback }, obj || {});
      this.dialogVisiblex = true
    },
    finish() {
      // 获取截图的数据
      let that = this
      this.$refs.cropper.getCropBlob(data => {
        that.unimgurl = data
        that.confirm()
      })
    },
    confirm() {
      if (this.option && typeof this.option.callback === 'function') {
        this.option.callback({ img: this.unimgurl })
      }
      this.dialogVisiblex = false
    },
    cancel() {
      this.dialogVisiblex = false
    }
  }
}
</script>

<style lang="less" >
.xCroper {
  .el-dialog__body {
    padding: 0px !important;
  }
  .el-dialog__footer {
    padding: 20px 20px !important;
  }
  .cropper {
    height: var(--x-cropper-height);
    width: var(--x-cropper-width);
  }
}
</style>
