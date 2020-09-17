<template>
  <view class="rww-container">
    <!-- 充值金额 -->
    <view class="balance__moneys layout">
      <view class="layout__title"> 选择充值金额</view>
      <view class="layout__body">
        <view
          v-for="item in moneyList"
          :key="item"
          :class="{ 'layout__item-active': currentMoney === item }"
          class="layout__item balance__item"
          @click="currentMoney = item"
        >
          {{ item }}元
        </view>
      </view>
    </view>
    <!-- 充值方式 -->
    <view class="status layout">
      <view class="layout__title"> 选择支付方式</view>
      <view class="layout__body">
        <view
          v-for="item in statusList"
          :key="item.name"
          :class="{ 'layout__item-active': currentStatus.name === item.name }"
          class="status__item layout__item"
          @click="currentStatus = item"
        >
          <uv-icon :name="item.icon" />
          {{ item.name }}
        </view>
      </view>
    </view>
    <!-- 充值按钮 -->
    <view class="button-wrapper">
      <uv-button
        :loading="isDisableBtn"
        :disabled="isDisableBtn"
        custom-class="theme-style__button"
        size="large"
        @click="submit"
      >
        确认充值
      </uv-button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { ROUTE } from "@/assets/constant/common";
import { order } from "@/api/order";

interface IStatusItem {
  name: string;
  icon: string,
  id: number
}

@Component({})
export default class LoginHome extends Vue {
  moneyList: Array<number> = [1, 2, 5, 10, 20, 50, 100, 200, 500];
  currentMoney: number = 20;
  statusList: Array<IStatusItem> = [
    {
      id: 1,
      name: "支付宝",
      icon: "alipay",
    },
    {
      id: 2,
      name: "微信",
      icon: "wechat",
    },
  ];
  currentStatus: IStatusItem = {
    id: 1,
    name: "支付宝",
    icon: "alipay",
  };
  isDisableBtn: boolean = false;

  /**
   * 确认充值
   */
  async submit() {
    const { currentStatus } = this;
    this.isDisableBtn = true;
    const [err, data] = await order.confirmFundOrder({
      payType: currentStatus.id,
      money: this.currentMoney * 100
    });
    this.isDisableBtn = false;
    const fundOrderId = data?.fundOrderId;
    if(err || !fundOrderId) {
      return;
    }
    uniWrapper.navigateToPage(`${ROUTE.FUND_RECHARGE}?fundOrderId=${fundOrderId}`);
  }
}
</script>

<style
  lang="scss"
  scoped
>
  /* 公共样式 */
  .layout {
    margin-bottom: $s-sm;
    background-color: #fff;

    &__title {
      @include bd-hairline-bottom;
      padding: $s-sm;
      font-size: $fz-lg;
    }

    &__body {
      @include flex-row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: $s-sm;
      text-align: center;
    }

    &__item {
      @include bd-hairline-base;
      width: 30%;
      height: 3em;
      margin-bottom: $s-sm;
      line-height: 3em;

      &::after {
        border: 1px solid $bdc-base;
      }

      &-active {
        background-color: $c-theme;
        color: #fff;

        &::after {
          border-width: 0;
        }
      }
    }
  }

  .status {
    .layout__body {
      justify-content: flex-start;
    }

    &__item {
      @include flex-row;
      justify-content: center;
      flex-grow: 1;
    }

    /deep/ .uv-icon {
      margin-right: $s-xxs;
    }
  }

  .button-wrapper {
    padding: $s-sm;
    margin-top: $s-xxl;
  }
</style>
