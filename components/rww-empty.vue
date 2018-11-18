<style scoped>
  @import "../assets/css/base.pcss";
  @import "../assets/css/vars.pcss";
  .empty {
    @mixin flex-column;
    align-items: center;
    padding-top: 2em;
    color: var(--gray);
    width: 100%;
    .iconfont {
      font-size: 48px;
    }
    .text {
    }
  }
</style>
<template>
  <div class="empty">
    <div class="iconfont icon-meiyoushuju"></div>
    <div class="text">{{text}}</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {};
    },
    props: {
      text: {
        type: String,
        default: '没有数据'
      }
    },
    components: {},
    methods: {},
    onLoad () {
    }
  };
</script>
