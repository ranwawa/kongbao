<template>
  <view class="address-add" @touchmove.stop>
    <!-- 遮罩 -->
    <view class="address-add__mask" @click="$emit('close')"></view>
    <view class="address-add__wrapper">
      <!-- 标题  -->
      <view class="address-add__head">
        <text class="address-add__title">
          {{ title }}
        </text>
        <uv-icon
          name="close"
          size="18"
          custom-style="float: right;padding: 8rpx 24rpx 0 0;"
          @click="$emit('close')"
        />
      </view>
      <!-- 主体 -->
      <view v-if="isAuto" class="address-add__body">
        <uv-field
          v-model="addressStr"
          class="address-add__textarea"
          type="textarea"
          placeholder="请将收货地址粘贴于此,每行一条"
          autosize
        />
      </view>
      <view v-else class="address-add__body">
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
          :value="cityInfo || '点击这里选择省市区'"
          title="地区"
          title-width="3em"
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
      <view
        :class="{ 'address-add__foot-between': isShowAuto }"
        class="address-add__foot"
      >
        <uv-button
          v-if="isShowAuto"
          custom-style="border-color: #eee; margin-right: 8px;"
          round
          @click="isAuto = !isAuto"
        >
          {{ isAuto ? "手动添加" : "智能识别" }}
        </uv-button>
        <uv-button
          :disabled="isDisableSubmit"
          :loading="isDisableSubmit"
          custom-class="theme-style__button"
          @click="submit"
        >
          保存
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
import { service } from "@/api/service";

@Component({
  props: {
    title: {
      type: String,
      default: "添加收货地址",
    },
    cityInfo: {
      type: String,
      default: "请点击选择省市区",
    },
    addressInfo: {
      type: Object,
      default: Object,
    },
    isShowAuto: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    addressInfo(newValue) {
      const { provinceName, cityName, areaName } = newValue;
      // @ts-ignore
      this.formData = JSON.parse(JSON.stringify(newValue));
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
  isAuto: boolean = false; // 是否为智能识别模式
  isDisableSubmit: boolean = false; // 是否禁用保存按钮
  formData: service.IAddressItem = Object(); // 手动添加的表单数据
  addressStr: string = ""; // 智能识别的地址信息

  /**
   * 手动添加
   */
  submitLabour() {
    const { serviceId, name, mobile, address } = this.formData;
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
      serviceId,
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

  /**
   * 智能识别
   */
  async submitAuto() {
    if (this.addressStr.length < 10) {
      uniWrapper.showToastText("请填写正确的收货信息");
      this.isDisableSubmit = false;
      return;
    }
    if (this.addressStr.split("\n").length > 168) {
      uniWrapper.showToastText("一次最多添加168条收货地址");
      this.isDisableSubmit = false;
      return;
    }
    this.isDisableSubmit = true;
    const [err, data] = await service.resolveAddress({
      addressStr: this.addressStr,
    });
    this.isDisableSubmit = false;
    if (err || !data?.length) {
      return;
    }
    this.$emit("submit-auto", data);
  }

  /**
   * 可在
   */
  submit() {
    this.isAuto ? this.submitAuto() : this.submitLabour();
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

  &__textarea {
    height: 18em;

    /deep/ .uni-textarea-textarea {
      height: 18em;
      max-height: 18em;
      overflow: auto !important;
    }

    .uni-textarea-placeholder {
      overflow: visible;
    }
  }

  &__foot {
    @include flex-row;
    justify-content: center;
    text-align: center;
    margin: $s-lg;

    &-between {
      justify-content: space-between;
    }
    /deep/ .uv-btn {
      width: 100%;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
