<template>
  <view class="rww-container">
    <login-form-username :error="formError" :focus="formFocus" @submit="submit">
      <view class="login-tip">
        <view
          class="login-tip__register"
          @click="goPage('/pages/user/register')"
          >没有帐号? 立即注册
        </view>
        <view
          class="login-tip__register"
          @click="goPage('/pages/service/contact')"
          >找回密码
        </view>
      </view>
    </login-form-username>
    <login-agreement />

    <!--<login-popup ref="popup" />-->
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
import { doc } from "prettier";
import addAlignmentToDoc = doc.builders.addAlignmentToDoc;
import { agent } from "@/api/agent";

@Component({
  components: {
    LoginPopup,
    LoginAgreement,
    LoginFormUsername,
  },
})
export default class LoginHome extends Super {
  redirect = ""; // 登录成功后的回跳页面
  onLoad(e: { redirect: string }) {
    this.redirect = e.redirect || ROUTE.TAB_HOME;
  }

  /**
   * 登录
   */
  async submit(e: RegisterForm<string>) {
    if (!this.validateForm(e)) return;
    const [err, data] = await user.login(e);
    if (err || !data) return;
    uni.setStorageSync(STORAGE_KEY.UNI_ID_TOKEN, data.token);
    this.getUserInfo();
    uniWrapper.switchTabPage(ROUTE.TAB_HOME);
  }

  /**
   * 查询用户信息
   */
  async getUserInfo() {
    const [err, data] = await user.getUserInfo();
    if (err || !data) {
      return;
    }
    uni.setStorageSync(STORAGE_KEY.USER_INFO, data);
  }

  goPage(url: ROUTE) {
    uniWrapper.navigateToPage(url);
  }
}
</script>

<style lang="scss" scoped>
page {
  background-color: #fff;
}

.rww-container {
  box-sizing: border-box;
  padding: 0 $s-md $s-lg;
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
