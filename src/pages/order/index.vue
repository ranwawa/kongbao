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
        class="order-service__content section__body"
        :class="{ 'order-service__content-empty': !serviceInfo.name }"
        @click="goToAddressList"
      >
        {{ computedAddressInfo }}
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
        class="order-address__content section__body"
        :class="{ 'order-address__content-empty': addressList.length === 0 }"
        @click="handleClickReceiveAddress"
      >
        <view v-for="(item, index) in addressList" :key="index">
          {{ item.formattedAddress }}
        </view>
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
    <!-- 添加地址弹框 -->
    <address-add
      v-show="isShowAddressAdd"
      :city-info="cityInfo"
      @click-city="$refs.simpleAddress.open()"
      @close="isShowAddressAdd = false"
      @submit="handleSubmit"
    />
    <!-- 省市区 -->
    <simple-address
      ref="simpleAddress"
      :picker-value-default="[0, 0, 1]"
      :confirm-color="themeColor"
      cancel-color="#999"
      @onConfirm="handleConfirm"
    />
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { goods } from "@/api/goods";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import GoodsCell from "@/components/goods-cell.vue";
import UvPrice from "uni-vant/lib/price.vue";
import { ROUTE } from "@/assets/constant/common";
import { vm } from "@/assets/js/event-bus";
import SimpleAddress from "simple-address";
import AddressAdd from "@/components/address-add.vue";
import { address } from "@/api/address";

@Component({
  components: {
    UvPrice,
    GoodsCell,
    AddressAdd,
    SimpleAddress,
  },
})
export default class LoginHome extends Vue {
  goodsInfo: goods.IGoodsItem = Object();
  serviceInfo: address.IAddressItem = Object();
  addressList: Array<any> = Array();
  isShowAddressAdd: boolean = false; // 是否显示添加地址弹框
  cityInfo = ""; // 选中的省市区信息

  get computedGoodsAmount() {
    const price = this.goodsInfo.salePriceNormal || 0;
    return price * this.addressList.length;
  }
  get computedAddressInfo() {
    const {
      name,
      mobile,
      provinceName,
      cityName,
      areaName,
      address,
    } = this.serviceInfo;
    return name
      ? `${name} ${mobile} ${provinceName}${cityName}${areaName}${address}`
      : "请点击选择售后信息";
  }
  onLoad(e: { goodsId: string }) {
    if (!e.goodsId) {
      uniWrapper.showToastText("该商品已被抢光");
      setTimeout(() => {
        uniWrapper.redirectToPage(ROUTE.TAB_CATEGORY);
      }, 1688);
    }
    this.getGoodsDetail(e.goodsId);
    vm.$on("updateService", (item: address.IAddressItem) => {
      this.serviceInfo = item;
    });
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
    data.notSendAddress = `暂不发货区域: ${data.notSendAddress}`;
    this.goodsInfo = data;
  }

  /**
   * 前往售后服务地址
   */
  goToAddressList() {
    uniWrapper.navigateToPage(`${ROUTE.ADDRESS_LIST}?type=1`);
  }
  /**
   * 单条添加收货地址
   */
  handleSubmit(item: address.IAddressItem) {
    this.addressList.push(item);
    this.isShowAddressAdd = false;
  }
  /**
   * 确认选择省市区
   * @param e
   */
  handleConfirm(e: { label: string }) {
    this.cityInfo = e.label;
  }

  /**
   * 添加或清空收货地址
   */
  async handleClickReceiveAddress() {
    if (this.addressList.length < 1) {
      this.isShowAddressAdd = true;
    } else {
      const [err, data]: any = await uniWrapper.showModalText(
        "确定要清空收货地址吗?",
        true
      );
      if (err || data.cancel) {
        return;
      }
      this.addressList = [];
    }
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
    max-height: px2rpx(100);
    overflow-y: auto;
    text-align: left;
    &-empty {
      color: $c-light;
      text-align: center;
      &::after {
        content: "请点击添加收货地址";
      }
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
