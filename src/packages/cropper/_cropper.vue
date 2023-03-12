<template>
  <div class="xCroper">
    <el-dialog
      :title="option.title"
      :visible.sync="dialogVisiblex"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="xCroper"
      append-to-body
      width="380px"
      top="50px"
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
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
            :fixedNumber="option.fixedNumber"
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
        <el-button
          :size="$xUISize"
          type="primary"
          @click="finish"
          :loading="loading"
        >
          {{ option.okLabel }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from './src/vue-cropper.vue'

export default {
  components: {
    VueCropper
  },
  data() {
    return {
      dialogVisiblex: false,
      loading: false,
      option: {
        img: '', // 裁剪图片的地址 url 地址, base64, blob
        info: true, // 裁剪框的大小信息
        title: "图片剪裁", // 裁剪弹窗标题
        okLabel: "确认", // 裁剪弹窗确认按钮
        cancelLabel: "取消", // 裁剪弹窗取消按钮
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式 jpeg, png, webp
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 345, // 默认生成截图框宽度
        autoCropHeight: 245, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        full: true, // 是否输出原图比例的截图
        enlarge: '1', // 图片根据截图框输出比例倍数
        mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto
      },
      unimgurl: '',
      success: () => { } // 回调方法
    }
  },
  methods: {
    showCropper(obj) {
      if (obj.img) {
        this.option.img = obj.img
      }
      //裁剪弹窗标题
      if (obj.title) {
        this.option.title = obj.title
      }
      //裁剪弹窗确认按钮
      if (obj.okLabel) {
        this.option.okLabel = obj.okLabel
      }
      //裁剪弹窗取消按钮
      if (obj.cancelLabel) {
        this.option.cancelLabel = obj.cancelLabel
      }
      //裁剪生成图片的质量
      if (obj.outputSize) {
        this.option.outputSize = obj.outputSize
      } else {
        this.option.outputSize = 1
      }
      //裁剪生成图片的格式
      if (obj.outputType) {
        this.option.outputType = obj.outputType
      } else {
        this.option.outputType = 'png'
      }
      //裁剪框的大小信息
      if (obj.info) {
        this.option.info = obj.info
      } else {
        this.option.info = true
      }
      //图片是否允许滚轮缩放
      if (obj.canScale) {
        this.option.canScale = obj.canScale
      } else {
        this.option.canScale = false
      }
      //是否默认生成截图框
      if (obj.autoCrop) {
        this.option.autoCrop = obj.autoCrop
      } else {
        this.option.autoCrop = true
      }
      //默认生成截图框宽度
      if (obj.autoCropWidth) {
        this.option.autoCropWidth = obj.autoCropWidth
      } else {
        this.option.autoCropWidth = 375
      }
      //默认生成截图框高度
      if (obj.autoCropHeight) {
        this.option.autoCropHeight = obj.autoCropHeight
      } else {
        this.option.autoCropHeight = 245
      }
      //固定截图框大小 不允许改变
      if (obj.fixedBox) {
        this.option.fixedBox = obj.fixedBox
      } else {
        this.option.fixedBox = false
      }
      //是否开启截图框宽高固定比例
      if (obj.fixed) {
        this.option.fixed = obj.fixed
      } else {
        this.option.fixed = true
      }
      //截图框的宽高比例
      if (obj.fixedNumber) {
        this.option.fixedNumber = obj.fixedNumber
      } else {
        this.option.fixedNumber = [this.option.autoCropWidth, this.option.autoCropHeight]
      }
      //上传图片是否可以移动
      if (obj.canMove) {
        this.option.canMove = obj.canMove
      } else {
        this.option.canMove = true
      }
      //截图框能否拖动
      if (obj.canMoveBox) {
        this.option.canMoveBox = obj.canMoveBox
      } else {
        this.option.canMoveBox = true
      }
      //上传图片按照原始比例渲染
      if (obj.original) {
        this.option.original = obj.original
      } else {
        this.option.original = false
      }
      //截图框是否被限制在图片里面
      if (obj.centerBox) {
        this.option.centerBox = obj.centerBox
      } else {
        this.option.centerBox = true
      }
      //true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      if (obj.infoTrue) {
        this.option.infoTrue = obj.infoTrue
      } else {
        this.option.infoTrue = true
      }
      //是否输出原图比例的截图
      if (obj.full) {
        this.option.full = obj.full
      } else {
        this.option.full = true
      }
      //图片根据截图框输出比例倍数
      if (obj.enlarge) {
        this.option.enlarge = obj.enlarge
      } else {
        this.option.enlarge = '1'
      }
      //图片默认渲染方式
      if (obj.mode) {
        this.option.mode = obj.mode
      } else {
        this.option.mode = 'contain'
      }
      if (obj.success) {
        this.success = obj.success
      } else {
        this.success = () => { }
      }
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
      this.success({
        img: this.unimgurl
      })
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
    width: 380px;
    height: 340px;
  }
}
</style>
