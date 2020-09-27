<template>
  <view class="rww-container">
    <!-- 顶部tab -->
    <view class="order-tabs">
      <view
        v-for="item in tabList"
        :key="item.status"
        :class="{ 'order-tab-active': item.status === currentTab.status }"
        class="order-tab"
        @click="switchTab(item)"
      >
        {{ item.name }}
      </view>
    </view>
    <!-- 订单列表 -->
    <view class="order-list">
      <order-list
        :order-list="orderList"
        is-show-detail-btn
        @click-order="goOrderDetail"
        @refresh-order="switchTab"
      />
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { BasePage } from "@/assets/js/base-model";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { order } from "@/api/order";
import OrderList from "@/components/order-list.vue";
import { ROUTE } from "@/assets/constant/common";

enum STATUS {
  ALL = -1,
  WAIT_PAY = 1,
  WAIT_STORE = 2,
  WAIT_EXPRESS = 3,
  WAIT_CUSTOMER = 5,
}
@Component({
  components: {
    OrderList,
  },
})
export default class LoginHome extends Vue {
  tabList: Array<order.ITabItem> = [
    { name: "全部", status: -1 },
    { name: "待支付", status: 1 },
    { name: "待打单", status: 2 },
    { name: "待出库", status: 3 },
    { name: "待发货", status: 5 },
    { name: "已完成", status: 6 },
  ]; // 订单分类列表
  currentTab: order.ITabItem = { name: "全部", status: -1 }; // 当前选中的分类
  orderList: Array<any> = []; // 订单列表
  pageInfo: BasePage = new BasePage();

  onLoad(e: { status: STATUS } = { status: STATUS.ALL }) {
    this.currentTab.status = +e.status || -1;
    this.getOrderList(this.currentTab);
  }
  onShow() {}

  onReachBottom() {
    if (this.pageInfo.haveMore) {
      this.pageInfo.currentPage += 1;
      this.getOrderList(this.currentTab);
    } else {
      uniWrapper.showToastText("已经到底啦");
    }
  }

  onPullDownRefresh() {
    this.orderList = [];
    this.pageInfo = new BasePage();
    this.getOrderList(this.currentTab);
    setTimeout(uni.stopPullDownRefresh, 1000);
  }
  /**
   * 切换订单类型
   */
  switchTab(item?: order.ITabItem) {
    item && (this.currentTab = item);
    this.orderList = [];
    this.pageInfo = new BasePage();
    this.getOrderList(this.currentTab);
  }
  /**
   * 查询订单
   */
  async getOrderList(item: order.ITabItem) {
    const [err, data] = await order.getList({
      pageSize: this.pageInfo.pageSize,
      currentPage: this.pageInfo.currentPage,
      status: item.status,
    });
    if (err || !data?.length) {
      return;
    }
    this.pageInfo.haveMore = data.length >= this.pageInfo.pageSize;
    this.orderList = this.orderList.concat(data);
  }

  /**
   * 前往订单详情
   */
  goOrderDetail(item: order.IDetailRes) {
    uniWrapper.navigateToPage(`${ROUTE.ORDER_DETAIL}?orderId=${item.orderId}`);
  }
}
</script>

<style lang="scss" scoped>
.rww-container {
  padding: px2rpx(38) 0;
}
.order {
  /* 顶部tab */
  &-tabs {
    @include fixed-top(px2rpx(44));
    @include flex-row;
    margin-bottom: $s-sm;
    overflow: auto;
    background-color: #fff;
  }

  &-tab {
    position: relative;
    height: 3em;
    min-width: 6em;
    line-height: 3em;
    text-align: center;

    &-active::after {
      content: " ";
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background-color: $c-theme;
    }
  }
}
</style>
