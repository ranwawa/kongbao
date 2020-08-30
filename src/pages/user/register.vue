<template>
  <view class="rww-container">
    <login-form-username
      :error="formError"
      :focus="formFocus"
      :is-handling-submit="isHandlingSubmit"
      submit-text="立即注册"
      is-show-confirm
      @submit="submit"
    >
      <view class="login-tip">
        <view class="login-tip__register" @click="goLoginHome"
          >已有帐号? 立即登录</view
        >
      </view>
    </login-form-username>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import _ from "lodash";
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
  isHandlingSubmit = false;
  /**
   * 登录
   */
  async submit(e: RegisterForm<string>) {
    if (!this.validateForm(e, true)) {
      return;
    }
    this.isHandlingSubmit = true;
    const [err, data] = await user.register(
      _.pick(e, ["username", "password"])
    );
    this.isHandlingSubmit = false;
    if (err || !data) return;
    uni.setStorageSync(STORAGE_KEY.UNI_ID_TOKEN, data.token);
    uniWrapper.showToastText(data.msg);
    setTimeout(this.goLoginHome, 2000);
  }
  goLoginHome() {
    uniWrapper.redirectToPage(ROUTE.USER_LOGIN_HOME);
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
