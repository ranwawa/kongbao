import Vue from 'vue';
import Toast from 'muse-ui-toast';

Vue.use(Toast, {
  position: 'top',
  time: 5000,
  close: true,
  closeIcon: ':iconfont icon-roundclosefill',
  successIcon: ':iconfont icon-unfold',
});