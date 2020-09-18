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
      <view class="recharge-countdown" >
        <template v-if="!isExpired && countdown">
          请在
          <text class="recharge-countdown__time">{{ countdown }}</text>
          内支付，逾期支付无法到帐
        </template>
      </view>
    </view>
    <!-- 二维码 -->
    <view
      v-if="fundOrderInfo.qrSrc"
      class="recharge-qr"
      @click="clickImg"
    >
      <image
        :class="{
        'recharge-qr__img-payed': isPayed,
        'recharge-qr__img-expired': isExpired,
      }"
        class="recharge-qr__img"
        :src="fundOrderInfo.qrSrc"
      />
      <view
        v-if="!isExpired"
        class="recharge-qr__desc"
      >
        请用{{ fundOrderInfo.payType === 1 ? '支付宝' : '微信' }}扫码支付
      </view>
    </view>
    <view
      v-else
      class="recharge-qr recharge-qr-invalid"
      @click="goPage('/pages/fund/balance')"
    >
      <uv-icon
        name="qr-invalid"
        size="28"
        custom-style="margin-right: 24rpx;"
        color="red"
      />
      网络异常,请联系客服人员
      <br>
      或点击这里更换充值金额
    </view>
    <!-- 提示信息 -->
    <view
      :class="{'recharge-tip-fixed': isAlert}"
      class="recharge-tip"
      @click="isAlert =false"
    >
      <view class="recharge-tip__wrapper" />
      <view class="recharge-tip__body">
        <view class="recharge-tip__title">温馨提示</view>
        1. 付款金额必须一致，精确到分。否则无法到帐
        <br />
        2. 请在有效期内付款,超时付款无法到帐
        <br />
        3. 出现无法支付的情况请联系客服人员。
        <uv-button
          v-if="isAlert"
          type="primary"
          custom-style="margin-top: 24rpx; float: right"
        >我知道了
        </uv-button>
      </view>
    </view>
    <!-- 联系客服 -->
    <uv-cell
      :border="false"
      title="客服"
      icon="service-o"
      value="点击这里联系客服"
      size="large"
      is-link
    />
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { order } from "@/api/order";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import countdown from "countdown";
import { ROUTE } from "@/assets/constant/common";

@Component({})
export default class extends Vue {
  fundOrderInfo: any = {}; // 支付订单信息
  countdown: string = ""; // 倒计时文案
  timer: number = 0; // 倒计时计时器
  isExpired: boolean = false; // 是否过期
  isPayed: boolean = false; // 是否支付
  isAlert: boolean = true; // 是否提示
  onLoad(e: { fundOrderId: string }) {
    if (!e.fundOrderId) {
      uniWrapper.showToastText("充值订单信息有误");
      return;
    }
    this.getFundOrderInfo(e.fundOrderId);
  }

  onUnload() {
    this.timer && clearInterval(this.timer);
  }

  /**
   * 查询充值订单
   */
  async getFundOrderInfo(fundOrderId: string) {
    const [err, data] = await order.getFundOrderInfoById({ fundOrderId });
    if (err || !data) {
      return;
    }
    const { expireTime } = data;
    let now = Date.now();
    if (now - expireTime > 1000) {
      this.isExpired = true;
    } else {
      this.getCountdown(now, expireTime);
      this.getFundOrderStatusLoop(e.fundOrderId);
    }
    this.fundOrderInfo = data;
  }

  /**
   * 轮询订单状态
   */
  getFundOrderStatusLoop(fundOrderId: string) {
    setTimeout(async () => {
      if (this.isExpired) {
        return;
      }
      const [, data] = await order.getFundOrderInfoById({ fundOrderId });
      console.log(data?.status);
      if (data?.status === 3) {
        this.isPayed = true;
        setTimeout(uni.navigateBack, 1688);
        return;
      }
      await this.getFundOrderStatusLoop(fundOrderId);
    }, 5000);
  }

  /**
   * 获取倒计时
   */
  getCountdown(now: number, expireTime: number) {
    countdown.setLabels("毫秒|秒|分|", "毫秒|秒|分|||", "");
    this.timer = setInterval(() => {
      if (expireTime - now > 1000) {
        now += 1000;
        this.countdown = countdown(now, expireTime).toString();
      } else {
        this.isExpired = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  /**
   * 点击失效二维码
   */
  clickImg() {
    if (this.isExpired) {
      this.goPage('/pages/fund/balance')
    }
  }

  goPage(page: string) {
    uniWrapper.redirectToPage(page);
  }
}
</script>

<style
  lang="scss"
  scoped
>
  .rww-container {
    padding-bottom: $s-xxl;
  }

  .recharge {
    /* 倒计时金额 */
    &-head {
      @include flex-column;
      padding: $s-sm;
      margin-bottom: $s-sm;
      background-color: #fff;
    }

    &-countdown {
      @include flex-row;
      margin-top: $s-sm;

      &__time {
        color: red;
      }
    }

    /* 二维码 */
    &-qr {
      padding: $s-sm;
      margin: $s-sm auto;
      background-color: #fff;

      &-invalid {
        @include flex-row;
        font-size: $fz-xl;
      }

      &__img {
        position: relative;
        display: block;
        width: px2rpx(268);
        height: px2rpx(268);
        margin: auto;

        &-payed::after,
        &-expired::after {
          @include flex-row;
          justify-content: center;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          background-color: rgba(0, 0, 0, .6);
          color: #fff;
          font-size: $fz-xl;
        }

        &-payed::after {
          content: '支付成功，即将返回';
        }

        &-expired::after {
          content: '二维码已失效，点击刷新';
        }
      }

      &__desc {
        padding: $s-sm;
        font-size: $fz-xl;
        font-weight: bold;
        text-align: center;
      }
    }

    /* 提示信息 */
    &-tip {
      position: relative;
      padding: $s-sm;
      margin: $s-sm 0;
      background-color: #fff;
      color: $c-light;

      &__body {
        position: relative;
        z-index: 2;
        width: 100%;
        padding: $s-sm;
      }

      &__title {
        margin-bottom: $s-sm;
        font-size: $fz-lg;
      }

      /* 提示状态 */
      &-fixed {
        @include flex-column;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        justify-content: center;
        background-color: transparent;
        color: $c-base;
      }

      &-fixed &__wrapper {
        display: block;
      }

      &-fixed &__body {
        background-color: #fff;
      }

      &__wrapper {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: none;
        background-color: rgba(0, 0, 0, .8);
      }
    }
  }
</style>
