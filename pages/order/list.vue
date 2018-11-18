<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    .filter {
      @mixin flex-row;
      padding: var(--padding);;
      /deep/ .mu-input {
        margin: 0 var(--padding) 0 0;
        padding-bottom: 0;
      }
    }
    .list {
      padding: var(--padding);;
      .item {
        @mixin flex-column;
        box-shadow: var(--shadow);;
        margin-top: var(--padding) *2;
        padding: var(--padding);;
        background-color: #fff;
        text-align: left;
        > .top, .btn {
          @mixin flex-row;
          justify-content: space-between;
        }
        .top {
          > div {
            margin-right: var(--padding);;
          }
          .order {
            justify-self: flex-end;
            align-self: flex-end;
            color: var(--gray);;
            font-size: 12px;
          }
        }
        .bottom {
          border-top: var(--border);;
          border-bottom: var(--border);;
          margin: var(--padding) 0;
          padding: var(--padding) 0;
        }
        .btn {
          justify-content: flex-end;
          padding-top: var(--padding);
          /deep/ .mu-button {
            margin-left: 1em;
            box-shadow: none;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <!--<mu-tabs :value.sync="tab" center full-width>-->
    <!--<mu-tab>全部</mu-tab>-->
    <!--<mu-tab>待揽件</mu-tab>-->
    <!--<mu-tab>已收件</mu-tab>-->
    <!--<mu-tab>已退款</mu-tab>-->
    <!--</mu-tabs>-->
    <!--<div class="filter">-->
    <!--<mu-select v-model="filterKey" placeholder="筛选条件">-->
    <!--<mu-option v-for="item in filterList" :key="item.key" :value="item.key" :label="item.name"></mu-option>-->
    <!--</mu-select>-->
    <!--<mu-text-field v-model="filterValue" v-if="filterKey !== 3"-->
    <!--:placeholder="'请输入' + (filterList[filterKey-1] ? filterList[filterKey-1].name : '筛选条件')"></mu-text-field>-->
    <!--<mu-select v-model="filterValue" placeholder="请选择发件人" v-else>-->
    <!--</mu-select>-->
    <!--<mu-button color="primary">查询</mu-button>-->
    <!--</div>-->
    <mu-load-more @load="load" :loading="loading" loading-text="正在加载" :loaded-all="!haveMore">
      <div class="list">
        <div class="item" v-for="item in orderList" :key="item.id">
          <div class="top">
            <div class="company">{{item.express_name}}
              <mu-badge :content="item.status === 1 ? '未揽件' : '已揽件'" :color="item.status === 1 ? 'default' : 'primary'">
              </mu-badge>
            </div>
            <div class="order">预约时间:{{item.created_at}}</div>
          </div>
          <div class="bottom">
            <div class="name">姓名: {{item.seller_name}} 电话:{{item.seller_phone}}</div>
            <div class="address">发件地址:{{item.seller_province}} {{item.seller_city}} {{item.seller_region}}
              {{item.seller_address}}
            </div>
          </div>
          <div class="btn">
            <mu-button @click="goDetail(item)">查看详情</mu-button>
            <mu-button color="primary" @click="downloadExcel(item)">下载订单</mu-button>
          </div>
        </div>
      </div>
    </mu-load-more>
    <rww-empty v-if="orderList.length < 1"></rww-empty>
  </div>
</template>
<script>
import utils from 'utils';
import order from 'order';
import rwwEmpty from 'rww-empty';

export default {
  layout: 'tab',
  data() {
    return {
      tab: 0,
      // 筛选条件
      filterKey: '',
      filterValue: '',
      filterList: [
        { key: 1, name: '订单编号' },
        { key: 2, name: '快递单号' },
        { key: 3, name: '发件人' },
      ],
      orderList: [], // 订单列表
      loading: false, // 是否正在加载数据
      haveMore: true,
      page: 1,
    };
  },
  components: {
    rwwEmpty,
  },
  methods: {
    // 跳转到订单详情列表
    goDetail(item) {
      // 缓存当前订单信息，在详情页面最上面要显示
      this.$store.commit({ type: 'UPDATE_ORDER', value: item });
      this.$router.push('/order/detail?id=' + item.id);
    },
    // 滚动加载
    load() {
      if (this.haveMore) {
        this.loading = true;
        this.getList();
        this.page++;
      }
    },
    // 获取订单列表
    getList() {
      order.getOrderList({ page: this.page }).then(res => {
        const cb = () => {
          this.loading = false;
          if (res.data.data.length < 1) {
            this.haveMore = false;
            return;
          }
          this.orderList = this.orderList.concat(res.data.data);
        };
        utils.dealResponse(res, cb);
      }).catch(err => {
        utils.dealError(err);
      });
    },
    // 下载表格
    downloadExcel(item) {
      // alert(window.navigator.userAgent);
      // 获取模板信息
      let param = {
        order_no: item.order_no,
      };
      order.downLoadUserExcel(param).then(res => {
        const cb = () => {
          location.href = 'http://api.ranwawa.cn' + res.data;
        };
        utils.dealResponse(res, cb);
      }).catch(err => {
        utils.dealError(err);
      });
    },
  },
  mounted() {
    this.load();
    this.$store.commit({ type: 'UPDATE_SELECTED_TAB', value: 'list' });
    utils.setTitle.call(this, '订单纪录');
  },
};
</script>
