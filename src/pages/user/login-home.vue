<template>
  <view class="rww-container">
    <login-form-username :error="formError" :focus="formFocus" @submit="submit">
      <view class="login-tip">
        <view
          class="login-tip__register"
          @click="goPage('/pages/user/register')"
          >没有帐号? 立即注册</view
        >
        <view
          class="login-tip__register"
          @click="goPage('/pages/user/forgot-password')"
          >找回密码</view
        >
      </view>
    </login-form-username>
    <login-agreement />

    <login-popup ref="popup" />
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Super from "./mixins";
import { user } from "@/api/user";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import LoginPopup from "./components/login-popup.vue";
import LoginAgreement from "./components/login-agreement.vue";
import LoginFormUsername from "./components/login-form-username.vue";
import { ROUTE, STORAGE_KEY } from "@/assets/constant/common";

@Component({
  components: {
    LoginPopup,
    LoginAgreement,
    LoginFormUsername,
  },
})
export default class LoginHome extends Super {
  /**
   * 登录
   */
  async submit(e: RegisterForm<string>) {
    if (!this.validateForm(e)) return;
    const [err, data] = await user.login(e);
    if (err || !data) return;
    uni.setStorageSync(STORAGE_KEY.UNI_ID_TOKEN, data.token);
    uniWrapper.showToastText("登录成功 ");
  }
  goPage(url: ROUTE) {
    uniWrapper.navigateToPage(url);
  }
}
</script>

<style lang="scss" scoped>
.rww-container {
  height: 100vh;
  max-height: 100vh;
  padding: 0 $s-md;
  background-color: #fff;
}
.login-tip {
  @include flex-row;
  justify-content: space-between;
  padding-top: $s-xs;
  color: $c-gray;
  font-size: $s-sm;
}
</style>
