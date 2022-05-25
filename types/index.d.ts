declare module "vue-element-xtable" {

    interface DrawerOptions {
        /** 标题 */
        title: string,
        /** 组件 */
        component: any,
        /** 刷新回调 */
        refresh?: Function,
        /** 编辑模式 */
        editable?: boolean,
        /** 编辑模式提示文案 */
        editableText?: string,
        /** Params参数 */
        params?: any,
        /** Query参数 */
        query?: any;
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
     * 数据详情返回格式
     */
    interface DetailResponse {
        [key]: any,
    }


    /**
     * 上传文件返回格式
     */
    interface UploadResponse {
        /**  文件地址 */
        url: string,
    }
    

    interface Drawer {

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
     * 设置处理文件预览回调
     * @param handler 回调
     */
    function setFilePreviewHandler(handler: (url: any, type?: string) => void): void

    /**
     * 设置处理文件上传
     * @param handler 回调
     */
    function setFileUploadHandler(handler: (file: any, type?: string) => UploadResponse): void

    /**
     * 设置请求详细数据回调
     * @param handler 回调
     */
    function setDataDetailHandler(handler: (apiUrl: string, value?: any) => DetailResponse): void;

    /**
     * 设置请求数据列表回调
     * @param handler 回调
     */
    function setDataListHandler(handler: (apiUrl: string, params?: Object, options?: ListOptions) => Object): void;

    /**
     * 设置选择器配置信息回调
     * @param handler 回调
     */
    function setDataConfigHandler(handler: (dataType?: any) => Object): void;

    /**
     * Drawer窗口组件
     */
    var Drawer: Drawer;

}