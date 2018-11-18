<style scoped>
  @import "../assets/css/base.pcss";
  @import "../assets/css/vars.pcss";
  .bottomTab {
    @mixin flex-row;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .mu-appbar-left {
      .mu-button-wrapper {
        padding: 0;
      }
    }
    .mu-appbar-title {
      text-align: center;
    }
  }
</style>
<template>
  <!-- 底部导航 -->
  <mu-bottom-nav class="bottomTab" :value="value" color="primary">
    <mu-bottom-nav-item title="预约寄件" value="order" icon=":iconfont icon-icon-toolbar-tool-aieps"
                        to="/order/add"></mu-bottom-nav-item>
    <mu-bottom-nav-item title="订单纪录" value="list" icon=":iconfont icon-round_text_fill"
                        to="/order/list"></mu-bottom-nav-item>
    <mu-bottom-nav-item title="现金红包" value="redPacket" icon=":iconfont icon-redpacket_fill"
                        to="/packet/list"></mu-bottom-nav-item>
    <mu-bottom-nav-item title="个人中心" value="home" icon=":iconfont icon-homefill"
                        to="/account/home"></mu-bottom-nav-item>
  </mu-bottom-nav>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  created() {
    console.log(this.value);
  },
};
</script>
