<template>
  <view class="rww-container">
    <!-- 导航条 -->
    <view class="uv-tabs">
      <view
        v-for="item in fundTypeList"
        :key="item.name"
        :class="{ 'uv-tab-active': item.name === currentType.name }"
        class="uv-tab"
        @click="switchType(item)"
      >
        {{ item.name }}
      </view>
    </view>
    <!-- 数据列表 -->
    <view class="list">
      <view v-for="item in fundList" :key="item.fundId" class="list-item">
        <uv-cell
          :title="item.priceStr"
          :label="item.typeStr"
          :value="item.createTimeStr"
          size="large"
          center
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { BasePage } from "@/assets/js/base-model";
import { fund } from "@/api/fund";
import { uniWrapper } from "@/assets/js/uni-wrapper";

interface ITypeItem {
  name: string;
  isIncome: boolean;
}
enum TYPE {
  "充值" = 11,
  "管理员充值" = 12,
  "购物" = 21,
  "管理员扣减" = 22,
  "开通VIP" = 23,
}
@Component({})
export default class LoginHome extends Vue {
  fundTypeList: Array<ITypeItem> = [
    {
      name: "收入",
      isIncome: true,
    },
    {
      name: "支出",
      isIncome: false,
    },
  ];
  currentType: ITypeItem = {
    name: "收入",
    isIncome: true,
  };
  fundList: Array<fund.IFundItem> = [];
  currentFund: fund.IFundItem = Object();
  pageInfo = new BasePage(20);

  onLoad() {
    this.getList();
  }

  onReachBottom() {
    if (this.pageInfo.haveMore) {
      this.pageInfo.currentPage += 1;
      this.getList();
    } else {
      uniWrapper.showToastText("已经到底啦");
    }
  }

  /**
   * 切换收入支出
   */
  switchType(item: ITypeItem) {
    this.currentType = item;
    this.fundList = [];
    this.pageInfo = new BasePage(20);
    this.getList();
  }

  /**
   * 获取资金明细列表
   */
  async getList() {
    const [err, data] = await fund.getListByType({
      pageSize: this.pageInfo.pageSize,
      currentPage: this.pageInfo.currentPage,
      isIncome: this.currentType.isIncome,
    });
    if (err || !data?.length) {
      this.pageInfo.haveMore = false;
      return;
    }
    this.pageInfo.haveMore = data.length === this.pageInfo.pageSize;
    this.fundList = this.fundList.concat(
      data.map((ele) => {
        ele.typeStr = TYPE[ele.type];
        return ele;
      })
    );
  }
}
</script>

<style lang="scss" scoped>
.rww-container {
  padding-bottom: $s-xxl;
}
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
