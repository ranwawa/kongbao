<template>
  <view class="goods-list">
    <view
      v-for="item in list"
      :key="item._id"
      class="goods-card"
      @click.capture="$emit('click-item', item)"
    >
      <image class="goods-card__img" mode="aspectFill" :src="item.imgList" />
      <view class="goods-card__title">
        <uv-tag
          type="primary"
          custom-style="margin-right: 8rpx; font-size: 20rpx;"
          round
        >
          {{ item.expressName }}
        </uv-tag>
        {{ item.goodsName }}
      </view>
      <view class="goods-card__desc" @click.stop="$emit('click-btn', item)">
        <uv-price price="22" size="10"></uv-price>
        <view class="goods-card__record">已售{{ item.sales }}件</view>
        <uv-button size="mini" custom-class="theme-style__button"
          >购买
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
    width: px2rpx(181);
    margin-bottom: $s-sm;
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
      justify-content: space-between;
      margin: $s-xxs $s-xxs $s-xs;
    }

    &__record {
      flex-grow: 1;
      margin-left: $s-xs;
      color: $c-muted;
      font-size: $fz-sm;
    }
  }
}
</style>
