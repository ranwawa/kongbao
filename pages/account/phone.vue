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
        @include flex-row;
        width: 100%;
        flex-wrap: nowrap;
        /deep/ .mu-input {
          flex-grow: 1;
        }
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
      <div class="head">你的手机号</div>
      <div class="cell">
        <mu-text-field label-float label="手机号" :help-text.sync="phone.help" :error-text="phone.error"
                       v-model.trim="phone.value"
                       type="number">
        </mu-text-field>
        <mu-button @click="sendCode">{{sendText}}</mu-button>
      </div>
      <mu-text-field full-width label-float label="验证码" v-model.trim="code.value" :error-text="code.error"
                     type="number"></mu-text-field>
      <mu-button full-width color="success" @click="submit">绑定手机号</mu-button>
    </div>
  </div>
</template>
<script>
  import utils from 'utils';
  import account from 'account';
  export default {
    data () {
      return {
        helpText: '',
        sendText: '发送验证码',
        phone: {value: '', help: '', error: ''},
        code: {value: '', error: ''}
      };
    },
    components: {},
    methods: {
      // 发送验证码
      sendCode () {
        if (!this.checkPhone()) {
          return false;
        }
        account.sendSMS({phone: this.phone.value})
          .then(res => {
            const cb = () => {
              this.$toast.success('验证码已发送成功');
              let time = 60;
              this.sendText = time + 's';
              const timer = setInterval(() => {
                if (time < 1) {
                  clearInterval(timer);
                  this.sendText = '重新发送';
                  this.phone.help = '';
                } else {
                  time--;
                  this.sendText = time + 's';
                  this.phone.help = '验证码已发出，请注意查收';
                }
              }, 1000);
            };
            utils.dealResponse.call(this, res, cb);
          })
          .catch(err => {
            utils.dealError.call(this, err);
          });
      },
      // 绑定手机
      submit () {
        if (!this.checkPhone() || !this.checkCode()) {
          return false;
        }
        account.bindPhone({
          phone: this.phone.value,
          code: this.code.value
        })
          .then(res => {
            const cb = () => {
              console.log(123123123);
              this.$router.go(-1);
              console.log(123123123);
              this.$toast.success('手机号码绑定成功');
            };
            utils.dealResponse.call(this, res, cb);
          })
          .catch(err => {
            utils.dealError.call(this, err);
          });
      },
      checkCode () {
        if (!/[0-9]{4}/.test(this.code.value)) {
          this.code.error = '验证码有误';
          return false;
        } else {
          this.code.error = '';
          return true;
        }
      },
      checkPhone () {
        if (!/[0-9]{11}/.test(this.phone.value)) {
          this.phone.error = '手机号码有误';
          return false;
        } else {
          this.phone.error = '';
          return true;
        }
      }
    },
    mounted () {
      utils.setTitle.call(this, '绑定手机');
    }
  };
</script>
