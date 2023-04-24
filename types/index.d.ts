declare module "vue-element-xui" {


  /** 获取列表数据参数 */
  interface ListOptions {
    /** 页码数值 */
    pageNum: string,
    /** 单页数量 */
    pageSize: number,
    /** 刷新事件 */
    orderBy?: string,
  }

  /**
   * 获取列表返回格式
   */
  interface ListResponse {
    /** 页码数值 */
    page: number,
    /** 单页数量 */
    size: number,
    /** 总数据条数 */
    total: number,
    /** 数据列表 */
    list: any[],
  }

  /**
   * 上传文件返回格式
   */
  interface UploadResponse {
    /**  文件地址 */
    url: string,
  }

  /**
   * Drawer参数
   */
  interface DrawerOptions {
    /** 标题 */
    title: string,
    /** 组件 */
    component: any,
    /** 遮罩 */
    model?: boolean;
    /** 显示关闭 */
    showClose?: boolean;
    /** 点击遮罩区域关闭 */
    closeable?: boolean;
    /** 刷新回调 */
    refresh?: Function,
    /** 返回值回调 */
    result?: Function,
    /** Params参数 */
    params?: any,
    /** Query参数 */
    query?: any;
  }

  /**
   * 验证码参数
   */
  interface IdentifyOptions {
    /** dialog 宽度 */
    width?: number,
    /** dialog 标题 */
    title?: string,
    /** 验证码文案：图形验证码 */
    formLabel?: string,
    /** 验证码输入提示：请输入图中验证码 */
    formPlaceholder?: string,
    /** 错误提示：验证码错误 */
    formErrorText?: string,
    /** 取消按钮文案 */
    cancelLabel: string,
    /** 确认按钮文案 */
    okLabel: string,
    /** 验证码生成规则 */
    codeStr?: string,
    /** 验证码长度 */
    codeLen: number,
  }

  /**
   * 图片预览参数
   * 参考：https://image-viewer.awesome-components.com/
   */
  interface ImageViewerOptions {
    /** 预览图片列表 */
    images?: {
      mainUrl: string;
      thumbnailUrl?: string;
      description?: string;
    }[] | string[];
    /** 自定义按钮 */
    buttons?: {
      name: string;
      iconSrc: string;
      iconSize: string;
      onSelect: () => void;
    }[];
    /** 当前选中下标 */
    currentSelected?: number;
    /** 是否显示缩略图 */
    showThumbnails?: boolean;
    /** 放大缩小开关 */
    isZoomable?: boolean;
    /** 图片拉伸 */
    stretchImages?: boolean;
    /** 样式 */
    style?: object;
  }

  /**
   * 图片裁剪参数
   * 参考：https://github.com/xyxiao001/vue-cropper
   */
  interface CropperOptions {
    /** 裁剪图片的地址 url 地址, base64, blob */
    img: string,
    /** 裁剪框的大小信息 */
    info: boolean,
    /** 裁剪弹窗标题 */
    title?: string,
    /** 裁剪弹窗确认按钮 */
    okLabel?: string,
    /** 裁剪弹窗取消按钮 */
    cancelLabel?: string,
    /** 裁剪生成图片的质量 */
    outputSize?: number,
    /** 裁剪生成图片的格式 jpeg, png, webp */
    outputType?: string,
    /** 图片是否允许滚轮缩放 */
    canScale?: boolean,
    /** 是否默认生成截图框 */
    autoCrop?: boolean,
    /** 默认生成截图框宽度 */
    autoCropWidth?: number,
    /** 默认生成截图框高度 */
    autoCropHeight?: number,
    /** 是否开启截图框宽高固定比例 */
    fixed?: boolean,
    /** 固定截图框大小 不允许改变 */
    fixedBox?: boolean,
    /** 上传图片是否可以移动 */
    canMove?: boolean,
    /** 截图框能否拖动 */
    canMoveBox?: boolean,
    /** 上传图片按照原始比例渲染 */
    original?: boolean,
    /** 截图框是否被限制在图片里面 */
    centerBox?: boolean,
    /** true 为展示真实输出图片宽高 false 展示看到的截图框宽高 */
    infoTrue?: boolean,
    /** 是否输出原图比例的截图 */
    full?: boolean,
    /** 图片根据截图框输出比例倍数 */
    enlarge?: number,
    /** 图片默认渲染方式 contain , cover, 100px, 100% auto */
    mode?: string,
    /** 裁剪完成的回调函数 */
    callback?: Function
  }

  /** 验证码 */
  interface Identify {

    check(callback: Function, options?: IdentifyOptions): void;

  }

  /** 图片预览 */
  interface ImageViewer {

    showImage(options: ImageViewerOptions): void;

  }

  /** 图片裁剪 */
  interface Cropper {

    /**
     * 显示图片裁剪
     */
    showCropper(options: CropperOptions, callback?: Function): void;

  }

  /**
   * 抽屉弹窗
   */
  interface Drawer {

    /**
     * 是否打开
     */
    isOpened(): boolean;

    /**
     * 关闭页面
     */
    closeDrawer(): void;

    /**
     * 返回页面
     */
    backDrawer(): void;

    /**
     * 刷新页面
     */
    refreshDrawer(): void;

    /**
     * 返回值页面
     */
    resultDrawer(result: any): void;

    /**
     * 打开页面
     * @param options 页面参数
     * @param create 是否新建drawer
     */
    openDrawer(options: DrawerOptions, create?: boolean): void;


  }

  /**
   * 初始化组件
   * @param vue 对象
   */
  function install(vue: any): void;

  /**
   * 设置处理文件上传
   * @param handler 回调
   */
  function setFileUploadHandler(handler: (file: any, type?: string) => UploadResponse | Promise<UploadResponse>): void

  /**
   * 设置请求数据列表回调
   * @param handler 回调
   */
  function setDataListHandler(handler: (apiUrl: string, params?: Object, options?: ListOptions) => ListResponse | Promise<ListResponse>): void;

  /**
   * 设置请求详细数据回调
   * @param handler 回调
   */
  function setDataDetailHandler(handler: (apiUrl: string, value?: any) => object | Promise<object>): void;

  /**
   * 设置选择器配置信息回调
   * @param handler 回调
   */
  function setDataConfigHandler(handler: (dataType?: any) => object | Promise<object>): void;

  /**
   * Drawer抽屉组件
   */
  var Drawer: Drawer;

  /**
   * Identify验证码组件
   */
  var Identify: Identify;

  /**
   * ImageViewer图片预览
   */
  var ImageViewer: ImageViewer;

  /**
   * Cropper图片裁剪
   */
  var Cropper: Cropper;

}