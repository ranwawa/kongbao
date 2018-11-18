<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    .price {
      @include flex-row;
      justify-content: center;
      align-items: flex-end;
      color: var(--red);;
      font-weight: bold;
      .icon {
        margin: 0 10px 18px 0;
      }
      .value {
        font-size: 58px;
      }
    }
    .info {
      margin-bottom: 2em;
      color: var(--gray);;
    }
  }
</style>
<template>
  <div class="container">
    <div class="price">
      <div class="icon">￥</div>
      <div class="value">98</div>
    </div>
    <div class="info" v-if="is_vip">您已开通VIP会员</div>
    <div class="info">一年内累计消费满498元可联系客服返还vip费用</div>
    <mu-button full-width color="success" style="margin-bottom: 2em;" v-if="!is_vip" @click="getVip">立即开通</mu-button>
    <mu-sub-header>vip特价</mu-sub-header>
    <mu-data-table scripe hover row-key="name" :data.sync="company" :columns="columns"></mu-data-table>
    <mu-sub-header>vip充值送现金红包</mu-sub-header>
    <mu-data-table scripe hover loading row-key="name" :data.sync="charge" :columns="columnCharge"></mu-data-table>
  </div>
</template>
<script>
  import utils from 'utils';
  import order from 'order';
  import account from 'account';
  export default {
    data () {
      return {
        is_vip: false,
        company: [
          {name: '韵达快递', price: 11, vip_price: 2},
          {name: '天天快递', price: 2.2, vip_price: 1}
        ],
        charge: [
          {name: '100~500元', normal: '不送', vip: '送2%现金红包'},
          {name: '500~1000元', normal: '不送', vip: '送3%现金红包'},
          {name: '1000元以上', normal: '不送', vip: '送4%现金红包'}
        ],
        columnCharge: [
          {title: '充值金额', name: 'name', align: 'center'},
          {title: '普通用户', name: 'normal', align: 'center'},
          {title: 'vip用户', name: 'vip', align: 'center'}
        ],
        columns: [
          {title: '快递公司', name: 'name', align: 'center'},
          {title: '普通用户价格', name: 'price', align: 'center'},
          {title: 'vip价格', name: 'vip_price', align: 'center'}
        ]
      };
    },
    components: {},
    methods: {
      // 开通VIP
      getVip () {
        account.getVip()
          .then(res => {
            const cb = () => {
              this.is_vip = true;
              this.$toast.success(res.data.msg);
            };
            utils.dealResponse.call(this, res, cb);
          })
          .catch(err => {
            utils.dealError.call(this, err);
          });
      }
    },
    mounted () {
      order.getCompany()
        .then(res => {
          const cb = () => {
            this.company = res.data.data;
          };
          utils.dealResponse.call(this, res, cb);
        })
        .catch(err => {
          utils.dealError.call(this, err);
        });
      account.getUserInfo()
        .then(res => {
          const cb = () => {
            Object.assign(this._data, res.data.data);
          };
          utils.dealResponse.call(this, res, cb);
        })
        .catch(err => {
          utils.dealError.call(this, err);
        });
      utils.setTitle.call(this, 'VIP');
    }
  };
</script>
