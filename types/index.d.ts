declare module "vue-element-xui" {

  interface DrawerOptions {
    /** 标题 */
    title: string,
    /** 组件 */
    component: any,
    /** 刷新回调 */
    refresh?: Function,
    /** Params参数 */
    params?: any,
    /** Query参数 */
    query?: any;
  }

  interface ImageViewerOptions {
    images?: {
      mainUrl: string;
      thumbnailUrl?: string;
      description?: string;
    }[] | string[];
    buttons?: {
      name: string;
      iconSrc: string;
      iconSize: string;
      onSelect: () => void;
    }[];
    currentSelected?: number;
    showThumbnails?: boolean;
    isZoomable?: boolean;
    stretchImages?: boolean;
    style?: object;
  }

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

  interface ListOptions {
    /** 页码数值 */
    pageNum: string,
    /** 单页数量 */
    pageSize: number,
    /** 刷新事件 */
    orderBy?: string,
  }

  /**
   * 数量列表返回格式
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

  /** 图片预览 */
  interface ImageViewer {

    showImage(options: ImageViewerOptions): void;

  }

  interface Identify {

    check(callback: Function, options?: IdentifyOptions): void;

  }

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
     * 刷新页面
     */
    refreshDrawer(): void;

    /**
     * 返回页面
     */
    backDrawer(): void;

    /**
     * 打开页面
     * @param options 页面参数
     */
    openDrawer(options: DrawerOptions): void;


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
   * Drawer窗口组件
   */
  var Drawer: Drawer;

  /**
   * Identify验证码
   */
  var Identify: Identify;

  /**
   * ImageViewer图片预览
   */
  var ImageViewer: ImageViewer;

}