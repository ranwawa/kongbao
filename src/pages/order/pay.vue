<template>
  <view class="rww-container">
    <!-- 支付金额 -->
    <view class="pay__amount">
      <uv-price
        :amount="orderInfo.amount"
        :size="18"
        custom-style="margin: 60rpx auto;"
      />
    </view>
    <!-- 可用余额 -->
    <uv-cell
      :border="false"
      :value="computedBalance"
      icon="balance-o"
      title="余额支付"
    />
    <view class="pay__btn">
      <uv-button
        v-if="userInfo.balance >= orderInfo.amount"
        :disabled="isDisableSubmit"
        :load="isDisableSubmit"
        custom-class="theme-style__button"
        size="large"
        @click="submit"
      >
        立即支付
      </uv-button>
      <uv-button
        v-else
        custom-class="theme-style__button"
        size="large"
        @click="goRecharge"
      >
        余额告急, 请充值
      </uv-button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { order } from "@/api/order";
import UvPrice from "uni-vant/lib/price.vue";
import { user } from "@/api/user";
import { ROUTE } from "@/assets/constant/common";

@Component({
  components: {
    UvPrice,
  },
})
export default class LoginHome extends Vue {
  userInfo: user.IUserInfoRes = Object(); // 用户信息
  orderInfo: order.IDetailRes = Object(); // 订单详情
  isDisableSubmit: boolean = false; // 是否禁用提交按钮
  orderId: string = "";

  get computedBalance() {
    const { balance } = this.userInfo;
    return "可用" + (balance ? (balance / 100).toFixed(2) : 0) + "元";
  }
  onLoad(e: { orderId?: string }) {
    if (!e.orderId) {
      uniWrapper.showToastText("订单信息有误");
      return;
    }
    this.orderId = e.orderId;
    this.getOrderInfo(e.orderId);
  }
  onShow() {
    // 每次显示的时候获取一下,可以拿到最新的金额
    this.getUserInfo();
  }

  /**
   * 查询订单信息
   */
  async getOrderInfo(orderId: string) {
    const [err, data] = await order.getSingle({ orderId });
    if (err || !data?.amount) {
      return;
    }
    data.amount = data.amount / 100;
    this.orderInfo = data;
    console.log(err, data);
  }

  /**
   * 查询用户信息
   */
  async getUserInfo() {
    const [err, data] = await user.getUserInfo();
    if (err || !data) {
      return;
    }
    this.userInfo = data;
  }

  /**
   * 付款
   */
  async submit() {
    this.isDisableSubmit = true;
    const [err, data] = await order.pay({
      orderId: this.orderId,
    });
    this.isDisableSubmit = false;
    if (err || !data) {
      return;
    }
    uniWrapper.redirectToPage(ROUTE.ORDER_LIST);
  }

  /**
   * 前往充值页面
   */
  goRecharge() {
    uniWrapper.navigateToPage(ROUTE.FUND_BALANCE);
  }
}
</script>

<style lang="scss" scoped>
/* 支付金额 */
.pay__amount {
  margin-bottom: $s-sm;
  text-align: center;
  background-color: #fff;
}
/* 按钮 */
.pay__btn {
  margin: $s-xxl $s-sm 0;
}
</style>
