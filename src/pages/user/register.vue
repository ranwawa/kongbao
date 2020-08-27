<template>
  <view class="rww-container">
    <login-form-username submit-text="立即注册" is-show-confirm>
      <view class="login-tip">
        <view
          class="login-tip__register"
          @click="goPage('/pages/user/login-home')"
          >已有帐号? 立即登录</view
        >
      </view>
    </login-form-username>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { user } from "@/api/user";
import { uniWrapper } from "@/assetes/js/uni-wrapper";
import { cellPhoneReg, emailReg, userNameReg } from "@/assetes/js/regular";
import LoginPopup from "./components/login-popup.vue";
import LoginAgreement from "./components/login-agreement.vue";
import LoginFormUsername from "./components/login-form-username.vue";
import { ROUTE } from "@/assetes/constant/common";

@Component({
  components: {
    LoginPopup,
    LoginAgreement,
    LoginFormUsername,
  },
})
export default class LoginHome extends Vue {
  async onLoad() {}

  /**
   * 登录
   */
  async submit(e: any) {
    const [err, data] = await user.register(e);
  }
  formValidate(e: any) {
    const { userName } = e;
    if (
      !emailReg.test(userName) &&
      !cellPhoneReg.test(userName) &&
      !userNameReg.test(userName)
    ) {
      uniWrapper.showToastText("用户名输入有误");
    }
  }
  goPage(url: ROUTE) {
    uniWrapper.redirectToPage(url);
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
