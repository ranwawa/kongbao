<template>
  <view class="rww-container">
    <!-- 售后地址 -->
    <view class="order-service section">
      <view class="section__header">
        <view class="section__title">售后信息</view>
        <view class="section__desc">
          <uv-icon size="18" name="question-o" />
        </view>
      </view>
      <view
        class="order-service__content order-service__content-empty section__body"
      >
        请选择售后信息
      </view>
    </view>
    <!-- 收件地址 -->
    <view class="order-address section">
      <view class="section__header">
        <view class="section__title">收货地址</view>
        <view class="section__desc">
          <uv-icon size="18" name="question-o" />
        </view>
      </view>
      <view
        class="order-address__content order-address__content-empty section__body"
      >
        请添加收货地址
      </view>
    </view>
    <!-- 商品信息 -->
    <view class="order-goods section">
      <view class="section__header">
        <view class="section__title">{{ goodsInfo.storeName }}</view>
      </view>
      <view class="order-goods__content section__body">
        <goods-cell :goods-info="goodsInfo" :goods-num="addressList.length" />
      </view>
    </view>
    <!-- 金额小计 -->
    <view class="order-amount section">
      <view class="section__header">
        <view class="section__title">小计</view>
        <view class="section__desc">
          <uv-price :amount="computedGoodsAmount" size="8"></uv-price>
        </view>
      </view>
      <view class="order-amount__content">
        <uv-cell title="商品" :value="computedGoodsAmount"> </uv-cell>
        <uv-cell :border="false" title="运费" value="包邮"> </uv-cell>
      </view>
    </view>
    <!-- 余额支付 -->
    <view class="order-pay">
      <uv-cell :border="false" title="余额支付" value="可用余额"></uv-cell>
    </view>
    <!-- 底部按钮 -->
    <view class="order-footer">
      <view class="order-footer__amount">
        实付款: <uv-price :amount="computedGoodsAmount" size="8" />
      </view>
      <uv-button
        custom-class="theme-style__button"
        custom-style="border-radius: 0 !important;border-width: 0 !important;margin: 0;"
      >
        立即支付</uv-button
      >
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { goods } from "@/api/goods";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import GoodsCell from "@/components/goods-cell.vue";
import UvPrice from "uni-vant/lib/price.vue";

@Component({
  components: {
    UvPrice,
    GoodsCell,
  },
})
export default class LoginHome extends Vue {
  goodsInfo: goods.IGoodsItem = Object();
  serviceInfo: service.IItem = Object();
  addressList: Array<any> = Array();
  get computedGoodsAmount() {
    const price = this.goodsInfo.salePriceNormal || 0;
    return price * this.addressList.length;
  }
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
    if (err || !data?._id) {
      return;
    }
    console.log(data);
    data.notSendAddress = `暂不发货区域: ${data.notSendAddress}`;
    this.goodsInfo = data;
  }
}
</script>

<style lang="scss" scoped>
.rww-container {
  padding-bottom: px2rpx(88);
}
/* 售后地址 */
.order-service {
  &__content {
    text-align: left;
    &-empty {
      color: $c-light;
      text-align: center;
    }
  }
}
/* 收货地址 */
.order-address {
  &__content {
    text-align: left;
    &-empty {
      color: $c-light;
      text-align: center;
    }
  }
}
/* 商品小计 */
.order-amount {
  &__content {
    margin-top: 1px;
  }
}
/* 底部按钮 */
.order-footer {
  @include flex-row;
  @include bd-hairline-top;
  @include fixed-bottom(0);
  justify-content: space-between;
  background-color: #fff;

  &__amount {
    flex-grow: 1;
    text-align: center;
  }
}
</style>
