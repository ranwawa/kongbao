<template>
  <view class="goods-list">
    <view
      v-for="item in list"
      :key="item.goodsId"
      class="goods-card"
      @click="$emit('click-item', item)"
    >
      <image class="goods-card__img" mode="aspectFill" :src="item.imgList[0]" />
      <view class="goods-card__title">
        <uv-tag
          type="primary"
          custom-style="margin-right: 8rpx; font-size: 20rpx;"
          round
        >
          {{ item.storeName }}
        </uv-tag>
        {{ item.goodsName }}
      </view>
      <view class="goods-card__desc">
        <uv-price :amount="item.salePriceNormalStr" size="10" />
        <view class="goods-card__record">
          vip仅需 {{ item.salePriceVipStr }}元
        </view>
      </view>
      <view class="goods-card__desc goods-card__desc-center">
        <view class="goods-card__record">已售{{ item.sales }}件</view>
        <uv-button
          size="mini"
          custom-class="theme-style__button"
          @click.stop="$emit('click-btn', item)"
        >
          购买
        </uv-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UvTag from "uni-vant/lib/tag.vue";
import UvPrice from "uni-vant/lib/price.vue";

@Component({
  components: {
    UvTag,
    UvPrice,
  },
  props: {
    list: {
      type: Array,
      default: Array,
    },
  },
})
export default class LoginHome extends Vue {}
</script>

<style lang="scss" scoped>
.goods {
  &-list {
    @include flex-row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &-card {
    width: px2rpx(185);
    margin-bottom: $s-xxs;
    background-color: #fff;

    &:nth-child(2n) {
    }

    &__img {
      width: 100%;
      height: px2rpx(181);
    }

    &__title {
      @include text-truncate;
      margin: $s-xs $s-xxs $s-xxs;
    }

    &__desc {
      @include flex-row;
      align-items: flex-end;
      justify-content: flex-start;
      margin: $s-xxs $s-xxs $s-xs;

      &-center {
        justify-content: space-between;
        align-items: center;

        .goods-card__record {
          margin-left: 0;
          color: $c-muted;
        }
      }
    }

    &__record {
      margin-left: 1em;
      color: $c-gray;
      font-size: $fz-sm;
    }
  }
}

/deep/ {
  .uv-btn {
    margin: 0;
  }

  .uv-btn-text {
    margin-left: 0;
  }
}
</style>
