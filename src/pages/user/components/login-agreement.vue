<template>
  <view class="login-agreement"> 登录即表示同意 <text>用户协议</text> </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class LoginHome extends Vue {}
</script>

<style lang="scss" scoped>
.login-agreement {
  padding: $s-xs 0;
  color: $c-muted;
  font-size: $fz-sm;
}
text {
  padding-left: $s-xs;
  color: blue;
}
</style>
