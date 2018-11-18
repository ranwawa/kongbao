<style scoped>
  @import "../../assets/css/base.pcss";
  .container {
    @mixin flex-column;
    .top {
      margin-top: 5em;
      .money {
        @mixin flex-row;
        align-items: flex-end;
        justify-content: center;
        color: var(--red);
        font-weight: bold;
        .icon {
          margin: 0 10px 23px 0;
          font-size: 28px;
        }
        .value {
          font-size: 88px;
        }
      }
      .title {
        font-size: 16px;
      }
      .subTitle {
        color: var(--gray);
        font-size: 12px;
      }
    }
    .bottom {
      padding: var(--padding);
      width: 100%;
      img {
        max-width: 100%;
      }
    }
  }
</style>
<template>
  <div class="container">
    <div class="top">
      <div class="title">扫描下方{{type === '1' ? '支付宝' : '微信'}}二维码付款</div>
      <div class="money">
        <div class="icon">￥</div>
        <div class="value">{{realPrice}}</div>
      </div>
      <div class="title">付款时，请输入{{realPrice}}元，金额错误将无法到帐</div>
      <div class="subTitle">付款即时到账,若未到帐，请联系客服人员<br>QQ:3178766675 微信:ranwawag TEL:13883198386</div>
    </div>
    <div class="bottom">
      <img :src="imgUrl">
    </div>
  </div>
</template>
<script>
import utils from 'utils';
import account from 'account';

export default {
  data() {
    return {
      imgUrl: '',
      money: '',
      type: 1,
      realPrice: '',
    };
  },
  components: {},
  methods: {},
  mounted() {
    this.money = this.$route.query.money;
    this.type = this.$route.query.type;
    account.payNow({ price: this.money, istype: this.type }).then(res => {
      const cb = () => {
        this.realPrice = res.data.data.realprice;
        // 根据支付类型来定上级文件夹和后缀
        let type = '';
        let extens = '';
        if (this.type === '1') {
          type = 'alipay';
          extens = 'jpg';
        } else {
          type = 'wechat';
          extens = 'png';
        }
        // 确定下级文件夹
        // 用小数点拆分金额
        const arry = this.realPrice.toFixed(2).split('.');
        let dotBehind = arry[1];
        // 获取实际充值金额,即小数部分大于0.5就向下取整，反之则向上取整
        let money = '';
        if (['99', '98', '97'].includes(dotBehind)) {
          money = Math.ceil(this.realPrice);
        } else if (['01', '02', '03'].includes(dotBehind)) {
          money = Math.floor(this.realPrice);
        } else if(dotBehind === '00') {
          money = this.realPrice;
        }
        // 如果实际充值金额不在指定范围内，则调用无金额二维码
        console.log('money', money, 'dotB', dotBehind);
        if ([1, 2, 5, 10, 20, 50, 100, 200, 500].includes(money) &&
          ['99', '98', '97', '01', '02', '03', '00'].includes(dotBehind)) {
          this.imgUrl = `/img/${type}/${money}/${res.data.data.realprice}.${extens}`;
        } else {
          this.imgUrl = `/img/${type}/${money}/${type}.${extens}`;
        }
      };
      utils.dealResponse.call(this, res, cb);
    }).catch(err => {
      utils.dealError.call(this, err);
    });
    utils.setTitle.call(this, '扫码');
  },
};
</script>
