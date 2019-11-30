<template>
  <div id="app">
    <nuxt/>
    <!-- 顶部导航 -->
    <mu-appbar :title="title" color="primary" z-depth="5">
      <mu-button icon slot="right" @click="UPDATE_DRAWER_OPEN">
        <mu-icon value=":iconfont icon-sort" size="28"></mu-icon>
      </mu-button>
      <mu-button slot="left" flat text-color="#fff" @click="goBack">
        <mu-icon value=":iconfont icon-back_light" left color="#fff"></mu-icon>
        返回
      </mu-button>
    </mu-appbar>
    <!--右侧导航 -->
    <mu-drawer :open.sync="open" :docked="false" right>
      <mu-list nested-indent toggle-nested dense :value.sync="currentDrawerItem"
               @change="setCurrentDrawerItem">
        <template v-for="(item, index) in drawerItemList">
          <mu-list-item button :value="item.name" :open="currentDrawerItem === item.name" nested
                        nested-list-class="true"
                        :key="index">
            <mu-list-item-action>
              <mu-icon :value="':iconfont '+ item.icon"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{item.title}}</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon
                :value="':iconfont ' + (currentDrawerItem !== item.name ? 'icon-unfold' : 'icon-fold')"></mu-icon>
            </mu-list-item-action>
            <mu-list-item v-for="subItem in item.list" :key="subItem.name" button slot="nested" :to="subItem.url"
                          @click="open = !open">
              <mu-list-item-title>{{subItem.title}}</mu-list-item-title>
            </mu-list-item>
          </mu-list-item>
          <mu-divider :key="item.name"></mu-divider>
        </template>
        <!-- 红包列表 -->
        <mu-list-item button to="/packet/list" @click="open = !open">
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-redpacket"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>领取红包</mu-list-item-title>
        </mu-list-item>
        <mu-divider></mu-divider>
        <!-- 个人中心 -->
        <mu-list-item button to="/account/home" @click="open = !open">
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-home_light"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>个人中心</mu-list-item-title>
        </mu-list-item>
        <mu-divider></mu-divider>
        <!-- 退出登陆 -->
        <mu-list-item button @click="logout">
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-exit"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>退出登陆</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <!-- 全屏loading -->
    <element-loading class="test22222" :active="showLoading" :is-full-scree="true"></element-loading>
    <!-- 底部通栏 -->
    <custom-bottom :value="selectedTab"></custom-bottom>
  </div>
</template>
<script>
// import elementLoading from 'vue-element-loading';
import customBottom from 'custom-bottom';

export default {
  data() {
    return {
      drawerItemList: [
        {
          name: 'money', icon: 'icon-moneybag', title: '资金管理',
          list: [
            { url: '/balance/charge', title: '充值' },
            // {url: '/account/drawCash', title: '提现'},
            { url: '/packet/list', title: '领取红包' },
            { url: '/balance/record', title: '资金明细' },
          ],
        },
        {
          name: 'order', icon: 'icon-edit_light', title: '快递订单',
          list: [
            { url: '/order/add', title: '预约快递' },
            { url: '/order/list', title: '订单纪录' },
          ],
        },
        {
          name: 'address', icon: 'icon-location', title: '地址管理',
          list: [
            { url: '/address/add', title: '添加地址' },
            { url: '/address/list', title: '地址列表' },
          ],
        },
      ],
      currentDrawerItem: {},
    };
  },
  computed: {
    showLoading() {
      console.log(this.$store.state.loading, 2223334444);
      return this.$store.state.loading;
    },
    title() {
      return this.$store.state.title;
    },
    open: {
      get() {
        return this.$store.state.drawerOpen;
      },
      set(value) {
        this.$store.commit({ type: 'UPDATE_DRAWER_OPEN', value });
      },
    },
    selectedTab: {
      get() {
        return this.$store.state.selectedTab;
      },
      set(value) {
        this.$store.commit({ type: 'UPDATE_SELECTED_TAB', value });
      },
    },
  },
  components: {
    // elementLoading,
    customBottom,
  },
  methods: {
    // 显示侧边弹框
    UPDATE_DRAWER_OPEN() {
      this.$store.commit({ type: 'UPDATE_DRAWER_OPEN', value: true });
    },
    // 选中当前侧边弹框项
    setCurrentDrawerItem(e) {
      this.currentDrawerItem = e;
    },
    // 返回上一级
    goBack() {
      this.$router.go(-1);
    },
    // 退出登陆
    logout() {

    },
  },
  onLoad() {},
};
</script>
<style>
  @import "../assets/css/base.pcss";
  @import "../assets/css/vars.pcss";
  #app {
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
    .container {
      padding: 60px 0 0 0;
    }
    /* 顶部导航 */
    /deep/ .mu-appbar {
      @mixin flex-row;
      position: fixed;
      top: 0;
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
  }
  .moneyList {
    ul.mu-list {
      @mixin flex-row;
      flex-wrap: wrap;
      width: 100%;
      li.mu-option {
        margin-bottom: 10px;
        width: 33%;
        .mu-item-title {
          text-align: center;
        }
      }
    }
  }
</style>
