import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = () => new Vuex.Store({
  state: {
    drawerOpen: false, // 右侧弹框是否显示
    loading: false, // 是否显示Loading框
    order: {},
    title: '', // 页头标题
    is_vip: false, // 是否VIP
    selectedTab: 'home', // 选中的导航标签
  },
  mutations: {
    // 更新右侧弹出框是否显示
    UPDATE_DRAWER_OPEN(state, playLoad) {
      state.drawerOpen = playLoad.value;
    },
    UPDATE_LOADING(state, playLoad) {
      state.loading = playLoad.value;
    },
    UPDATE_ORDER(state, playLoad) {
      state.order = playLoad.value;
    },
    UPDATE_TITLE(state, playLoad) {
      state.title = playLoad.value;
    },
    UPDATE_IS_VIP(state, playLoad) {
      state.is_vip = playLoad.value;
    },
    UPDATE_SELECTED_TAB(state, playLoad) {
      state.selectedTab = playLoad.value;
    },
  },
  debug: true,
});
export default store;