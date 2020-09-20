<template>
  <view class="rww-container">
    <!-- 地址列表 -->
    <view class="address-list">
      <view
        v-for="(item, index) in addressList"
        :key="item._id"
        class="address-item"
      >
        <view class="address-item__body" @click="chooseAddress(item)">
          <view class="address-item__title">
            {{ item.name }}, {{ item.mobile }}
          </view>
          <view class="address-item__address">
            {{ item.provinceName }} {{ item.cityName }} {{ item.areaName }}
            {{ item.address }}
          </view>
        </view>
        <view class="address-item__footer">
          <view
            :class="{ 'address-item__default-active': item.default }"
            class="address-item__default"
            @click.stop="setDefault(item, index)"
          >
            {{ item.default ? "默认地址" : "设置为默认" }}
          </view>
          <view class="address-item__btn" @click.stop="del(item._id, index)"
            >删除
          </view>
          <view class="address-item__btn" @click.stop="edit(item)">修改 </view>
        </view>
      </view>
    </view>
    <!-- 添加按钮 -->
    <view class="address-btn">
      <uv-button
        size="large"
        custom-class="theme-style__button"
        @click="handleAddClick"
      >
        添加售后信息
      </uv-button>
    </view>
    <!-- 添加地址弹框 -->
    <address-add
      v-show="isShowAddressAdd"
      :address-info="currentAddress"
      :city-info="cityInfo"
      title="添加售后信息"
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
import AddressAdd from "@/components/address-add.vue";
import SimpleAddress from "simple-address";
import { address } from "@/api/address";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { vm } from "@/assets/js/event-bus";

enum TYPE {
  NORMAL,
  CHOOSE,
}
@Component({
  components: {
    AddressAdd,
    SimpleAddress,
  },
})
export default class Address extends Vue {
  [x: string]: any;
  addressList: Array<address.IAddressItem> = Array(); // 地址列表
  currentAddress: address.IAddressItem = Object(); // 当前编辑的地址
  isShowAddressAdd: boolean = false; // 是否显示添加地址弹框
  addressModalType: string = "add"; // 新增 修改
  cityInfo = ""; // 选中的省市区信息
  openType: number = 0; // 页面打开方式 normal 0正常打开 choose 1从确认订单页面打开选择地址

  onLoad(e: { type: number }) {
    this.openType = +e.type === 1 ? TYPE.CHOOSE : TYPE.NORMAL;
    this.getList();
  }

  /**
   * 获取地址列表
   */
  async getList() {
    const [err, data] = await address.getAddressList();
    if (err || !data?.length) {
      return;
    }
    this.addressList = data;
  }
  /**
   * 触发相关事件
   */
  handleSubmit(item: address.IAddressItem) {
    this[this.addressModalType](item);
  }
  /**
   * 添加地址
   */
  async add(item: address.IAddressItem) {
    const [err, data] = await address.add(item);
    if (err || data?._id) {
      return;
    }
    await uniWrapper.showToastText("添加成功");
    this.isShowAddressAdd = false;
    await this.getList();
  }

  /**
   * 删除一条地址
   */
  async del(addressId: string, index: number) {
    const [er, data]: any = await uniWrapper.showModalText(
      "确定要删除吗?",
      true
    );
    if (er || data.cancel) {
      return;
    }
    const [err] = await address.del({ addressId });
    if (err) return;
    this.addressList.splice(index, 1);
  }

  /**
   * 编辑一条地址
   * @param item
   */
  async edit(item: address.IAddressItem) {
    this.addressModalType = "update";
    this.currentAddress = JSON.parse(JSON.stringify(item));
    this.isShowAddressAdd = true;
  }

  /**
   * 设置为默认地址
   */
  async setDefault(item: address.IAddressItem, index: number) {
    if (item.default) return;
    const addressId = item.addressId;
    const [err] = await address.setDefault({ addressId });
    if (err) return;
    const { addressList } = this;
    for (let key in addressList) {
      addressList[key].default = addressList[key].addressId === addressId;
    }
  }

  /**
   * 修改一条地址
   */
  async update(item: address.IAddressItem) {
    const [err, data] = await address.update(item);
    if (err || data?._id) {
      return;
    }
    await uniWrapper.showToastText("添加成功");
    this.isShowAddressAdd = false;
    await this.getList();
  }
  /**
   * 确认选择省市区
   * @param e
   */
  handleConfirm(e: { label: string }) {
    this.cityInfo = e.label;
  }
  handleAddClick() {
    this.currentAddress = Object();
    this.addressModalType = "add";
    this.isShowAddressAdd = true;
  }

  /**
   * 选择地址
   */
  chooseAddress(item: address.IAddressItem) {
    if (this.openType === TYPE.CHOOSE) {
      vm.$emit("update-service", item);
      uni.navigateBack({ delta: 1 });
    }
  }
}
</script>

<style lang="scss" scoped>
/* 地址列表 */
.address {
  &-list {
  }

  &-item {
    padding: $s-sm $s-sm 0;
    margin: $s-sm 0;
    background-color: #fff;

    &__body {
      @include bd-hairline-bottom;
      padding-bottom: $s-sm;
    }

    &__title {
      font-size: $fz-lg;
    }

    &__address {
      padding-top: $s-xxs;
      color: $c-light;
      font-size: $fz-sm;
    }

    &__footer {
      color: $c-light;
      font-size: $fz-sm;

      > view {
        display: inline-flex;
        padding: $s-sm 0;
      }
    }

    &__default {
      @include flex-row;
      align-items: center;

      &::before {
        @include flex-row;
        justify-content: center;
        content: "";
        width: 1.2em;
        height: 1.2em;
        border: 1px solid $c-light;
        border-radius: $bdrs-round;
        margin-right: $s-xxs;
      }

      &-active {
        color: $c-theme;

        &::before {
          content: "\F0C8";
          border-color: $c-theme;
          background-color: $c-theme;
          color: #fff;
          font: normal normal normal 14px/1 "vant-icon";
        }
      }
    }

    &__btn {
      float: right;
      margin-left: $s-sm;
    }
  }
}

/* 添加按钮 */
.address-btn {
  @include fixed-bottom;
  padding: $s-sm $s-sm px2rpx(22);
  background-color: #fff;
}
</style>
