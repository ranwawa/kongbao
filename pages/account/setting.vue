<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    > .link {
      margin-top: 1em;
      box-shadow: var(--shadow);;
      padding: 0 var(--padding);;
      background-color: #fff;
      /deep/ .mu-list {
        padding: 0;
        .mu-item {
          .mu-item-content {
            margin-left: var(--padding);;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <!-- 修改头像 -->
    <div class="link">
      <mu-list textline="two-line">
        <mu-list-item to="/account/avatar" button>
          <mu-avatar>
            <img :src="head">
          </mu-avatar>
          <mu-list-item-content>
            <mu-list-item-title>修改头像</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <!-- 修改昵称 -->
    <div class="link">
      <mu-list textline="two-line">
        <mu-list-item to="/account/nick_name" button>
          <mu-icon value=":iconfont icon-expressman"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>修改昵称</mu-list-item-title>
            <mu-list-item-sub-title>{{name || '还没有设置过昵称'}}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <!-- 手机号码 -->
    <div class="link">
      <mu-list textline="two-line">
        <mu-list-item to="/account/phone" button>
          <mu-icon value=":iconfont icon-shouji"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>手机号码</mu-list-item-title>
            <mu-list-item-sub-title>{{phone || '暂未绑定，立即绑定'}}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <!--<mu-list-item to="/account/email" button>-->
        <!--<mu-icon value=":iconfont icon-qq1"></mu-icon>-->
        <!--<mu-list-item-content>-->
        <!--<mu-list-item-title>QQ快捷登陆</mu-list-item-title>-->
        <!--<mu-list-item-sub-title>暂未绑定</mu-list-item-sub-title>-->
        <!--</mu-list-item-content>-->
        <!--<mu-list-item-action>-->
        <!--<mu-icon value=":iconfont icon-right"></mu-icon>-->
        <!--</mu-list-item-action>-->
        <!--</mu-list-item>-->
        <!--<mu-list-item to="/account/email" button>-->
        <!--<mu-icon value=":iconfont icon-weixin1"></mu-icon>-->
        <!--<mu-list-item-content>-->
        <!--<mu-list-item-title>微信快捷登陆</mu-list-item-title>-->
        <!--<mu-list-item-sub-title>暂未绑定</mu-list-item-sub-title>-->
        <!--</mu-list-item-content>-->
        <!--<mu-list-item-action>-->
        <!--<mu-icon value=":iconfont icon-right"></mu-icon>-->
        <!--</mu-list-item-action>-->
        <!--</mu-list-item>-->
      </mu-list>
    </div>
    <!-- QQ号码 -->
    <div class="link">
      <mu-list textline="two-line">
        <mu-list-item to="/account/email" button>
          <mu-icon value=":iconfont icon-qq"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>QQ邮箱</mu-list-item-title>
            <mu-list-item-sub-title>{{email || '暂未绑定，立即绑定'}}</mu-list-item-sub-title>
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
import utils from 'utils';
import account from 'account';

export default {
  data() {
    return {
      head: '/img/avatar.png',
      name: '',
      phone: '',
      email: '',
    };
  },
  components: {},
  methods: {},
  mounted() {
    utils.setTitle.call(this, '个人设置');
    account.getUserInfo().then(res => {
      const cb = () => {
        Object.assign(this._data, res.data.data);
      };
      utils.dealResponse.call(this, res, cb);
    }).catch(err => {
      utils.dealError.call(this, err);
    });
  },
};
</script>
