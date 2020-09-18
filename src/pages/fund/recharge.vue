<!--
 * @file 扫码支付页面
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/17 11:20
-->
<template>
  <view class="rww-container">
    <!-- 金额倒计时 -->
    <view class="recharge-head">
      <uv-price :amount="fundOrderInfo.realPriceStr" />
      <view v-if="countdown" class="recharge-countdown">
        请在<text class="recharge-countdown__time">{{ countdown }}</text>
      </view>
    </view>
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
import countdown from "countdown";

@Component({})
export default class extends Vue {
  fundOrderInfo: any = {};
  countdown: string = "";
  timer: number = 0;
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
    if (err || !data) {
      return;
    }
    console.log(err, data);
    this.getCountdown(data.createTime, data.expireTime);
    this.fundOrderInfo = data;
  }
  getCountdown(start: number, end: number) {
    if (start < end) {
      this.countdown = "";
    }
    let now = Date.now();
    countdown.setLabels("毫秒|秒|分|", "毫秒|秒|分|||", "");
    this.timer = setInterval(() => {
      if (now > 1000) {
        this.countdown = countdown(Date.now(), end).toString();
      } else {
        this.countdown = "";
        clearTimeout(this.timer);
      }
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.recharge {
  /* 倒计时金额 */
  &-head {
    @include flex-column;
    background-color: #fff;
  }
  &-countdown {
    @include flex-row;
  }
}
</style>
