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
  border-radius: 2em !important;
  border-color: transparent !important;
  background: linear-gradient(to right, $c-theme, $c-theme-light) $c-theme-light;
  color: #fff !important;
}
</style>
