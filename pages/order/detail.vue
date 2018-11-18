<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    /deep/ .mu-sub-header {
      margin: 0;
      padding: 0 var(--padding);;
      text-align: left;
    }
    /* 发件人信息 */
    > .item {
      @mixin flex-column;
      box-shadow: var(--padding);;
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
        margin: var(--padding) 0;
        padding: var(--padding) 0 0 0;
        font-weight: bold;
      }
    }
    /* 收件人信息 */
    > .buyer {
      box-shadow: var(--shadow);;
      .item {
        @mixin flex-column;
        margin-bottom: var(--padding)*1.5;
        padding: var(--padding);;
        background-color: #fff;
        .top {
          @mixin flex-row;
          border-bottom: var(--border);;
          margin-bottom: var(--padding);;
          padding-bottom: var(--padding);;
          /deep/ .mu-button {
            box-shadow: none;
          }
        }
        .content {
          @mixin flex-column;
          > div {
            color: var(--gray);;
            text-align: left;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <mu-sub-header>发件人地址</mu-sub-header>
    <div class="item">
      <div class="top">
        <div class="company">{{item.express_name}}
          <mu-badge :content="item.status === 1 ? '未揽件' : '已揽件'" :color="item.status === 1 ? 'default' : 'primary'">
          </mu-badge>
        </div>
        <div class="order">订单编号:{{item.order_no}}</div>
      </div>
      <div class="bottom">
        <div class="name">发件人姓名: {{item.seller_name}} 电话:{{item.seller_phone}}</div>
        <div class="address">发件地址:{{item.seller_province}} {{item.seller_city}} {{item.seller_region}}
          {{item.seller_address}}
        </div>
      </div>
    </div>
    <mu-sub-header>收件人地址</mu-sub-header>
    <div class="buyer">
      <mu-load-more @load="load" :loading="loading" loading-text="正在加载" :loaded-all="!haveMore">
        <div class="item" v-for="item in buyerList" :key="item.id">
          <div class="top">
            <div class="number">快递单号：{{item.express_no}}</div>
            <mu-button @click="doCopy(item)">复制单号</mu-button>
          </div>
          <div class="content">
            <div class="name">收件人:{{item.buyer_name}} 电话:{{item.buyer_phone}}</div>
            <div class="address">收件人地址:{{item.buyer_province}} {{item.buyer_city}} {{item.buyer_region}}
              {{item.buyer_address}}
            </div>
          </div>
        </div>
      </mu-load-more>
    </div>
  </div>
</template>
<script>
import utils from 'utils';
import order from 'order';

export default {
  data() {
    return {
      item: this.$store.state.order,
      buyerList: [],
      loading: false,
      haveMore: true,
      page: 1,
    };
  },
  components: {},
  methods: {
    // 复制单号
    doCopy(item) {
      this.$copyText(item.express_no).then(e => {
        this.$toast.success('复制成功');
      }).catch(() => {
        this.$toast.success('复制失败');
      });
    },
    // 加载列表
    getList() {
      order.getOrderDetail({ order_id: this.id, page: this.page }).then(res => {
        const cb = () => {
          this.loading = false;
          const data = res.data.data;
          if (data.length < 1) {
            this.haveMore = false;
            return;
          }
          this.buyerList = this.buyerList.concat(res.data.data);
        };
        utils.dealResponse(res, cb);
      }).catch(err => {
        utils.dealError(err);
      });
    },
    load() {
      if (this.haveMore) {
        this.loading = true;
        this.getList();
        this.page++;
      }
    },
  },
  mounted() {
    let id = this.$route.query.id;
    if (!id) {
      return this.$router.go(-1);
    }
    this.id = id;
    this.load();
    utils.setTitle.call(this, '订单详情');
  },
};
</script>
