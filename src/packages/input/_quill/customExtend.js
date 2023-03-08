function $create(elName) {
  return document.createElement(elName);
}

function $setAttr(el, key, value) {
  return el.setAttribute(key, value);
}

export class CustomExtend {

  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: buttons
   */
  constructor(quill, config = {}) {
    this.id = Math.random()
    this.quill = quill
    this.quill.id = this.id
    this.config = config
    // Add button to all quill toolbar instances
    const toolbarModule = quill.getModule("toolbar");
    if (!toolbarModule) {
      throw new Error(
        'quill.ToolbarExtend requires the "toolbar" module to be included too'
      );
    }
    let toolbarEl = toolbarModule.container;
    if (this.config.customs instanceof Array) {
      (this.config.customs || []).forEach((customOptions, i) => {
        const customContainer = $create("span");
        $setAttr(customContainer, "class", "ql-formats");
        if (customOptions.type == "label") {
          customContainer.innerHTML = customOptions.innerHTML || customOptions.title || `Custom${i + 1}`;
          customContainer.style = "font-size:14px;width: auto;" + customOptions.styleValue;
        } else {
          const button = $create("button");
          button.innerHTML = customOptions.innerHTML || customOptions.title || `Custom${i + 1}`;
          button.title = customOptions.title || `button${i + 1}`;
          button.style = "font-size:14px;width: auto;" + customOptions.styleValue;
          button.type = "button";
          button.onclick = (e) => {
            if (typeof customOptions.onClick == 'function') {
              customOptions.onClick.apply(this, [this.quill]);
            }
            e.preventDefault();
          };
          customContainer.appendChild(button);
        }
        toolbarEl.appendChild(customContainer);
      });
    }
  }


}