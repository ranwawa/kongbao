<template>
  <view
    v-show="goodsInfo.goodsId"
    class="goods-cell"
    @click="$emit('click-goods', goodsInfo)"
  >
    <image :src="computedImgSrc" class="goods-cell__img" mode="aspectFill" />
    <view class="goods-cell__content">
      <view class="goods-cell__name">
        <uv-tag type="danger" round>
          {{ goodsInfo.storeName }}
        </uv-tag>
        {{ goodsInfo.goodsName }}
      </view>
      <view class="goods-cell__bottom">
        <uv-price :amount="goodsInfo.dealPriceStr" size="10" />
        数量: x{{ goodsNum }}
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
    goodsInfo: {
      type: Object,
      default: Object,
    },
    goodsNum: {
      type: Number,
      default: 1,
    },
  },
})
export default class LoginHome extends Vue {
  [x: string]: any;

  get computedImgSrc() {
    return this.goodsInfo.imgList ? this.goodsInfo.imgList[0] : "";
  }
}
</script>

<style lang="scss" scoped>
.goods-cell {
  @include flex-row;
  align-items: stretch;
  height: px2rpx(90);

  &__img {
    min-width: px2rpx(90);
    width: px2rpx(90);
    height: inherit;
    margin-right: $s-xs;
  }

  &__content {
    @include flex-column;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: space-between;
    height: inherit;
  }

  &__title {
    @include text-truncate(2);
  }

  &__bottom {
    @include flex-row;
    justify-content: space-between;
    width: 100%;
    color: $c-light;
    font-size: $fz-sm;
  }
}
</style>
