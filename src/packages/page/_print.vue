<template>
  <div class="xPagePrint">
    <div
      class="print-header"
      ref="headerHeight"
      v-if="$slots.header"
      v-resize="handleResize"
    >
      <div class="print-wrap">
        <div class="header-content">
          {{ headerHeight }} - {{ footerHeight }}
          <slot name="header"></slot>
        </div>
      </div>
    </div>
    <div class="print-footer" ref="footerHeight" v-if="$slots.footer">
      <div class="print-wrap">
        <div class="footer-content">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
    <div class="print-wrap">
      <table>
        <thead>
          <tr>
            <td>
              <div
                class="print-header-space"
                :style="'margin-bottom:' + headerHeight + 'px;'"
              ></div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <!--*** CONTENT GOES HERE ***-->
              <div class="print-content">
                <slot></slot>
              </div>
              <!-- ./ end 内容区 -->
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div
                class="print-footer-space"
                :style="'margin-top:' + footerHeight + 'px;'"
              ></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style lang="less" scoped>
@printWidth: 768px;

.xPagePrint {
  background: #dddddd;

  .print-wrap {
    margin: 0 auto;
    background: #ffffff;
  }

  .print-header,
  .print-header-space {
    .header-content {
      width: calc(100% - 20px);
      padding: 5px 10px;
      border-bottom: 1px solid #d1d1d1;
    }
  }

  .print-footer,
  .print-footer-space {
    .footer-content {
      width: calc(100% - 20px);
      padding: 5px 10px;
      border-top: 1px solid #d1d1d1;
    }
  }

  .print-header {
    position: fixed;
    top: 0mm;
    width: 100%;
  }

  .print-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .print-content {
    width: calc(100% - 20px);
    padding: 0px 10px;
    page-break-after: always;
  }

  @media print {
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    body {
      margin: 0;
    }
    .no-print {
      display: none;
    }
    .no-screen {
      display: block;
    }
    .print-box {
      border: 0px solid #d1d1d1;
    }
  }

  @media screen {
    .no-print {
      display: block;
    }
    .no-screen {
      display: none;
    }
    .print-box {
      border: 1px solid #d1d1d1;
    }
    .print-wrap {
      width: @printWidth;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      headerHeight: 0,
      footerHeight: 0,
    };
  },
  mounted() {
    this.handleResize();
  },
  computed: {
    contentStyle() {
      return `margin-top:${this.headerHeight}px; margin-bottom:${this.footerHeight}px;`;
    },
  },
  methods: {
    handleResize() {
      try {
        if (this.$refs.headerHeight) {
          this.headerHeight = this.$refs.headerHeight.offsetHeight + 8;
        }
      } catch (error) {}
      try {
        if (this.$refs.footerHeight) {
          this.footerHeight = this.$refs.footerHeight.offsetHeight + 8;
        }
      } catch (error) {}
    },
  },
};
</script>