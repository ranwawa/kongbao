import Vue from "vue";
import App from "./App.vue";
import UvField from "uni-vant/lib/field.vue";
import UvButton from "uni-vant/lib/button.vue";
import UvCellGroup from "uni-vant/lib/cell-group.vue";
import UvCell from "uni-vant/lib/cell.vue";
import UvIcon from "uni-vant/lib/icon.vue";

Vue.config.productionTip = false;

Vue.component("UvField", UvField);
Vue.component("UvButton", UvButton);
Vue.component("UvCellGroup", UvCellGroup);
Vue.component("UvCell", UvCell);
Vue.component("UvIcon", UvIcon);
Vue.mixin({
  data: () => ({
    themeColor: `#ff9000`,
  }),
});

new App().$mount();
