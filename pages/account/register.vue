<style>
  @import "../../assets/css/base.pcss";
  .container {
    background: url("../../static/img/bg.png");
    background-size: cover;
    color: rgba(255, 255, 255, .8);
    > div {
      padding: 0 10px;
    }
    /* 注册表单 */
    > .form {
      padding-top: 1em;
      > .title {
        margin-bottom: 30px;
        font-size: 18px;
        letter-spacing: 5px;
        text-align: center;
      }
      > .cell {
        @mixin flex-row;
        justify-content: flex-start;
        border-radius: 2em;
        margin-top: 1em;
        padding: 10px;
        background-color: rgba(255, 255, 255, .4);
        /deep/ .mu-input-icon.iconfont {
          margin-right: 10px;
          color: #fff;
          font-size: 1.5em;
        }
      }
      /deep/ .mu-button {
        margin-top: 1em;
      }
      /deep/ .mu-checkbox {
        margin: 1em 0 0 2em;
        width: 100%;
        .mu-checkbox-wrapper {
          justify-content: flex-start;
        }
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
        @mixin flex-row;
        justify-content: center;
        .qq {
          margin-right: 1em;
          color: #5580ED;
        }
        .wx {
          color: #53B72B;
          font-size: 43px;
        }
      }
      .login {
        align-self: center;
      }
    }
  }
</style>
<template>
  <div class="container">
    <!-- 注册表单 -->
    <div class="form">
      <div class="title">欢迎注册冉娃娃</div>
      <div class="cell">
        <mu-text-field v-model="name.value" icon=":iconfont icon-my_light" :placeholder="name.placeholder"
                       :help-text="name.help" :error-text="name.showError ? name.error : ''"
                       :full-width="true"></mu-text-field>
      </div>
      <div class="cell">
        <mu-text-field :type="password.visibility ? 'text' : 'password'" v-model="password.value"
                       icon=":iconfont icon-lock" :placeholder="password.placeholder"
                       :help-text="password.help" :error-text="password.showError ? password.error : ''"
                       :action-icon="password.visibility ? ':iconfont icon-attentionforbidfill' : ':iconfont icon-attentionfill'"
                       :action-click="() => password.visibility = !password.visibility"
                       :full-width="true"></mu-text-field>
      </div>
      <div class="cell">
        <mu-text-field :type="confirm.visibility ? 'text' : 'password'" v-model="confirm.value"
                       icon=":iconfont icon-lock" :placeholder="confirm.placeholder"
                       :help-text="confirm.help" :error-text="confirm.showError ? confirm.error : ''"
                       :action-icon="confirm.visibility ? ':iconfont icon-attentionforbidfill' : ':iconfont icon-attentionfill'"
                       :action-click="() => confirm.visibility = !confirm.visibility"
                       :full-width="true"></mu-text-field>
      </div>
      <div class="cell">
        <mu-text-field type="text" v-model="img.value"
                       icon=":iconfont icon-pic" :placeholder="img.placeholder"
                       :help-text="img.help" :error-text="img.showError ? img.error : ''"
                       :full-width="true" @getCaptcha="getCaptcha">
          <template slot="append"><img :src="img.src" @click="getCaptcha"></template>
        </mu-text-field>
      </div>
      <div class="cell">
        <mu-text-field v-model="recommend.value" type="number"
                       icon=":iconfont icon-expressman" :placeholder="recommend.placeholder"
                       :help-text="recommend.help" :error-text="recommend.showError ? recommend.error : ''"
                       :action-icon="recommend.visibility ? ':iconfont icon-attentionforbidfill' : ':iconfont icon-attentionfill'"
                       :action-click="() => recommend.visibility = !recommend.visibility"
                       :full-width="true"></mu-text-field>
      </div>
      <mu-checkbox label="同意用户协议" v-model="isAgree"></mu-checkbox>
      <mu-button color="#fff" text-color="#000" :ripple="true" :large="true" :round="true" :full-width="true"
                 :disabled="isDisabled" @click="submit">立即注册
      </mu-button>
    </div>
    <!-- 其他登陆方式 -->
    <div class="other">
      <!--<div class="title">-->
      <!--<div class="left border"></div>-->
      <!--<div class="text">其他登陆方式</div>-->
      <!--<div class="right border"></div>-->
      <!--</div>-->
      <!--<div class="social">-->
      <!--<div class="qq iconfont icon-qq2"></div>-->
      <!--<div class="wx iconfont icon-weixin"></div>-->
      <!--</div>-->
      <nuxt-link to="/account/login" class="login">已有帐号？
        去登陆
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import utils from 'utils';
import account from 'account';

export default {
  data() {
    return {
      name: { value: '', placeholder: '用户名', help: '建议使用手机号或电子邮箱帐号', error: '到少6位数以上', showError: false },
      password: {
        value: '',
        placeholder: '密码',
        help: '推荐使用数字和字母组合',
        error: '到少6位数以上',
        showError: false,
        visibility: false,
      },
      confirm: {
        value: '',
        placeholder: '确认密码',
        help: '两次密码需要一模一样',
        error: '到少6位数以上',
        showError: false,
        visibility: false,
      },
      recommend: {
        value: '',
        placeholder: '推荐码',
        help: '请填写推荐码，没有可以不填',
        error: '',
        showError: false,
        visibility: false,
      },
      img: {
        value: '',
        placeholder: '验证码',
        help: '点击图片刷新验证码',
        error: '必须填写验证码',
        showError: false,
        visibility: false,
        src: '', // 验证码链接
        key: '', // 验证码key,
        pid: '', // 推荐人id
      },
      isAgree: true,
      isDisabled: false,
    };
  },
  components: {},
  methods: {
    submit() {
      // 赋值请求参数
      let param = {
        name: this.name.value,
        password: this.password.value,
        verification_key: this.img.key,
        verification_code: this.img.value,
        r_id: this.recommend.value,
      };
      // 字段有效性验证
      this.name.showError = !param.name || param.name.length < 6;
      this.password.showError = !param.password || param.password.length < 6;
      this.confirm.showError = param.password !== this.confirm.value;
      this.img.showError = !param.verification_code;
      if (this.name.showError || this.password.showError || this.confirm.showError || this.img.showError) {
        return false;
      }
      account.register(param).then(res => {
        const cb = () => {
          this.$toast.success('注册成功');
          this.$router.push('/');
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
    // 获取验证码图片
    getCaptcha() {
      account.getImg().then(res => {
        console.log(res);
        const cb = () => {
          this.img.src = res.data.captcha_image_content;
          this.img.key = res.data.captcha_key;
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
  },
  mounted() {
    this.recommend.value = this.$route.query.pid;
    this.getCaptcha();
    utils.setTitle.call(this, '注册');
  },
};
</script>
