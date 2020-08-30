<template>
  <view class="login-form">
    <!-- 用户名 -->
    <uv-field
      v-model="form.username"
      :focus="focus.username"
      :maxlength="16"
      :error="!!error.username"
      :error-message="error.username"
      size="large"
      clearable
      placeholder="请输入用户名/手机号/邮箱"
    />
    <!-- 密码 -->
    <uv-field
      v-model="form.password"
      :focus="focus.password"
      :maxlength="16"
      :error="!!error.password"
      :error-message="error.password"
      size="large"
      type="password"
      placeholder="请输入密码"
      clearable
    />
    <!-- 确认密码 -->
    <uv-field
      v-if="isShowConfirm"
      v-model="form.confirm"
      :focus="focus.confirm"
      :maxlength="16"
      :error="!!error.confirm"
      :error-message="error.confirm"
      size="large"
      type="password"
      placeholder="请确认密码"
      clearable
    />
    <slot />
    <uv-button
      custom-class="theme-style__button"
      custom-style="margin: 88rpx 0;"
      size="large"
      :disabled="isHandlingSubmit"
      @click="$emit('submit', form)"
    >
      {{ submitText }}
    </uv-button>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UvField from "uni-vant/lib/field.vue";

@Component({
  components: {
    UvField,
  },
  props: {
    // 是否显示确认密码
    isShowConfirm: {
      type: Boolean,
      default: false,
    },
    // 是否正在处理请求
    isHandlingSubmit: {
      type: Boolean,
      default: false,
    },
    // 确认按钮文字
    submitText: {
      type: String,
      default: "同意协议并登录",
    },
    // 输入框聚焦
    focus: {
      type: Object,
      default: () => ({
        username: true,
        password: false,
        confirm: false,
      }),
    },
    // 输入框错误令牌
    error: {
      type: Object,
      default: () => ({
        username: "",
        password: "",
        confirm: "",
      }),
    },
  },
})
export default class LoginHome extends Vue {
  form = {
    username: "",
    password: "",
    confirm: "",
  };
}
</script>

<style lang="scss" scoped>
/* 输入框样式 */
/deep/ .uv-cell {
  padding-left: 0;
  &::after {
    left: 0;
  }
}
</style>
