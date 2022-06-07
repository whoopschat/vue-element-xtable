import { QuillWatch } from './QuillWatch'
/**
 * @description 点击图片上传
 */
export function imgHandler() {
    let fileInput = document.querySelector('.quill-image-input');
    if (fileInput === null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.classList.add('quill-image-input');
        fileInput.style.display = 'none'
        // 监听选择文件
        fileInput.addEventListener('change', function () {
            let self = QuillWatch.active
            self.file = fileInput.files[0]
            fileInput.value = ''
            if (self.config.uploadHandler && typeof self.config.uploadHandler === 'function') {
                self.uploadImg()
            } else {
                self.toBase64()
            }
        })
        document.body.appendChild(fileInput);
    }
    fileInput.click();
}
