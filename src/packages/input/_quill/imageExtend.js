import { QuillWatch } from './QuillWatch'
/**
 * @description 图片功能拓展： 增加上传 拖动 复制
 */
export class ImageExtend {

  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: uploadHandler
   */
  constructor(quill, config = {}) {
    this.id = Math.random()
    this.quill = quill
    this.quill.id = this.id
    this.config = config
    this.file = ''  // 要上传的图片
    this.imgURL = ''  // 图片地址
    quill.root.addEventListener('paste', this.pasteHandle.bind(this), false)
    quill.root.addEventListener('drop', this.dropHandle.bind(this), false)
    quill.root.addEventListener('dropover', function (e) {
      e.preventDefault()
    }, false)
    QuillWatch.on(this.id, this)
  }

  /**
   * @description 粘贴
   * @param e
   */
  pasteHandle(e) {
    // 拦截原始的操作
    e.preventDefault();
    // 处理图片粘贴
    let clipboardData = e.clipboardData
    let i = 0
    let items, item, types
    if (clipboardData) {
      items = clipboardData.items;
      if (!items) {
        return;
      }
      item = items[0];
      types = clipboardData.types || [];
      for (; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i];
          break;
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        this.file = item.getAsFile()
        let self = this
        if (self.config.uploadHandler && typeof self.config.uploadHandler === 'function') {
          this.uploadImg()
        } else {
          this.toBase64()
        }
      }
    }
  }

  /**
   * 拖拽
   * @param e
   */
  dropHandle(e) {
    // 拦截原始的操作
    e.preventDefault()
    // 处理拖拽上传
    const self = this
    self.file = e.dataTransfer.files[0]; // 获取到第一个上传的文件对象
    if (self.config.uploadHandler && typeof self.config.uploadHandler === 'function') {
      self.uploadImg()
    } else {
      self.toBase64()
    }
  }

  /**
   * @description 将图片转为base4
   */
  toBase64() {
    const self = this
    const reader = new FileReader()
    reader.onload = (e) => {
      // 返回base64
      self.imgURL = e.target.result
      self.insertImg()
    }
    reader.readAsDataURL(self.file)
  }

  /**
   * @description 上传图片到服务器
   */
  uploadImg() {
    const self = this
    if (self.config.fileType && self.config.fileType.length > 0) {
      if (!self.config.fileType.includes(self.file.type)) {
        return;
      }
    }
    if (self.config.onStart && typeof self.config.onStart === 'function') {
      self.config.onStart(res, QuillWatch.active.quill)
    }
    self.config.uploadHandler(self.file, function (res) {
      self.imgURL = res;
      if (self.config.onSuccess && typeof self.config.onSuccess === 'function') {
        self.config.onSuccess(res, QuillWatch.active.quill)
      }
      self.insertImg();
    }, function (err) {
      if (self.config.onError && typeof self.config.onError === 'function') {
        self.config.onError(err, QuillWatch.active.quill)
      }
    });
  }

  /**
   * @description 往富文本编辑器插入图片
   */
  insertImg() {
    const self = this
    let length = (this.quill.selection && this.quill.selection.lastRange || {}).index || this.quill.getLength()
    self.quill.insertEmbed(length, 'image', self.imgURL, 'user')
    self.quill.setSelection(length + 1)
  }

}