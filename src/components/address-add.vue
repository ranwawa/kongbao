<template>
  <view class="address-add">
    <!-- 遮罩 -->
    <view class="address-add__mask" @click="$emit('close')"></view>
    <view class="address-add__wrapper">
      <!-- 标题  -->
      <view class="address-add__head">
        <text class="address-add__title"> 添加收货地址 </text>
        <uv-icon
          name="close"
          size="18"
          custom-style="float: right;padding: 8rpx 24rpx 0 0;"
          @click="$emit('close')"
        ></uv-icon>
      </view>
      <!-- 主体 -->
      <view class="address-add__body">
        <uv-field
          v-model="formData.name"
          :maxlength="16"
          label="姓名"
          placeholder="请输入姓名"
          size="large"
          input-align="right"
          clearable
        />
        <uv-field
          v-model="formData.mobile"
          :maxlength="11"
          label="电话"
          placeholder="请输入手机号码"
          type="number"
          size="large"
          input-align="right"
          clearable
        />
        <uv-cell
          title="地区"
          :value="cityInfo"
          size="large"
          input-align="right"
          is-link
          @click="$emit('click-city')"
        />
        <uv-field
          v-model="formData.address"
          label="详细地址"
          placeholder="如街道，门牌号，小区，乡镇，村等"
          size="large"
          input-align="right"
          clearable
        />
      </view>
      <!-- 底部按钮 -->
      <view class="address-add__foot">
        <uv-button
          custom-class="theme-style__button"
          size="large"
          @click="submit"
          >保存
        </uv-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { cellPhoneReg, userNameReg } from "@/assets/js/regular";

@Component({
  props: {
    cityInfo: {
      type: String,
      default: "请点击选择省市区",
    },
    addressInfo: {
      type: Object,
      default: Object,
    },
  },
  watch: {
    addressInfo(newValue) {
      const { provinceName, cityName, areaName } = newValue;
      // @ts-ignore
      this.formData = newValue;
      if (!provinceName) {
        // @ts-ignore
        this.cityInfo = `请点击选择省市区`;
        return;
      }
      // @ts-ignore
      this.cityInfo = `${provinceName}-${cityName}-${areaName}`;
    },
  },
})
export default class LoginHome extends Vue {
  [x: string]: any;
  formData: address.IAddressItem = Object();

  submit() {
    const { _id, name, mobile, address } = this.formData;
    if (!name || !userNameReg.test(name)) {
      uniWrapper.showToastText("请填写正确的姓名");
      return;
    }
    if (!mobile || !cellPhoneReg.test(mobile)) {
      uniWrapper.showToastText("请填写正确的手机号码");
      return;
    }
    console.log(this.cityInfo.split("-"));
    const [provinceName, cityName, areaName] = this.cityInfo.split("-");
    if (!provinceName || !cityName || !areaName) {
      uniWrapper.showToastText("请选择地区");
      return;
    }
    if (!address) {
      uniWrapper.showToastText("请填写详细地址");
      return;
    }
    this.$emit("submit", {
      addressId: _id,
      name,
      mobile,
      address,
      provinceName,
      cityName,
      areaName,
      formattedAddress: `${name},${mobile} ${provinceName}${cityName}${areaName}${address}`,
      isDefault: false,
    });
  }
}
</script>

<style lang="scss" scoped>
.address-add {
  /* 遮罩 */
  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $z-modal;
    width: 100%;
    height: 100%;
    background-color: $black-4;
  }

  &__wrapper {
    position: fixed;
    top: 50%;
    left: $s-sm;
    right: $s-sm;
    z-index: $z-modal;
    background-color: #fff;
    transform: translateY(-50%);
  }

  /* 标题 */
  &__head {
    @include bd-hairline-bottom;
    padding: $s-sm 0;
    font-size: $s-lg;
    text-align: center;
  }

  &__body {
    padding-right: $s-sm;
  }

  &__foot {
    text-align: center;
    margin: $s-lg;
  }
}
</style>
