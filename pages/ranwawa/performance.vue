<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
  /deep/ .mu-list-item {
    margin-bottom: 1em;
  }
  /deep/ .mu-list-item.active {
    color: var(--red);;
    border: 1px solid red;
  }
  .btn {
  @mixin flex-row;
    justify-content: flex-end;
  .add {
    align-self: flex-end;
  }
  }
  }
</style>
<template>
  <div class="container">
    <mu-list textline="two-line">
      <div
        v-for="item in companyList"
        :key="item.id"
      >
        <mu-list-item>
          <mu-list-item-action>
            <mu-avatar>
              <img :src="'/static/logo/' + item.logo + '.png'">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{item.name}}</mu-list-item-title>
            <mu-list-item-sub-title>累计:{{item.total}} 今天:{{item.day}}
                                    未下载:{{item.dayWei}} 库存:{{item.stock}}
            </mu-list-item-sub-title>
          </mu-list-item-content>
        </mu-list-item>
        <div class="btn">
          <mu-button
            class="add"
            :flat="item.stock > 100"
            :color="item.stock < 100 ? 'red' : ''"
            :to="'/ranwawa/number?id=' + item.id"
          >添加单号
          </mu-button>
          <mu-button
            :flat="!item.dayWei"
            :color="item.dayWei ? 'primary' : 'none'"
            @click="downloadExcel(item)"
          >下载单号
          </mu-button>
          <mu-button
            flat
            @click="clearStock(item, index)"
          >清空库存
          </mu-button>
        </div>
        <mu-divider></mu-divider>
      </div>
    </mu-list>
    <div class="priceComputed">
      <mu-text-field
        v-model="price.cost"
        @input="computedPrice"
        placeholder="请输入进货价"
      ></mu-text-field>
      <mu-divider></mu-divider>
      成本价：{{price.cost}}
      <mu-divider></mu-divider>
      会员价：{{price.normal}}
      <mu-divider></mu-divider>
      VIP价：{{price.vip}}
      <mu-divider></mu-divider>
    </div>
  </div>
</template>
<script>
import utils from 'utils';
import order from 'order';
import wx from 'wx';

export default {
  data() {
    return {
      price: {
        cost: '',
        normal: '',
        vip: '',
      },
      companyList: [],
      // 快递模板
      templates: [
        {
          express_id: 1,
          template: {
            'od.express_no': '快递单号',
            'o.seller_province': '发货省',
            'o.seller_city': '发货市',
            'o.seller_region': '发货区',
            'od.original': '收货地址',
            'od.buyer_name': '收货人',
          },
        },
        {
          express_id: 0,
          template: {
            'od.express_no': '快递单号',
            'o.seller_province': '发货人省',
            'o.seller_city': '发货人市',
            'o.seller_region': '发货人区',
            'od.buyer_province': '收货省',
            'od.buyer_city': '收货市',
            'od.buyer_region': '收货区',
            'od.buyer_name': '收货人姓名',
          },
        },
      ],
    };
  },
  components: {},
  methods: {
    // 计算价格
    computedPrice(e) {
      const cost = parseFloat(e);
      const temp1 = cost * 1.3;
      const temp2 = cost + 0.5;
      this.price.vip = temp1 > temp2 ? temp1 : temp2;
      this.price.normal = this.price.vip + 0.3;
    },
    // 下载表格
    downloadExcel(item) {
      // if (!item.dayWei) {
      //   return;
      // }
      // 获取模板信息
      let param = {
        express_id: item.id,
        template: {},
      };
      // 发货模板 龙邦是1 其他是0
      param.template = this.templates.find(
        ele => ele.express_id === (item.id === 51 ? 1 : 0)).template;
      order.downloadExcel(param)
        .then(res => {
          const cb = () => {
            item.dayWei = 0;
            this.companyList.splice(this.companyList.indexOf(item), 1, item);
            location.href = 'http://api.ranwawa.cn' + res.data;
            this.$toast.success('下载成功');
          };
          utils.dealResponse(res, cb);
        })
        .catch(err => {
          utils.dealError(err);
        });
    },
    // 清空库存
    clearStock(item, index) {
      wx.showModal({
        title: '提示',
        content: `确定要清空${item.name}的单号吗?`,
      })
        .then(res => {
          return order.clearStock({ express_id: item.id });
        })
        .then(res => {
          const cb = () => {
            item.stock = 0;
            this.companyList.splice(index, 1, item);
            this.$toast.success('库存清空成功');
          };
          utils.dealResponse(res, cb);
        })
        .catch(err => {
          utils.dealError(err);
        });
    },
  },
  mounted() {
    order.getCompany()
      .then(res => {
        const cb = () => {
          this.companyList = res.data.data;
          this.companyList.forEach((ele, i) => {
            order.getCompanyDetail({ express_id: ele.id })
              .then(res => {
                const cb = () => {
                  ele.day = res.data.day;
                  ele.total = res.data.total;
                  ele.stock = res.data.stock;
                  ele.dayWei = res.data.dayWei;
                  this.companyList.splice(i, 1, ele);
                };
                utils.dealResponse(res, cb);
              })
              .catch(err => {
                utils.dealError(err);
              });
          });
        };
        utils.dealResponse(res, cb);
      })
      .catch(err => {
        utils.dealError(err);
      });
    utils.setTitle.call(this, '订单管理');
  },
};
</script>
