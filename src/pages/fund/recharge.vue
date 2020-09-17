<!--
 * @file 扫码支付页面
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/17 11:20
-->
<template>
  <view class="rww-container">
    <!-- 金额倒计时 -->
    <!-- 二维码 -->
    <image :src="fundOrderInfo.qrSrc"></image>
    <!-- 提示信息 -->
    <!-- 联系客服 -->
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { order } from "@/api/order";
import { uniWrapper } from "@/assets/js/uni-wrapper";

@Component({})
export default class extends Vue {
  fundOrderInfo: any = {};
  onLoad(e: { fundOrderId: string }) {
    if (!e.fundOrderId) {
      uniWrapper.showToastText("充值订单信息有误");
      return;
    }
    this.getFundOrderInfo(e.fundOrderId);
  }

  /**
   * 查询充值订单
   */
  async getFundOrderInfo(fundOrderId: string) {
    const [err, data] = await order.getFundOrderInfoById({ fundOrderId });
    console.log(err, data);
    this.fundOrderInfo = data;
  }
}
</script>

<style lang="scss" scoped></style>
