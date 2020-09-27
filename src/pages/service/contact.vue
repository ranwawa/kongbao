<template>
  <view class="rww-container">
    <uv-cell-group v-if="agentInfo.serviceInfo">
      <uv-cell
        :value="agentInfo.serviceInfo.wechat"
        title="客服微信"
        size="large"
        @click="copy(agentInfo.serviceInfo.wechat)"
      />
      <uv-cell
        :value="agentInfo.serviceInfo.qq"
        title="客服QQ"
        size="large"
        @click="copy(agentInfo.serviceInfo.qq)"
      />
      <uv-cell
        :border="false"
        :value="computedPhone"
        title="VIP专属客服电话"
        size="large"
        @click="callPhone(computedPhone)"
      />
    </uv-cell-group>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { agent } from "@/api/agent";
import { ROUTE, STORAGE_KEY } from "@/assets/constant/common";
import { user } from "@/api/user";
import { uniWrapper } from "@/assets/js/uni-wrapper";

@Component({})
export default class LoginHome extends Vue {
  agentInfo: admin.IAgentInfo = Object();
  userInfo: user.IUserInfoRes = Object(); // 用户信息

  get computedPhone() {
    return this.userInfo.isVip ? this.agentInfo.serviceInfo.phone : "****";
  }

  onLoad() {
    this.userInfo = uni.getStorageSync(STORAGE_KEY.USER_INFO);
    this.getAgentInfo();
  }

  /**
   * 获取代理分站信息
   */
  async getAgentInfo() {
    const [err, data] = await agent.getSiteInfoByAppId();
    if (err || !data) {
      return;
    }
    this.agentInfo = data;
    uni.setStorageSync(STORAGE_KEY.AGENT_INFO, data);
  }

  /**
   * 复制信息
   */
  copy(data: string) {
    // #ifdef H5
    this.$copyText(data);
    // #endif
    uni.setClipboardData({ data });
    uniWrapper.showToastText("复制成功");
  }

  /**
   * 打电话
   */
  async callPhone(phoneNumber: string) {
    if (phoneNumber !== "****") {
      const res = await uni.makePhoneCall({ phoneNumber });
    } else {
      const [err, data]: any = await uniWrapper.showModalText(
        "暂未开通VIP,现在就开通？",
        true
      );
      if (err || data?.cancel) {
        return;
      }
      uniWrapper.redirectToPage(ROUTE.FUND_VIP);
    }
  }
}
</script>

<style lang="scss" scoped></style>
