<template>
  <view class="rww-container">
    <uv-field
      v-model="form.userName"
      :focus="focus.userName"
      clearable
      placeholder="请输入用户名/手机号/邮箱"
    ></uv-field>
    <uv-field
      v-model="form.password"
      :focus="focus.password"
      type="password"
      clearable
      placeholder="请输入密码"
    ></uv-field>
    <login-agreement />
    <uv-button
      custom-class="theme-style__button"
      custom-style="margin: 88rpx 0;"
      size="large"
      @click="submit"
    >
      同意协议并登录
    </uv-button>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { user } from "@/api/user";
import UvField from 'uni-vant/lib/field.vue';
import LoginAgreement from './components/login-agreement.vue';
import { cellPhoneReg, emailReg, userNameReg } from "@/assetes/js/regular";
import { uniWrapper } from "@/assetes/js/uni-wrapper";

@Component({
  components: {
    UvField,
    LoginAgreement,
  }
})
export default class LoginHome extends Vue {
  form = {
    userName: '',
    password: '',
    inviteCode: '',
  };
  focus = {
    userName: true,
    password: false,
  }

  async onLoad() {
  }

  /**
   * 登录
   */
  async submit() {
    const [err, data] = await user.register(this.form)
  }
  formValidate() {
    const { userName } = this.form;
    if (
      !emailReg.test(userName)
      && !cellPhoneReg.test(userName)
      && !userNameReg.test(userName)
    ) {
      uniWrapper.showToastText('用户名输入有误');
    }
  }
};
</script>

<style
  lang="scss"
  scoped
>
  .rww-container {
    padding: 0 16px;
    background-color: #fff;
    /deep/ .uv-cell {
      padding-left: 0;
      &::after {
        left: 0;
      }
    }
  }
</style>
