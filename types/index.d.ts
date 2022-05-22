declare module "vue-element-xtable" {

    interface DrawerOptions {
        /** 标题 */
        title: string,
        /** 组件 */
        component: any,
        /** 刷新事件 */
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

    interface UploadResponse {
        /**  上传地址 */
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

    interface Image {

        /**
         * 请求列表数据
         * @param handler 处理器
         */
        setUploadHandler(handler: (file: any, type?: string, maxSize?: Number) => UploadResponse): void

    }

    interface Table {

        /**
         * 请求列表数据
         * @param handler 处理器
         */
        setListHandler(handler: (apiUrl: string, params?: Object, options?: ListOptions) => ListResponse): void

    }

    interface Select {

        /**
         * 请求详细数据
         * @param handler 处理器
         */
        setDetailHandler(handler: (apiUrl: string, value?: any) => Object): void;

        /**
         * 获取选择器配置信息
         * @param handler 处理器
         */
        setConfigHandler(handler: (dataType?: any) => Object): void;

    }

    /**
     * 初始化组件
     * @param vue 对象
     */
    function install(vue: any): void;

    var Image: Image;

    var Drawer: Drawer;

    var Select: Select;

    var Table: Table;

}