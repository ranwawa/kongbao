<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    .outer {
      padding: var(--padding);;
      .head {
        font-size: 28px;
      }
      .cell {
        @mixin flex-row;
        /deep/ .mu-button {
          margin-left: 1em;
          box-shadow: none;
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <div class="outer">
      <div class="head">你的QQ电子邮箱</div>
      <div class="cell">
        <mu-text-field full-width label-float label="QQ号" :help-text.sync="email.help" :error-text="email.error"
                       v-model.trim="email.value"
                       type="number" suffix="@qq.com">
        </mu-text-field>
        <mu-button @click="sendEmail">{{sendText}}</mu-button>
      </div>
      <mu-text-field full-width label-float label="验证码" v-model.trim="code.value" :error-text="code.error"
                     type="number"></mu-text-field>
      <mu-button full-width color="success" @click="submit">立即绑定</mu-button>
    </div>
  </div>
</template>
<script>
import utils from 'utils';
import account from 'account';

export default {
  data() {
    return {
      helpText: '',
      sendText: '发送验证码',
      email: { value: '', help: '', error: '' },
      code: { value: '', error: '' },
    };
  },
  components: {},
  methods: {
    countDown() {
      let time = 60;
      this.sendText = time + 's';
      const timer = setInterval(() => {
        if (time < 1) {
          clearInterval(timer);
          this.sendText = '重新发送';
          this.email.help = '';
        } else {
          time--;
          this.sendText = time + 's';
          this.email.help = '验证码已发到你的QQ邮箱，请注意查收';
        }
      }, 1000);
    },
    // 发送验证码
    sendEmail() {
      if (!this.checkEmail()) {
        return false;
      }
      account.sendEmail({ email: this.email.value + '@qq.com' }).then(res => {
        utils.dealResponse.call(this, res, this.countDown);
      }).catch(err => {
        this.countDown();
        utils.dealError.call(this, err);
      });
    },
    // 绑定QQ邮箱
    submit() {
      if (!this.checkEmail() || !this.checkCode()) {
        return false;
      }
      account.bindEmail({
        code: this.code.value,
        email: this.email.value + '@qq.com',
      }).then(res => {
        const cb = () => {
          this.$toast.success('邮箱绑定成功');
          this.$router.go(-1);
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
    checkCode() {
      if (!/[0-9]{4}/.test(this.code.value)) {
        this.code.error = '验证码有误';
        return false;
      } else {
        this.code.error = '';
        return true;
      }
    },
    checkEmail() {
      if (!/[0-9]{5,12}/.test(this.email.value)) {
        this.email.error = 'QQ号码有误';
        return false;
      } else {
        this.email.error = '';
        return true;
      }
    },
  },
  mounted() {
    utils.setTitle.call(this, '验证邮箱');
  },
};
</script>
