<template>
  <view class="rww-container">
    <!-- 头部区域 -->
    <view class="home-head">
      <image
        class="home-head__avatar"
        mode="aspectFill"
        src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2141623099,2896788564&fm=26&gp=0.jpg"
      />
      <view class="home-head__body">
        <view class="home-head__nickname">
          昵称
          <view
            class="home-head__level"
            :class="{ 'home-head__level-vip': !userInfo.isVip }"
          >
            <uv-icon
              name="gem"
              custom-style="transform: translateY(1px); margin: 0 1px 0 8px;"
            />
            普通会员
          </view>
        </view>
        <view class="home-head__balance">
          帐户余额: {{ userInfo.balance }}元
        </view>
      </view>
    </view>
    <!-- 订单区域 -->
    <view class="home-order">
      <view class="home-order__title"> 我的订单 </view>
      <view class="home-order__body">
        <view
          v-for="item in tabList"
          class="tab__item"
          @click="goOrderList(item.status)"
        >
          <uv-icon :name="item.icon" :color="item.color" size="32" />
          {{ item.title }}
        </view>
      </view>
    </view>
    <!-- 快捷功能 -->
    <view class="home-quick">
      <view class="home-order__title"> 快捷功能 </view>
      <view class="home-quick__body">
        <view class="tab__item" @click="goPage('/pages/address/list')">
          <uv-icon name="smile-o" size="32" />
          售后信息
        </view>
        <view class="tab__item" @click="goPage('/pages/address/list')">
          <uv-icon name="balance-list-o" size="32" />
          资金明细
        </view>
        <view class="tab__item" @click="goPage('/pages/address/list')">
          <uv-icon name="service-o" size="32" />
          联系客服
        </view>
        <view class="tab__item" @click="goPage('/pages/address/list')">
          <uv-icon name="setting-o" size="32" />
          设置
        </view>
        <view class="tab__item">
          <uv-icon name="upgrade" size="32" />
          退出登录
        </view>
      </view>
    </view>
    <!-- 推荐商品 -->
    <view class="home-recommend">
      <view class="home-recommend__title"> 热销推荐 </view>
      <view class="home-recommend__body">
        <goods-card
          :list="goodsList"
          @click-item="goPage('/pages/goods/detail?goodsId=' + $event.goodsId)"
          @click-btn="goPage('/pages/order/index?goodsId=' + $event.goodsId)"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import GoodsCard from "@/components/goods-card.vue";
import { user } from "@/api/user";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { ROUTE } from "@/assets/constant/common";
import { goods } from "@/api/goods";

@Component({
  components: {
    GoodsCard,
  },
})
export default class LoginHome extends Vue {
  goodsList: Array<goods.IGoodsItem> = Array();
  userInfo: user.IUserInfoRes = Object(); // 用户信息
  tabList = [
    {
      icon: "ecard-pay",
      color: "#ff9800",
      title: "全部",
      status: -1,
    },
    {
      icon: "balance-pay",
      color: "#66005c",
      title: "待支付",
      status: 1,
    },
    {
      icon: "credit-pay",
      color: "#004b44",
      title: "待出库",
      status: -1,
    },
    {
      icon: "debit-pay",
      color: "#7f2b11",
      title: "已完成",
      status: -1,
    },
  ];

  onLoad() {
    this.getUserInfo();
    this.getGoodsRecommend();
  }

  /**
   * 查询用户信息
   */
  async getUserInfo() {
    const [err, data] = await user.getUserInfo();
    if (err || !data) {
      return;
    }
    this.userInfo = data;
  }

  /**
   * 订单页面
   */
  goOrderList(status: number) {
    uniWrapper.switchTabPage(`${ROUTE.ORDER_LIST}?status=${status}`);
  }

  /**
   * 查询推荐商品
   */
  async getGoodsRecommend() {
    const [err, data] = await goods.getGoodsRecommend();
    console.log(123, err, data);
    if (err || !data?.length) {
      return;
    }
    this.goodsList = data;
  }

  /**
   * 前往商品详情
   */
  goPage(url: string) {
    uniWrapper.navigateToPage(url);
  }
}
</script>

<style lang="scss" scoped>
/* 头部区域 */
.home-head {
  @include flex-row;
  padding: $s-sm;
  background-color: #fff;

  &__avatar {
    width: px2rpx(60);
    height: px2rpx(60);
    border-radius: $bdrs-round;
    margin-right: $s-xs;
    background-color: $bgc-base;
  }

  &__nickname {
    @include flex-row;
  }

  &__level {
    @include flex-row;
    font-size: $fz-sm;
    color: $c-light;

    &-vip {
      color: #ff9800;
    }
  }

  &__balance {
    margin-top: $s-xxs;
    color: $c-theme;
    font-size: $fz-sm;
  }
}

/* 订单区域 */
.home-order {
  margin: $s-sm 0;
  background-color: #fff;

  &__title {
    @include bd-hairline-bottom;
    padding: $s-sm;
    font-size: $fz-lg;
  }

  &__body {
    @include flex-row;
    padding: $s-sm;
  }
}

.tab__item {
  @include flex-column;
  white-space: nowrap;
  font-size: $fz-sm;
  min-width: 4em;

  & + & {
    margin-left: $s-lg;
  }
}

/* 快捷功能区域 */
.home-quick {
  background-color: #fff;
}
.home-quick__body {
  @include flex-row;
  padding: $s-sm;
  background-color: #fff;
  font-size: $fz-sm;
}

/* 推荐商品 */
.home-recommend {
  margin: $s-sm 0;
}
.home-recommend__title {
  padding: $s-sm;
  background-color: #fff;
  font-size: $fz-lg;
}
</style>
