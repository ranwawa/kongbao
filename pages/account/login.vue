<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    background-image: url("/img/bg.png");
    background-size: cover;
    color: rgba(255, 255, 255, .8);
    > div {
      padding: 0 10px;
    }
    /* 表单 */
    > .form {
      @mixin flex-column;
      > .title {
        margin: 15px auto;
        font-size: 18px;
        letter-spacing: 5px;
      }
      > .cell {
        @mixin flex-row;
        justify-content: flex-start;
        border-radius: 2em;
        margin-top: 1em;
        padding: 10px;
        background-color: rgba(255, 255, 255, .4);
        /deep/ .mu-input-icon.iconfont {
          margin-right: var(--padding);
          color: #fff;
          font-size: 1.5em;
        }
        /deep/ .mu-input-content input {
          background-color: transparent !important;
        }
      }
      > .password {
        /deep/ .mu-input {
          margin-bottom: 0;
        }
      }
      .findPassword {
        align-self: flex-end;
        padding: 1em 1em 1em 0;
        color: #fff;
      }
      /deep/ .mu-button {
        margin-top: 1em;
      }
    }
    /* 其他登陆方式 */
    > .other {
      @mixin flex-column;
      margin-top: 30px;
      > div {
        @mixin flex-row;
        justify-content: center;
        width: 100%;
      }
      .title {
        .border {
          border-bottom: 1px solid rgba(255, 255, 255, .5);
          margin-bottom: 2px;
          width: 5em;
        }
        .text {
          margin: 0 .5em;
        }
      }
      .social .iconfont {
        font-size: 58px;
      }
      .social {
        .qq {
          margin: -10px 20px 0 0;
          color: #5580ED;
        }
        .wx {
          color: #53B72B;
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <!-- 表单 -->
    <div class="form">
      <mu-icon value=":iconfont icon-icon-toolbar-tool-aieps" size="68" color="orange"></mu-icon>
      <div class="title">欢迎回来</div>
      <div class="cell">
        <mu-text-field v-model="name.value" icon=":iconfont icon-my_light" :placeholder="name.placeholder"
                       :help-text="name.help" :error-text="name.showError ? name.error : ''"
                       :full-width="true"></mu-text-field>
      </div>
      <div class="cell password">
        <mu-text-field :type="password.visibility ? 'text' : 'password'" v-model="password.value"
                       icon=":iconfont icon-lock" :placeholder="password.placeholder"
                       :action-icon="password.visibility ? ':iconfont icon-attentionforbidfill' : ':iconfont icon-attentionfill'"
                       :action-click="() => password.visibility = !password.visibility"
                       :full-width="true"></mu-text-field>
      </div>
      <nuxt-link class="findPassword" to="/account/find_password">忘记密码?</nuxt-link>
      <mu-button color="#fff" text-color="#000" :ripple="true" :large="true" :round="true" :full-width="true"
                 :disabled="isDisabled" @click="submit">立即登陆
      </mu-button>
      <mu-button color="transparent" text-color="#fff" :ripple="true" :large="true" :round="true" :full-width="true"
                 :disabled="isDisabled" to="/account/register">注册
      </mu-button>
    </div>
    <!-- 其他登陆方式 -->
    <!--<div class="other">-->
    <!--<div class="title">-->
    <!--<div class="left border"></div>-->
    <!--<div class="text">其他登陆方式</div>-->
    <!--<div class="right border"></div>-->
    <!--</div>-->
    <!--<div class="social">-->
    <!--<div class="qq iconfont icon-qq"></div>-->
    <!--<div class="wx iconfont icon-wechat"></div>-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script>
import utils from 'utils';
import account from 'account';
import wx from 'wx';
import request from 'request';

export default {
  data() {
    return {
      name: { value: '', placeholder: '用户名', help: '请填写机号或电子邮箱帐号', error: '用户名错误', showError: false },
      password: {
        value: '',
        placeholder: '登陆密码',
        help: '推荐使用数字和字母组合',
        error: '到少6位数以上',
        showError: false,
        visibility: false,
      },
      isDisabled: false,
      fromRouter: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 如果是登陆失败从其他页面跳转过来的
      // 则登陆成功后要跳转回去
      if (to.query.redirect) {
        vm.fromRouter = from.path;
      }
    });
  },
  components: {},
  methods: {
    // 跳转页面
    replaceRouter() {
      if (wx.getStorageSync('rww-token')) {
        // 如果是从其他页面跳转过来的，则要跳回去
        request.setToken();
        console.log(this.fromRouter);
        this.$router.push(this.fromRouter || '/account/home');
      }
    },
    // 验证表单
    validate() {
      if (this.name.value.length < 6) {
        this.name.showError = true;
        return false;
      }
      if (this.password.value.length < 6) {
        this.password.showError = true;
        return false;
      }
      return true;
    },
    // 登陆
    submit() {
      if (!this.validate()) {
        return false;
      }
      account.login({ name: this.name.value, password: this.password.value }).then(res => {
        const cb = () => {
          // 缓存用户信息
          wx.setStorageSync('rww-token', res.data.token_type + ' ' + res.data.access_token);
          wx.setStorageSync('rww-name', this.name.value);
          wx.setStorageSync('rww-pwd', this.password.value);
          this.$toast.success('登陆成功');
          this.replaceRouter();
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
  },
  mounted() {
    utils.setTitle.call(this, '登陆');
    this.replaceRouter();
    // 如果有缓存用户密码，直接直接取出来
    if (wx.getStorageSync('rww-name')) {
      this.name.value = wx.getStorageSync('rww-name');
      this.password.value = wx.getStorageSync('rww-pwd');
    }
  },
};
</script>
