<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    /* 头部背景 */
    .top {
      @mixin flex-column;
      justify-content: flex-end;
      align-items: center;
      background-image: url("/img/bg2.png");
      height: 150px;
      background-size: cover;
      .name {
        margin-top: var(--padding);
        font-size: 16px;
        font-weight: bold;
      }
      .bottom {
        .vip {
          @mixin flex-row;
          justify-content: center;
          .iconfont {
            color: var(--gray);
            margin-right: .5em;
          }
        }
        .vip.active {
          .iconfont {
            color: yellow;
          }
        }
      }
    }
    /deep/ .mu-sub-header {
      text-align: left;
    }
    /* 资金余额 */
    .money {
      @mixin flex-column;
      box-shadow: var(--shadow);
      border-bottom: var(--border);
      padding: var(--padding);
      background-color: #fff;
      align-items: flex-start;
      > div {
        text-align: left;
      }
      .outer {
        @mixin flex-row;
        justify-content: flex-start;
        align-items: flex-end;
        .icon {
          margin-bottom: 6px;
        }
        .value {
          color: var(--red);
          font-size: 26px;
          font-weight: bold;
        }
      }
    }
    > .link {
      box-shadow: var(--shadow);
      margin-bottom: 1em;
      padding: 0 var(--padding);
      background-color: #fff;
      /deep/ .mu-list {
        padding: 0;
        .mu-item {
          border-bottom: var(--border);
          .mu-item-content {
            margin-left: var(--padding);
          }
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <!-- 头部背景 -->
    <div class="top">
      <router-link to="/account/setting">
        <mu-avatar size="55">
          <img :src="head || '/img/avatar.png'">
        </mu-avatar>
        <div class="name">{{name || '无名氏'}}</div>
      </router-link>
      <router-link to="/account/vip" class="bottom">
        <div class="vip" :class="{active: is_vip}">
          <div class="iconfont icon-vip"></div>
          {{is_vip ? 'vip会员' : '普通会员'}}
        </div>
      </router-link>
    </div>
    <!-- 资金信息 -->
    <div class="money">
      <div class="title">帐户余额</div>
      <div class="outer">
        <div class="icon">￥</div>
        <div class="value">{{money || '0.00'}}</div>
      </div>
    </div>
    <!-- 资金列表 -->
    <mu-sub-header>资金管理</mu-sub-header>
    <div class="link">
      <mu-list>
        <mu-list-item to="/balance/charge" button>
          <mu-icon value=":iconfont icon-recharge"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>充值</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <!-- 如果不是vip,就显示开通vip -->
        <mu-list-item to="/account/vip" button v-if="!is_vip">
          <mu-icon color="blue" value=":iconfont icon-icon-test"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>开通VIP会员</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item to="/packet/list" button>
          <mu-icon color="red" value=":iconfont icon-redpacket"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>领取现金红包</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item to="/balance/record" button>
          <mu-icon color="success" value=":iconfont icon-zijinmingxi"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>帐务明细</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <!-- 地址列表 -->
    <mu-sub-header>地址管理</mu-sub-header>
    <div class="link">
      <mu-list>
        <mu-list-item to="/address/list" button>
          <mu-icon color="primary" value=":iconfont icon-location"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>我的地址</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon color="dragon" value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item to="/address/add" button>
          <mu-icon value=":iconfont icon-addads"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>添加新地址</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <mu-sub-header>推荐注册(推荐码:{{id * 888 + 168}})</mu-sub-header>
    <div class="link">
      <mu-list textline="three-line">
        <mu-list-item button @click="copyLink">
          <mu-icon color="pink" value=":iconfont icon-expressman"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>点击复制链接,邀请好友注册</mu-list-item-title>
            <mu-list-item-sub-title></mu-list-item-sub-title>
            <mu-list-item-sub-title>好友充值,可得3%红包。好友开通VIP,可得48红包</mu-list-item-sub-title>
            <mu-list-item-sub-title>好友注册时可领1元红包</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <!-- 联系客服 -->
    <mu-sub-header>联系客服</mu-sub-header>
    <div class="link">
      <mu-list textline="two-line">
        <mu-list-item button href="http://wpa.qq.com/msgrd?v=3&uin=3178766675&site=qq&menu=yes">
          <mu-icon color="primary" value=":iconfont icon-qq1"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>在线客服</mu-list-item-title>
            <mu-list-item-sub-title>QQ:3178766675</mu-list-item-sub-title>
            <mu-list-item-sub-title>时间:09:00 - 21:00</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item button v-if="is_vip">
          <mu-icon color="yellow" value=":iconfont icon-icon-test"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>VIP客服热线</mu-list-item-title>
            <mu-list-item-sub-title>座机:023-67078332</mu-list-item-sub-title>
            <mu-list-item-sub-title>手机:138 8319 8386</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <!-- 退出登陆 -->
    <mu-sub-header>个人设置</mu-sub-header>
    <div class="link">
      <mu-list>
        <mu-list-item button to="/account/setting">
          <mu-icon value=":iconfont icon-settings_light"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>个人信息设置</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>

        <mu-list-item button @click="logout">
          <mu-icon value=":iconfont icon-exit"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>退出登陆</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>

  </div>
</template>
<script>
import account from 'account';
import utils from 'utils';
// import customBottom from 'custom-bottom';
import wx from 'wx';

export default {
  layout: 'tab',
  data() {
    return {
      id: 0,
      head: '',
      is_vip: 0,
      money: '',
      name: '',
    };
  },
  components: {
    // customBottom,
  },
  methods: {
    // 退出登陆
    logout() {
      wx.removeStorageSync('rww-token');
      wx.setToken();
      this.$router.push('/');
    },
    // 复制链接
    copyLink() {
      this.$copyText(`ranwawa.cn#/account/register?pid=${this.id * 888 + 168}`).then(e => {
        this.$toast.success('复制成功');
      }).catch(() => {
        this.$toast.success('复制失败');
      });
    },
  },
  mounted() {
    account.getUserInfo().then(res => {
      const cb = () => {
        Object.assign(this._data, res.data.data);
        this.$store.commit({
          type: 'UPDATE_IS_VIP',
          value: res.data.data.is_vip,
        });
      };
      utils.dealResponse.call(this, res, cb);
    }).catch(err => {
      utils.dealError.call(this, err);
    });
    this.$store.commit({ type: 'UPDATE_SELECTED_TAB', value: 'home' });
    utils.setTitle.call(this, '我的');
  },
};
</script>
