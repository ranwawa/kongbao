<template>
  <view class="rww-container">
    <!-- 订单信息 -->
    <order-list
      :order-list="[orderInfo]"
      @refresh-order="getOrderDetail(orderInfo.orderId)"
    />
    <!-- 服务信息 -->
    <view class="o-detail">
      <uv-cell :value="orderInfo.serviceInfo" title="售后信息" />
      <uv-cell :value="orderInfo.createTimeStr" title="下单时间" />
      <uv-cell
        v-if="orderInfo.payTime"
        :value="orderInfo.payTimeStr"
        :border="!!orderInfo.storeTime"
        title="付款时间"
      />
      <uv-cell
        v-if="orderInfo.storeTime"
        :value="orderInfo.storeTimeStr"
        :border="false"
        title="出库时间"
      />
    </view>
    <!-- 收货地址列表 -->
    <view class="od-address" @click="copyAddressInfo">
      <view class="od-address__title" @click.stop="copyAll">
        收货地址
        <uv-button
          v-if="orderInfo.status === 6"
          size="mini"
          type="primary"
          custom-style="margin: 0;"
        >
          批量复制
        </uv-button>
      </view>
      <view
        v-for="(item, index) in orderInfo.addressList"
        :key="index"
        class="od-address__item"
      >
        <view class="od-address__label" :data-index="index">
          {{ item.formattedAddress }}
          <template v-if="item.expressNo">
            (快递单号: {{ item.expressNo }})
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import OrderList from "@/components/order-list.vue";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { order } from "@/api/order";

@Component({
  components: {
    OrderList,
  },
})
export default class LoginHome extends Vue {
  orderInfo: order.IDetailRes = Object();
  serviceInfo: string = "";
  addressInfo: Array<string> = Array();

  onLoad(e: { orderId?: string }) {
    if (!e.orderId) {
      uniWrapper.showToastText("订单号有误");
      return;
    }
    this.getOrderDetail(e.orderId);
  }

  /**
   * 查询订单详情
   */
  async getOrderDetail(orderId: string) {
    const [err, data] = await order.getSingle({ orderId });
    if (err || !data?.orderId) {
      return;
    }
    console.log(data);
    this.orderInfo = data;
  }

  /**
   * 复制收货地址
   */
  copyAddressInfo(e: any) {
    const index = e?.target?.dataset?.index;
    if (this.orderInfo.status !== 6 || !index) {
      return;
    }
    const data: string = this.orderInfo.addressList[index].expressNo;
    this.copyInMp(data);
    this.copyInH5(data);
    uniWrapper.showToastText("复制成功");
  }

  /**
   * 复制所有地址
   */
  copyAll() {
    const data: string = this.orderInfo.addressList
      .map((ele) => `${ele.formattedAddress} ${ele.expressNo}`)
      .join("\r\n");
    this.copyInMp(data);
    this.copyInH5(data);
    uniWrapper.showToastText("复制成功");
  }

  async copyInMp(data: string) {
    // #ifdef MP
    const res = await uni.setClipboardData({ data });
    console.log(res);
    // #endif
  }

  copyInH5(data: string) {
    // #ifdef H5
    this.$copyText(data);
    // #endif
  }
}
</script>

<style lang="scss" scoped>
/deep/ .uv-cell {
  font-size: $fz-sm;
  line-height: 1.2em;

  &-title {
    min-width: 6em;
    flex-grow: 0;
  }

  &-value {
    flex-grow: 2;
  }
}

/* 收货地址列表 */
.od-address {
  margin: $s-sm 0;
  padding: $s-sm;
  background-color: #fff;

  &__title {
    @include flex-row;
    @include bd-hairline-bottom;
    justify-content: space-between;
    padding-bottom: $s-sm;
    margin-bottom: $s-sm;

    /deep/ .uv-btn-text {
      margin-right: px2rpx(4);
    }
  }

  &__item {
    color: $c-light;
    font-size: $fz-sm;
    padding: $s-xxs 0;
  }
}
</style>
