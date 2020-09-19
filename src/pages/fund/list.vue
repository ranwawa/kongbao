<template>
  <view class="rww-container">
    <!-- 导航条 -->
    <view class="uv-tabs">
      <view
        v-for="item in fundTypeList"
        :key="item.value"
        :class="{ 'uv-tab-active': item.value === currentType.value }"
        class="uv-tab"
        @click="switchType(item)"
      >
        {{ item.name }}
      </view>
    </view>
    <!-- 数据列表 -->
    <view class="list">
      <view class="list-item"></view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { BasePage } from "@/assets/js/base-model";

interface ITypeItem {
  name: string;
  value: 1 | 2;
}
interface IFundItem {
  type: number;
  createTime: number;
  price: number;
}

@Component({})
export default class LoginHome extends Vue {
  fundTypeList: Array<ITypeItem> = [{
    name: '收入',
    value: 1,
  }, {
    name: '支出',
    value: 2
  }];
  currentType: ITypeItem = {
    name: '收入',
    value: 1
  };
  fundList: Array<IFundItem> = [];
  currentFund: IFundItem = Object();
  pageInfo = new BasePage();

  switchType(item: ITypeItem) {
    this.currentType = item;
    this.fundList = [];
  }
  getList() {
    const { value } = this.currentType;

  }
}
</script>

<style
  lang="scss"
  scoped
>
  /* 导航条 */
  .uv-tabs {
    @include flex-row;
    justify-content: space-between;
    margin-bottom: $s-sm;
    background-color: #fff;
    text-align: center;
  }

  .uv-tab {
    position: relative;
    flex-grow: 1;
    padding: $s-sm $s-md;
    line-height: $s-xl;

    &-active {
      color: $c-theme;
      font-weight: bold;
      &::after {
        content: " ";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: px2rpx(3);
        background-color: $c-theme;
      }
    }
  }
</style>
