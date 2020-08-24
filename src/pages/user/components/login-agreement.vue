<template>
  <view class="rww-container">
    登录即表示同意 <text>用户协议</text>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class LoginHome extends Vue {
};
</script>

<style
  lang="scss"
  scoped
>
  .rww-container {
    padding: 0 8px;
    color: #888;
    font-size: 12px;
  }
  text {
    padding-left: 8px;
    color: blue;
  }
</style>
