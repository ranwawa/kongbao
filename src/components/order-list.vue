<template>
  <view class="order-list">
    <view v-for="item in orderList" :key="item.orderId" class="order-item">
      <!-- 订单信息 -->
      <view class="order-item__head">
        <view> 创建时间: {{ item.createTime }} </view>
        <view> 实付: {{ item.amount }} </view>
      </view>
      <!-- 商品信息 -->
      <view class="order-item__body">
        <goods-cell
          :goods-info="item.goodsInfo"
          :goods-num="item.num"
          @click-goods="handleClickGoods(item)"
        />
      </view>
      <!-- 操作按钮 -->
      <view class="order-item__foot">
        <uv-button size="mini" round>联系客服 </uv-button>
        <uv-button
          v-if="isShowDetailBtn"
          size="mini"
          round
          @click="goOrderDetail(item)"
        >
          查看详情
        </uv-button>
        <uv-button
          v-if="item.status === 1"
          size="mini"
          custom-class="theme-style__button"
          @click="goPay(item.orderId)"
        >
          立即支付
        </uv-button>
        <uv-button v-if="item.status === 3" size="mini" type="primary" round>
          下载订单
        </uv-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { ROUTE } from "@/assets/constant/common";
import GoodsCell from "@/components/goods-cell.vue";
import { order } from "@/api/order";

@Component({
  components: {
    GoodsCell,
  },
  props: {
    orderList: {
      type: Array,
      default: Array,
    },
    isShowDetailBtn: {
      type: Boolean,
      default: false,
    },
  },
})
export default class OrderList extends Vue {
  /**
   * 前往支付页面
   */
  goPay(orderId: string) {
    uniWrapper.navigateToPage(`${ROUTE.ORDER_PAY}?orderId=${orderId}`);
  }

  /**
   * 点击商品
   */
  handleClickGoods(item: order.IDetailRes) {
    this.$emit("click-order", item);
  }
  /**
   * 前往订单详情
   */
  goOrderDetail(item: order.IDetailRes) {
    uniWrapper.navigateToPage(`${ROUTE.ORDER_DETAIL}?orderId=${item.orderId}`);
  }
}
</script>

<style lang="scss" scoped>
.order {
  /* 订单列表 */
  &-item {
    margin: $s-sm 0;
    background-color: #fff;

    &__head,
    &__foot {
      @include flex-row;
      padding: $s-xs;
    }

    &__head {
      justify-content: space-between;
    }

    &__body {
      padding: $s-sm $s-xs;
      background-color: $bgc-base;
    }

    &__foot {
      @include bd-hairline-top;
      justify-content: flex-end;

      /deep/ .uv-btn {
        margin: 0;

        & + .uv-btn {
          margin-left: $s-sm;
        }

        .uv-btn-text {
          margin-right: px2rpx(4);
        }
      }
    }
  }
}
</style>
