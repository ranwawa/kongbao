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
</style>
