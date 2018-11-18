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
      <div class="head">当前昵称:{{oldNickName || '未设置'}}</div>
      <mu-text-field full-width label-float label="昵称" v-model.trim="newNickName.value"
                     :error-text="newNickName.errorText"
                     type="text"></mu-text-field>
      <mu-button full-width color="success" @click="submit">立即设置</mu-button>
    </div>
  </div>
</template>
<script>
  import utils from 'utils';
  import account from 'account';
  export default {
    data () {
      return {
        oldNickName: '',
        newNickName: {value: '', helpText: '', errorText: ''}
      };
    },
    components: {},
    methods: {
      // 绑定手机
      submit () {
        account.editInfo({nickname: this.newNickName.value})
          .then(res => {
            const cb = () => {
              this.$toast.success('修改成功');
              this.$router.go(-1);
            };
            utils.dealResponse.call(this, res, cb);
          })
          .catch(err => {
            utils.dealError.call(this, err);
          });
      }
    },
    mounted () {
      utils.setTitle.call(this, '修改昵称');
    }
  };
</script>
