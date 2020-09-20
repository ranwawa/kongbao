<template>
  <view class="rww-container">
    <!-- 头部区域 -->
    <view class="home-head" @click="goAuthPage('/pages/user/setting')">
      <image
        class="home-head__avatar"
        mode="aspectFill"
        src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2141623099,2896788564&fm=26&gp=0.jpg"
      />
      <view class="home-head__body">
        <template v-if="userInfo.nickname">
          <view class="home-head__nickname">
            {{ userInfo.nickname }}
            <view
              class="home-head__level"
              :class="{ 'home-head__level-vip': userInfo.isVip }"
              @click.stop="goAuthPage('/pages/fund/vip')"
            >
              <uv-icon
                name="gem"
                custom-style="transform: translateY(1px); margin: 0 1px 0 8px;"
              />
              {{ userInfo.isVip ? "vip会员" : "普通会员" }}
            </view>
          </view>
          <view
            class="home-head__balance"
            @click.stop="goAuthPage('/pages/fund/balance')"
          >
            帐户余额: {{ userInfo.balanceStr }}元
          </view>
        </template>
        <uv-button
          v-else
          size="small"
          custom-style="border-color: #ccc;"
          round
          @click="goPage('/pages/user/login-home')"
          >登录/注册
        </uv-button>
      </view>
    </view>
    <!-- 订单区域 -->
    <view class="home-order">
      <view class="home-order__title"> 我的订单</view>
      <view class="home-order__body">
        <view
          v-for="item in tabList"
          class="tab__item"
          @click="goAuthPage('/pages/order/list?status=' + item.status)"
        >
          <uv-icon :name="item.icon" :color="item.color" size="32" />
          {{ item.title }}
        </view>
      </view>
    </view>
    <!-- 快捷功能 -->
    <view class="home-quick">
      <view class="home-order__title"> 快捷功能</view>
      <view class="home-quick__body">
        <view class="tab__item" @click="goAuthPage('/pages/address/list')">
          <uv-icon name="smile-o" size="32" />
          售后信息
        </view>
        <view class="tab__item" @click="goAuthPage('/pages/fund/list')">
          <uv-icon name="balance-list-o" size="32" />
          资金明细
        </view>
        <view class="tab__item" @click="goAuthPage('/pages/address/list')">
          <uv-icon name="service-o" size="32" />
          联系客服
        </view>
        <view class="tab__item" @click="goAuthPage('/pages/user/setting')">
          <uv-icon name="setting-o" size="32" />
          设置
        </view>
        <view v-if="userInfo.nickname" class="tab__item">
          <uv-icon name="upgrade" size="32" @click="logout" />
          退出登录
        </view>
      </view>
    </view>
    <!-- 推荐商品 -->
    <view class="home-recommend">
      <view class="home-recommend__title"> 热销推荐</view>
      <view class="home-recommend__body">
        <goods-card
          :list="goodsList"
          @click-item="goPage('/pages/goods/detail?goodsId=' + $event.goodsId)"
          @click-btn="
            goAuthPage('/pages/order/index?goodsId=' + $event.goodsId)
          "
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
import { ROUTE, STORAGE_KEY } from "@/assets/constant/common";
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
      status: 2,
    },
    {
      icon: "debit-pay",
      color: "#7f2b11",
      title: "待揽件",
      status: 3,
    },
  ];

  onLoad() {
    this.getGoodsRecommend();
  }

  onShow() {
    console.log(uni.getStorageSync("uni_id_token"));
    if (uni.getStorageSync("uni_id_token")) {
      this.getUserInfo();
    }
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
    uniWrapper.navigateToPage(`${ROUTE.ORDER_LIST}?status=${status}`);
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
  goAuthPage(url: string) {
    if (this.userInfo.nickname) {
      uniWrapper.navigateToPage(url);
    } else {
      uniWrapper.navigateToPage(ROUTE.USER_LOGIN_HOME);
    }
  }
  goPage(url: string) {
    uniWrapper.navigateToPage(url);
  }
  /**
   * 退出登录
   */
  async logout() {
    const [err] = await user.logout();
    if (err) {
      return;
    }
    uni.setStorageSync(STORAGE_KEY.UNI_ID_TOKEN, "");
    this.userInfo = Object();
    uniWrapper.switchTabPage(ROUTE.TAB_CATEGORY);
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

  &__title {
    padding: $s-sm;
    background-color: #fff;
    font-size: $fz-lg;
  }
}
</style>
