<template>
  <view class="rww-container">
    <!-- 头部图片价格标题 -->
    <div class="goods-header">
      <swiper class="goods-header__swiper">
        <swiper-item v-for="item in goodsInfo.imgList" :key="item">
          <image class="goods-header__img" mode="aspectFill" :src="item" />
        </swiper-item>
      </swiper>

      <view class="goods-header__row">
        <uv-price :amount="goodsInfo.salePriceNormalStr"></uv-price>
        <view class="goods-header__origin"
          >市场价: {{ goodsInfo.showPriceStr }}</view
        >
        <view class="goods-header__record">已售{{ goodsInfo.sales }}件</view>
      </view>
      <view class="goods-header__title">
        <uv-tag type="danger" custom-style="margin-right: 8rpx;" round>
          {{ goodsInfo.expressName }}
        </uv-tag>
        {{ goodsInfo.goodsName }}
      </view>
    </div>
    <!-- 商品参数 -->
    <uv-cell-group>
      <uv-cell
        icon="hotel-o"
        title="发货仓库"
        :label="goodsInfo.storeName"
        :value="goodsInfo.shipAddress"
      />
      <uv-cell
        :border="false"
        icon="logistics"
        title="承运快递"
        :label="goodsInfo.expressName"
        :value="goodsInfo.notSendAddress || '无'"
      ></uv-cell>
    </uv-cell-group>
    <!-- 商品详情 -->
    <view class="goods-content">
      <view class="goods-content__title">商品详情</view>
      <view class="goods-content__body">
        {{ goodsInfo.content }}
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="goods-fixed">
      <view class="goods-fixed__service">
        <uv-icon name="service-o"  size="28"/>
        联系客服
      </view>
      <view class="goods-fixed__service">
        <uv-icon name="share" size="28"/>
        分享好友
      </view>
      <uv-button
        size="large"
        custom-style="min-width: 8em !important;"
        @click="submit"
        >立即购买</uv-button
      >
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UvTag from "uni-vant/lib/tag.vue";
import UvPrice from "uni-vant/lib/price.vue";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { goods } from "@/api/goods";
import { ROUTE } from "@/assets/constant/common";

@Component({
  components: {
    UvTag,
    UvPrice,
  },
})
export default class LoginHome extends Vue {
  goodsInfo: goods.IGoodsItem = Object();
  onLoad(e: { goodsId: string }) {
    if (!e.goodsId) {
      uniWrapper.showToastText("该商品已被抢光");
      setTimeout(uni.navigateBack, 1688);
    }
    this.getGoodsDetail(e.goodsId);
  }
  /**
   * 查询商品详情
   * @param goodsId
   */
  async getGoodsDetail(goodsId: string) {
    const [err, data] = await goods.getGoodsDetail({ goodsId });
    if (err || !data?.goodsId) {
      return;
    }
    data.notSendAddress = `暂不发货区域: ${data.notSendAddress}`;
    this.goodsInfo = data;
  }
  submit() {
    uniWrapper.navigateToPage(
      `${ROUTE.ORDER_INDEX}?goodsId=${this.goodsInfo.goodsId}`
    );
  }
}
</script>

<style lang="scss" scoped>
.rww-container {
  padding-bottom: px2rpx(88);
}
/* 头部图片价格标题 */
.goods-header {
  background-color: #fff;
  &__swiper {
    height: px2rpx(365);
  }
  &__img {
    width: 100%;
    height: inherit;
  }
  &__row {
    @include flex-row;
    align-items: flex-end;
    padding: $s-xs $s-sm 0;
    color: $c-light;
    font-size: $fz-sm;
  }
  &__origin {
    flex-grow: 1;
    margin-left: $s-xs;
    text-decoration: line-through;
  }
  &__title {
    @include text-truncate(2);
    padding: $s-sm;
    margin-bottom: $s-sm;
  }
}
/* 商品详情 */
.goods-content {
  margin: $s-sm 0;
  background-color: #fff;
  &__title {
    padding: $s-sm;
  }
}
/* 底部按钮 */
.goods-fixed {
  @include flex-row;
  @include bd-hairline-top;
  @include fixed-bottom;
  padding: $s-sm 0 $s-lg;
  background-color: #fff;
  &__service {
    @include flex-column;
    padding: 0 $s-xs;
  }
  /deep/ .uv-btn {
    @include theme-style__button;
    flex-grow: 1;
    padding: 0 $s-xs;
    margin: 0 $s-xs;
    text-align: center;
  }
}
</style>
