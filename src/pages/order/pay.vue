<template>
  <view class="rww-container">
    <!-- 可用余额 -->
    <view class="order-pay">
      <uv-cell :border="false" title="余额支付" value="可用余额"></uv-cell>
    </view>
    <uv-button custom-class="theme-style__button" size="large">
      余额告急, 请充值
    </uv-button>
    <uv-button custom-class="theme-style__button" size="large">
      立即支付
    </uv-button>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { order } from "@/api/order";

@Component({})
export default class LoginHome extends Vue {
  onLoad(e: { orderId?: string }) {
    if (!e.orderId) {
      uniWrapper.showToastText("订单信息有误");
      return;
    }
  }

  /**
   * 查询订单信息
   */
  async getOrderInfo(orderId: string) {
    const [err, data] = await order.getSingle({ orderId });
    console.log(err, data);
  }

  /**
   * 查询用户信息
   */
  async getUserBalance() {}
}
</script>

<style lang="scss" scoped></style>
