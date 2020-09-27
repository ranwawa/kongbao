<template>
  <view class="rww-container">
    <!-- 滚动图 -->
    <swiper class="swiper">
      <swiper-item>
        <image
          class="swiper__img"
          mode="aspectFill"
          src="https://images.jixugou.cn/c60d70ca-a0d6-4d86-8c24-435022508d34.jpg"
        />
      </swiper-item>
    </swiper>
    <!-- 导航条 -->
    <view class="uv-tabs">
      <view
        v-for="item in cityList"
        :key="item.cityId"
        :class="{ 'uv-tab-active': item.cityId === currentCity.cityId }"
        class="uv-tab"
        @click="switchStoreTab(item)"
      >
        {{ item.cityName }}
      </view>
    </view>
    <!-- 商品列表 -->
    <view class="goods-list">
      <goods-card
        :list="goodsList"
        @click-item="goDetail"
        @click-btn="goToOrder"
      />
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import GoodsCard from "@/components/goods-card.vue";
import { goods } from "@/api/goods";
import { BasePage } from "@/assets/js/base-model";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { ROUTE } from "@/assets/constant/common";

@Component({
  components: {
    GoodsCard,
  },
  watch: {
    currentCity(newValue, oldValue) {
      if (oldValue.goodsList) {
        return;
      }
      // @ts-ignore
      this.getGoodsList(newValue);
    },
  },
})
export default class LoginHome extends Vue {
  cityList: Array<city.IItem> = Array();
  currentCity: city.IItem = Object();
  goodsList: Array<goods.IGoodsItem> = Array();
  pageInfo: BasePage = new BasePage();

  onLoad() {
    this.getCityList();
  }

  onReachBottom() {
    if (this.pageInfo.haveMore) {
      this.pageInfo.currentPage += 1;
      this.getGoodsList(this.currentCity);
    } else {
      uniWrapper.showToastText("已经到底啦");
    }
  }

  onPullDownRefresh() {
    this.goodsList = [];
    this.pageInfo = new BasePage();
    this.getGoodsList(this.currentCity);
    setTimeout(uni.stopPullDownRefresh, 1000);
  }

  /**
   * 获取仓库列表
   */
  async getCityList() {
    const [err, data] = await goods.getCityList();
    if (err || !data?.length) {
      return;
    }
    this.cityList = data;
    this.currentCity = data[0];
  }

  /**
   * 切换仓库选项卡
   */
  switchStoreTab(item: city.IItem) {
    if (this.currentCity.cityId === item.cityId) {
      return;
    }
    this.pageInfo = new BasePage();
    this.goodsList = Array();
    this.currentCity = item;
  }

  /**
   * 根据仓库编号查询商品列表
   */
  async getGoodsList(item: city.IItem) {
    const [err, data] = await goods.getGoodsList({
      pageSize: this.pageInfo.pageSize,
      currentPage: this.pageInfo.currentPage,
      cityId: item.cityId,
    });
    if (err || !data?.length) {
      this.pageInfo.haveMore = false;
      return;
    }
    this.goodsList = this.goodsList.concat(data);
  }

  /**
   * 前往商品详情
   */
  goDetail(item: goods.IGoodsItem) {
    uniWrapper.navigateToPage(`${ROUTE.GOODS_DETAIL}?goodsId=${item.goodsId}`);
  }

  /**
   * 前往下单页面
   * @param item
   */
  goToOrder(item: goods.IGoodsItem) {
    uniWrapper.navigateToPage(`${ROUTE.ORDER_INDEX}?goodsId=${item.goodsId}`);
  }
}
</script>

<style lang="scss" scoped>
/* 滚动图 */
.swiper {
  height: px2rpx(168);
  width: 100%;

  &__img {
    width: 100%;
    height: 100%;
  }
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
