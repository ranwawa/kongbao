<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    > div {
      padding: 0 var(--padding);
      text-align: left;
    }
    .title {
      padding-top: 1em;
      font-weight: bold;
    }
    .value /deep/ input {
      color: var(--red);
      font-size: 2em;
    }
    .help {
      margin-top: 2em;
      color: var(--gray);
    }
  }
</style>
<template>
  <div class="container">
    <div class="title">充值金额</div>
    <div class="value">
      <mu-select popover-class="moneyList" label="请选择充值金额" v-model="money" label-float full-width
                 :error-text="moneyError">
        <mu-option v-for="item in moneyList" :key="'money' + item" :label="item + '元'" :value="item"></mu-option>
      </mu-select>
    </div>
    <div class="pay">
      <mu-select label="请选择支付方式" label-float v-model="pay" full-width :error-text="payError">
        <mu-option v-for="item in payList" :key="item.value" :value="item.value" :label="item.name">
          <mu-list-item-action avatar>
            <mu-avatar :size="24" color="transparent">
              <mu-icon :value="item.icon" :color="item.color"></mu-icon>
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{item.name}}</mu-list-item-title>
          </mu-list-item-content>
        </mu-option>
      </mu-select>
    </div>
    <div class="btn">
      <mu-button full-width color="success" round @click="submit">立即充值</mu-button>
    </div>
    <div class="help">
      <strong>温馨提示:</strong>
      <p>充值100至500元送充值金额3%的现金红包<br/>
        充值500至2000元送充值金额4%的现金红包<br/>
        充值2000元以上送充值金额5%的现金红包</p>
    </div>
  </div>
</template>
<script>
import utils from 'utils';

export default {
  data() {
    return {
      moneyList: [1, 2, 5, 10, 20, 50, 100, 200, 500],
      money: '', // 充值金额
      moneyError: '',
      pay: 1, // 支付方式
      payError: '',
      payList: [
        { name: '支付宝', value: 1, icon: ':iconfont icon-umidd17', color: '#108ee9' },
        { name: '微信', value: 2, icon: ':iconfont icon-weixinzhifu', color: '#62b900' },
      ],
    };
  },
  components: {},
  methods: {
    submit() {
      if (!this.money) {
        this.moneyError = '请输入充值金额';
        return;
      }
      if (!this.pay) {
        this.payError = '请选择支付方式';
        return;
      }
      this.$router.push(`/balance/pay?type=${this.pay}&money=${this.money}`);
    },
  },
  mounted() {
    utils.setTitle.call(this, '充值');
  },
};
</script>
