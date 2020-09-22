<!--
 * @file 主播套餐落地页
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/6/14 15:43
-->
<template>
  <view class="jxg-container">
    <!-- 主体内容 -->
    <div class="jxg-container__wrapper">
      <!-- 金额 -->
      <view class="vip-section vip-cash">
        <view class="vip-section__title">
          <view class="vip-section__flag"></view>
          <view class="vip-section__text"> 直播创业礼包套餐推荐</view>
          <view class="vip-section__flag vip-section__flag_reverse"></view>
        </view>
        <view
          v-for="item in vipList"
          :key="item.id"
          class="vip-cash__item"
          :class="{
            'vip-cash__item_tag': item.tag,
            'vip-cash__item_active': item.vipId === currentVip.vipId,
          }"
          :data-tag="item.tag"
          @click="currentVip = item"
        >
          <view class="vip-cash__content">
            <view class="vip-cash__price" :data-price="item.priceStr">
              {{ item.activityPriceStr }}
            </view>
            <view class="vip-cash__title">
              {{ item.title }}
            </view>
            <view class="vip-cash__describe">
              {{ item.describe }}
            </view>
          </view>
          <view class="vip-cash__btn" @click.stop="submit(item)">
            立即开通
          </view>
        </view>
      </view>
      <!-- 权益介绍 -->
      <view class="vip-section">
        <view class="vip-section__title">
          <view class="vip-section__flag"></view>
          <view class="vip-section__text"> VIP专属权益</view>
          <view class="vip-section__flag"></view>
        </view>
        <view class="vip-equity">
          <view
            v-for="(item, index) in descList"
            :key="item.title"
            class="vip-equity__item"
            @click="test(index)"
          >
            <view class="vip-equity__title">
              {{ item.title }}
            </view>
            <view class="vip-equity__desc">
              {{ item.content }}
            </view>
          </view>
        </view>
      </view>
    </div>
    <!-- 底部按钮 -->
    <view class="vip-footer">
      <!-- 分享按钮 -->
      <uv-button custom-style="border-color: #ccc;" round @click="test">
        邀请好友开通
      </uv-button>
      <!-- 开通按钮 -->
      <uv-button custom-class="theme-style__button" round @click="test">
        我要开通
      </uv-button>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vipApi } from "@/api/vip";

@Component({
  components: {},
})
export default class vip extends Vue {
  descList = [
    {
      title: "VIP专享价",
      content: "所有商品，都会在普通会员的价格上享受更多优惠",
    },
    {
      title: "VIP推荐奖励",
      content:
        "VIP邀请好友注册，好友的所有消费均奖励现金券，奖励系数高于普通会员",
    },
    {
      title: "VIP充值奖励",
      content: "根据比例，以现金券的形式返还部分充值金额，普通会员无此奖励",
    },
    {
      title: "VIP专属客服",
      content: `专属电话客服，24小时随时解决疑问，普通会员通过在线客服咨询`,
    },
    {
      title: "更多权益，即将开放",
      content: `我们会针对VIP开发更多专属权益，欢迎您的加入`,
    },
  ];
  vipList: Array<vip.IItem> = [];
  currentVip: vip.IItem = Object();

  onLoad() {
    this.getList();
  }

  async getList() {
    const [err, data] = await vipApi.getList();
    if (err || !data?.length) {
      return;
    }
    this.vipList = data;
    this.currentVip = data[0];
  }

  submit(e: vip.IItem) {
    console.log(e);
  }
}
</script>

<style lang="scss" scoped>
$section-bg-color: #fffcf0;
$linear-light: $c-theme-light;
$linear-dark: $c-theme;
.jxg-container {
  min-height: 100vh;

  &__wrapper {
    padding: $s-sm $s-sm px2rpx(83);
    background: url("https://images.jixugou.cn/c5df1218-7811-4549-b26a-1902f0a90eb3.png")
      top left / 100% auto no-repeat #b12621;
  }
}

/* 视图块 */
.vip-section {
  padding: $s-lg px2rpx(10);
  border-radius: $bdrs-lg;
  margin-bottom: $s-lg;
  background: $section-bg-color;

  &__title {
    @include flex-row;
    justify-content: center;
    color: $c-theme;
    font-size: $fz-xl;
    font-weight: 600;
    text-align: center;
  }

  &__text {
    margin: 0 $s-md 0 $s-xl;
  }

  &__flag,
  &__flag::after {
    width: $s-xxs;
    height: px2rpx(18);
    border-radius: $bdrs-sm;
    background: linear-gradient(to bottom, $c-theme-light, #fffcf0 80%);
  }

  &__flag {
    position: relative;
    font-size: 0;
    transform: rotate(35deg) translateY($s-xxs);
  }

  &__flag::after {
    content: "";
    display: inline-block;
    margin-left: $s-xs;
    transform: translateY(-10rpx);
  }

  &__flag:last-child {
    transform: rotate(35deg) translateY(px2rpx(-2));
  }

  &__flag:last-child,
  &__flag:last-child::after {
    background: linear-gradient(to top, $c-theme-light, #fffcf0 80%);
  }
}

/* 金额 */
.vip-cash {
  &__item {
    @include flex-row;
    align-items: stretch;
    position: relative;
    margin-top: $s-lg;
    border-radius: $bdrs-sm;
    overflow: hidden;

    &_tag {
      &::before {
        display: block !important;
      }
    }

    &_active {
      &::before {
        content: attr(data-tag);
        position: absolute;
        top: 0;
        left: px2rpx(3);
        display: none;
        padding: 0 $s-sm 0 $s-xs;
        border-radius: 0 0 1em 0;
        background: $linear-light;
        color: $linear-dark;
        font-weight: bold;
      }
    }

    &_disable {
      &::before {
        content: attr(data-tag);
        position: absolute;
        top: 0;
        left: px2rpx(3);
        display: none;
        padding: 0 $s-sm 0 $s-xs;
        border-radius: 0 0 1em 0;
        background: #ebebeb;
        color: #b7b7b7;
        font-weight: bold;
      }
    }

    &_active .vip-cash__content {
      background: linear-gradient(to right, $linear-light, $linear-light) top
          left / calc(100% - 13px) 3px no-repeat,
        linear-gradient(to bottom, $linear-light, $linear-dark) top left / 3px
          100% no-repeat,
        linear-gradient(to right, $linear-dark, $linear-dark) bottom left /
          calc(100% - 13px) 3px no-repeat,
        radial-gradient(
            20px at top right,
            $section-bg-color,
            $section-bg-color 10px,
            $linear-light 10px,
            $linear-light 13px,
            transparent 13px
          )
          top right/ 20px 20px no-repeat,
        radial-gradient(
            20px at bottom right,
            $section-bg-color,
            $section-bg-color 10px,
            $linear-dark 10px,
            $linear-dark 13px,
            transparent 13px
          )
          bottom right/ 20px 20px no-repeat,
        #fff;
    }

    &_disable .vip-cash__content {
      background: linear-gradient(to right, #fff, #fff) top left /
          calc(100% - 13px) 3px no-repeat,
        linear-gradient(to bottom, #fff, #e7e7e7) top left / 3px 100% no-repeat,
        linear-gradient(to right, #e7e7e7, #e7e7e7) bottom left /
          calc(100% - 13px) 3px no-repeat,
        radial-gradient(
            20px at top right,
            $section-bg-color,
            $section-bg-color 10px,
            #fff 10px,
            #fff 13px,
            transparent 13px
          )
          top right/ 20px 20px no-repeat,
        radial-gradient(
            20px at bottom right,
            $section-bg-color,
            $section-bg-color 10px,
            #e7e7e7 10px,
            #e7e7e7 13px,
            transparent 13px
          )
          bottom right/ 20px 20px no-repeat,
        #fff;
    }

    &_active .vip-cash__btn {
    }
  }

  &__content {
    display: grid;
    grid-template-areas: "price title" "price describe";
    align-items: center;
    flex-grow: 1;
    padding: 0 px2rpx(10);
    background-color: #fff;
  }

  &__btn {
    @include flex-column;
    justify-content: center;
    flex: 0 0 px2rpx(88);
    height: px2rpx(98);
    background: radial-gradient(
          px2rpx(20) at top left,
          $section-bg-color,
          $section-bg-color px2rpx(10),
          transparent px2rpx(10)
        )
        top left/ px2rpx(20) px2rpx(20) no-repeat,
      radial-gradient(
          px2rpx(20) at bottom left,
          $section-bg-color,
          $section-bg-color px2rpx(10),
          transparent px2rpx(10)
        )
        bottom left/ px2rpx(20) px2rpx(20) no-repeat,
      linear-gradient(to bottom, $c-theme-light, $c-theme);
    color: #fff;
    font-size: $fz-xl;
  }

  &__btn--disable {
    background: radial-gradient(
          px2rpx(20) at top left,
          $section-bg-color,
          $section-bg-color px2rpx(10),
          transparent px2rpx(10)
        )
        top left/ px2rpx(20) px2rpx(20) no-repeat,
      radial-gradient(
          px2rpx(20) at bottom left,
          $section-bg-color,
          $section-bg-color px2rpx(10),
          transparent px2rpx(10)
        )
        bottom left/ px2rpx(20) px2rpx(20) no-repeat,
      linear-gradient(to bottom, #fff, #c3c3c3);
  }

  &__price {
    grid-area: price;
    text-align: center;
    font-size: px2rpx(32);
    font-weight: bold;
    background: linear-gradient(135deg, $c-theme-light, $c-theme);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    &::before {
      content: "¥";
      font-size: $fz-md;
    }
    &::after {
      content: "/" attr(data-price);
      font-size: $fz-md;
      font-weight: normal;
      text-decoration: line-through;
      white-space: nowrap;
      -webkit-text-fill-color: #999;
    }
  }

  &__text--disable {
    color: #999;
    background: transparent;
    -webkit-text-fill-color: #999;
  }

  &__describe {
    align-self: flex-start;
  }

  &__title {
    @include text-truncate;
    align-self: flex-end;
    font-size: $fz-lg;
    font-weight: bold;
  }

  &__sub {
    @include text-truncate(2);
    margin-top: $s-xxs;
    color: $c-light;
    font-size: $fz-sm;
  }
}

/* 权益介绍 */
.vip-equity {
  position: relative;
  margin-top: px2rpx(36);
  text-align: right;
  counter-reset: item;

  &::before {
    position: absolute;
    top: px2rpx(32);
    bottom: px2rpx(32);
    right: px2rpx(278);
    content: "";
    width: px2rpx(4);
    border-radius: px2rpx(2);
    background: linear-gradient(to bottom, $c-theme, $c-theme-light);
  }

  &__item {
    position: relative;
    display: inline-block;
    width: px2rpx(243);
    padding: 0 px2rpx(10);
    margin-bottom: $s-sm;
    border-radius: $bdrs-sm;
    color: #fff;
    text-align: center;

    &::before {
      @include text-truncate();
      content: "权益" counter(item) "";
      counter-increment: item;
      position: absolute;
      top: 0;
      bottom: 0;
      right: px2rpx(288);
      height: $s-md;
      margin: auto;
      color: $c-theme;
      font-weight: 500;
      font-size: $fz-xl;
      line-height: $s-md;
      text-align: right;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: px2rpx(272);
      width: $s-md;
      height: $s-md;
      border-radius: $bdrs-round;
      margin: auto;
      box-shadow: $bxsh-base;
      background-color: #fff;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:nth-child(1) {
      background: radial-gradient(
          60px at 90% 20%,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 60px,
          transparent 60px
        ),
        radial-gradient(
          70px at 70% 60%,
          rgba(0, 0, 0, 0.03),
          rgba(0, 0, 0, 0.03) 70px,
          transparent 70px
        ),
        linear-gradient(to right, #e62564, #f7695a);
    }

    &:nth-child(2),
    &:nth-child(6) {
      background: radial-gradient(
          60px at 90% 20%,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 60px,
          transparent 60px
        ),
        radial-gradient(
          70px at 70% 60%,
          rgba(0, 0, 0, 0.03),
          rgba(0, 0, 0, 0.03) 70px,
          transparent 70px
        ),
        linear-gradient(to right, #f99a13, #f99913, #fecb2d);
    }

    &:nth-child(3),
    &:nth-child(7) {
      background: radial-gradient(
          60px at 90% 20%,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 60px,
          transparent 60px
        ),
        radial-gradient(
          70px at 70% 60%,
          rgba(0, 0, 0, 0.03),
          rgba(0, 0, 0, 0.03) 70px,
          transparent 70px
        ),
        linear-gradient(to right, #9243f5, #be6efc);
    }

    &:nth-child(4) {
      background: radial-gradient(
          60px at 90% 20%,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 60px,
          transparent 60px
        ),
        radial-gradient(
          70px at 70% 60%,
          rgba(0, 0, 0, 0.03),
          rgba(0, 0, 0, 0.03) 70px,
          transparent 70px
        ),
        linear-gradient(to right, #0b76f8, #1bc1fe);
    }

    &:nth-child(5) {
      background: radial-gradient(
          60px at 90% 20%,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 60px,
          transparent 60px
        ),
        radial-gradient(
          70px at 70% 60%,
          rgba(0, 0, 0, 0.03),
          rgba(0, 0, 0, 0.03) 70px,
          transparent 70px
        ),
        linear-gradient(to right, #02b7e4, #13e8ab);
    }
  }

  &__title {
    @include bd-hairline-bottom(#fff);
    padding: $s-xs 0;
    font-size: $fz-lg;
    font-weight: 500;
    line-height: px2rpx(22);
  }

  &__desc {
    padding: $s-md 0;
    line-height: px2rpx(20);
  }
}

/* 底部按钮 */
.vip-footer {
  @include fixed-bottom(0);
  @include flex-row;
  justify-content: space-between;
  padding: px2rpx(10);
  background-color: #fff;

  /deep/ .uv-btn-text {
    white-space: nowrap;
  }

  .uv-btn {
    width: auto;
  }

  .uv-btn:not(:last-child) {
    margin-right: $s-lg;
  }
}
</style>
