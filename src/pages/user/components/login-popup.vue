<template>
  <view class="login-popup">
    <view class="login-popup__btn" @click="isShowPopup = true">
      使用其他方式登录
    </view>
    <uv-popup
      :show="isShowPopup"
      position="bottom"
      @close="isShowPopup = false"
    >
      <view class="login-popup__wrapper">
        <uv-cell title="手机号登录" icon="phone-o" size="large" clickable />
        <uv-cell title="邮箱登录" icon="envelop-o" size="large" clickable />
        <uv-cell
          :border="false"
          title="取消"
          icon="close"
          size="large"
          clickable
          @click="isShowPopup = false"
        />
      </view>
    </uv-popup>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UvCell from "uni-vant/lib/cell.vue";
import UvPopup from "uni-vant/lib/popup.vue";

@Component({
  components: {
    UvCell,
    UvPopup,
  },
})
export default class LoginHome extends Vue {
  /**
   * 是否显示弹框
   */
  isShowPopup = false;
}
</script>

<style lang="scss" scoped>
.login-popup {
  &__btn {
    font-size: $fz-md;
    text-align: center;
  }
  &__wrapper {
    width: 100vw;

    /deep/ .uv-cell {
      justify-content: center;

      .uv-icon {
        margin-right: $s-xs;
        font-size: $s-md;
      }

      .uv-cell-title {
        flex-grow: 0;
        white-space: nowrap;
      }
    }
  }
}
</style>
