<template>
  <view class="address-list">
    <view
      v-for="(item, index) in addressList"
      :key="item._id"
      class="address-item"
    >
      <view class="address-item__body">
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
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class LoginHome extends Vue {}
</script>

<style lang="scss" scoped></style>
