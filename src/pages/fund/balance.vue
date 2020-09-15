<template>
  <view class="rww-container">
    <!-- 充值金额 -->
    <view class="balance__moneys layout">
      <view class="layout__title"> 选择充值金额 </view>
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
      <view class="layout__title"> 选择充值金额 </view>
      <view class="layout__body">
        <view
          v-for="item in statusList"
          :key="item"
          :class="{ 'layout__item-active': currentStatusName === item.name }"
          class="status__item layout__item"
          @click="currentStatusName = item.name"
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

@Component({})
export default class LoginHome extends Vue {
  moneyList: Array<number> = [1, 2, 5, 10, 20, 50, 100, 200, 500];
  currentMoney: number = 20;
  statusList: Array<{ name: string; icon: string }> = [
    {
      name: "微信",
      icon: "phone",
    },
    {
      name: "支付宝",
      icon: "phone",
    },
  ];
  currentStatusName: string = "微信";
  isDisableBtn: boolean = false;

  /**
   * 确认充值
   */
  async submit() {
    this.isDisableBtn = true;
  }
}
</script>

<style lang="scss" scoped>
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
