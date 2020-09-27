<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  mpType: "app",
  onLaunch() {
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>

<style lang="scss">
@import "~uni-vant/lib/common/index";

/*每个页面公共css */
page {
  background-color: $bgc-base;
  color: $c-base;
  font-size: $fz-md;
}

.theme-style__button {
  @include theme-style__button;
}

.section {
  margin: $s-sm 0;
  background-color: #fff;

  &__header {
    @include flex-row;
    @include bd-hairline-bottom;
    justify-content: space-between;
    padding: $s-sm $s-sm;
  }

  &__title {
    font-size: $fz-lg;
  }

  &__desc {
    @include flex-row;
    color: $c-light;
    font-size: $fz-sm;
  }

  &__body {
    padding: $s-md $s-sm;
  }
}
/* 省市区选择 */
.text-truncate {
  @include text-truncate;
}
.simple-address-content,
.simple-address-mask {
  z-index: $z-popover !important;
}

/* 布局 */
.layout-section {
  padding: 0 $s-sm;
  margin: $s-sm 0;
  background-color: #fff;
  &__head {
    @include bd-hairline-bottom;
    padding: $s-sm 0;
    font-size: $fz-lg;
  }
  &__body {
    padding: $s-sm 0;
  }
}
</style>
