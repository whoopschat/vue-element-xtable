function $create(elName) {
    return document.createElement(elName);
}

function $setAttr(el, key, value) {
    return el.setAttribute(key, value);
}

export class ButtonExtend {

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
        if (this.config.buttons instanceof Array) {
            (this.config.buttons || []).forEach((buttonOptions, i) => {
                const buttonContainer = $create("span");
                $setAttr(buttonContainer, "class", "ql-formats");
                const button = $create("button");
                button.innerHTML = buttonOptions.buttonHTML || `Button${i + 1}`;
                button.title = buttonOptions.buttonTitle || `button${i + 1} title`;
                button.style = buttonOptions.buttonStyle || "font-size:14px;width: auto;";
                button.type = "button";
                button.onclick = (e) => {
                    if (typeof buttonOptions.onClick == 'function') {
                        buttonOptions.onClick.apply(this, [this.quill]);
                    }
                    e.preventDefault();
                };
                buttonContainer.appendChild(button);
                toolbarEl.appendChild(buttonContainer);
            });
        }
    }


}