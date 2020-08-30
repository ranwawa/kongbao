<template>
  <view class="rww-container">
    <!-- 头部图片价格标题 -->
    <div class="goods-header">
      <image
        class="goods-header__img"
        mode="aspectFill"
        src="https://images.jixugou.cn/c60d70ca-a0d6-4d86-8c24-435022508d34.jpg"
      />
      <view class="goods-header__row">
        <uv-price price="22"></uv-price>
        <view class="goods-header__origin">市场价: 333</view>
        <view class="goods-header__record">已售20000件</view>
      </view>
      <view class="goods-header__title">
        <uv-tag type="danger" custom-style="margin-right: 8rpx;" round
          >顺丰
        </uv-tag>
        标题标题 标题标题 标题标题 标题标题
      </view>
    </div>
    <!-- 商品参数 -->
    <uv-cell-group>
      <uv-cell
        icon="phone"
        title="发货仓库"
        label="北京"
        value="大唐市在要要要要要要 要要森要要要要要要"
      ></uv-cell>
      <uv-cell
        :border="false"
        icon="phone"
        title="承运快递"
        value="圆通"
      ></uv-cell>
    </uv-cell-group>
    <!-- 商品详情 -->
    <view class="goods-content">
      <view class="goods-content__title">商品详情</view>
    </view>
    <!-- 底部按钮 -->
    <view class="goods-fixed">
      <view class="goods-fixed__service">
        <uv-icon name="phone" />
        联系客服
      </view>
      <view class="goods-fixed__service">
        <uv-icon name="phone" />
        分享好友
      </view>
      <uv-button>立即购买</uv-button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UvTag from "uni-vant/lib/tag.vue";
import UvIcon from "uni-vant/lib/icon.vue";
import UvCell from "uni-vant/lib/cell.vue";
import UvPrice from "uni-vant/lib/price.vue";
import UvCellGroup from "uni-vant/lib/cell-group.vue";

@Component({
  components: {
    UvTag,
    UvIcon,
    UvCell,
    UvPrice,
    UvCellGroup,
  },
})
export default class LoginHome extends Vue {}
</script>

<style lang="scss" scoped>
/* 头部图片价格标题 */
.goods-header {
  background-color: #fff;
  &__img {
    width: 100%;
    height: px2rpx(365);
  }
  &__row {
    @include flex-row;
    align-items: flex-end;
    padding: 0 $s-sm;
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
  padding: $s-sm 0 $s-xs;
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
