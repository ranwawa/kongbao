<!--
 * @file 管理支付二维码页面
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 10:14
-->
<template>
  <view class="rww-container">
    <!-- 切换tab -->
    <view class="tab__items">
      <view
        v-for="item in tabList"
        :key="item.name"
        :class="{'tab__item-active': currentTab.name === item.name}"
        class="tab__item"
        @click="switchTab(item)"
      >
        {{ item.name }}
      </view>
    </view>
    <!-- 二维码列表 -->
    <view class="qr__items">
      <!-- 添加新的收款二维码 -->
      <view class="qr__item qr__item-add">
        <image
          v-if="newQr.src"
          :src="newQr.src"
          mode="aspectFill"
          class="qr__image"
          @click="addQrImg"
        />
        <view
          v-else
          class="qr__image qr__image-empty"
          @click="addQrImg"
        />
        <view class="qr__input">
          <uv-field
            v-model="newQr.moneyStr"
            :border="false"
            :disabled="isLoadingNewQr"
            placeholder="请输入金额"
            type="number"
            align="center"
            clearable
          />
          <uv-button
            :disabled="isLoadingNewQr"
            :loading="isLoadingNewQr"
            size="mini"
            type="info"
            round
            @click="addQr"
          >
            保存
          </uv-button>
        </view>
      </view>
      <view
        v-for="(item, key) in computedQrMap"
        :key="key"
        class="qr__item"
      >
        <uv-icon
          name="close"
          size="22"
          color="#fff"
          @click="removeQr(item)"
        />
        <image
          :src="item.src"
          class="qr__image"
          mode="aspectFill"
        />
        <view class="qr__input">
          <uv-price
            :amount="item.moneyStr"
            size="10"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { uniWrapper } from "@/assets/js/uni-wrapper";
import { common } from "@/api/common";
import { agent } from "@/api/agent";
import _ from 'lodash';
import { PAY_TYPE } from "@/assets/constant/common";

type qrMap = { [x: number]: admin.IQrItem };
@Component({})
export default class extends Vue {
  tabList: Array<admin.IAgentQrTab> = [
    {
      type: PAY_TYPE.WECHAT,
      name: '微信二维码',
    },
    {
      type: PAY_TYPE.ALIPAY,
      name: '支付宝二维码',
    },
  ];
  currentTab: admin.IAgentQrTab = {
    type: PAY_TYPE.WECHAT,
    name: '微信二维码',
  };
  wechatMap: qrMap = {};
  alipayMap: qrMap = {};
  newQr: admin.IQrItem = {
    money: 0,
    moneyStr: '',
    src: '',
  }; // 新增的二维码信息
  isLoadingNewQr: boolean = false; // 是否正在添加二维码

  get computedQrMap(): qrMap {
    const { type } = this.currentTab;
    const { wechatMap, alipayMap } = this;
    return type === PAY_TYPE.WECHAT ? wechatMap : alipayMap;
  }

  onLoad() {
    this.getAgentInfo();
  }

  /**
   * 查询代理分站信息
   */
  async getAgentInfo() {
    const [err, data] = await agent.getSingleByAppId();
    if (err || !data?.qr) {
      return;
    }
    this.wechatMap = this.sortMap(data.qr.wechat);
    this.alipayMap = this.sortMap(data.qr.alipay);
  }

  /**
   * 根据金额(key值)的大小来排序
   */
  sortMap(map: qrMap) {
    const newMap: qrMap = Object();
    // @ts-ignore
    _.sortBy(map, ['money']).forEach(ele => {
      newMap[ele.money as number] = ele;
    })
    return newMap;
  }

  /**
   * 添加收款码图片
   */
  async addQrImg() {
    const [err, data]: any = await uni.chooseImage({ count: 1 });
    const file = data?.tempFiles?.[0];
    if (err || !file) {
      return;
    }
    this.newQr.src = file.path;
    this.newQr.imgType = file.type.split('/')[1];
  }

  /**
   * 添加新的收款二维码
   */
  async addQr() {
    const { src, moneyStr } = this.newQr;
    if (!moneyStr) {
      uniWrapper.showToastText('请先输入金额');
      return;
    }
    if (!src) {
      uniWrapper.showToastText('请添加图片');
      return;
    }
    this.isLoadingNewQr = true;
    const moneyCent = this.newQr.money = +((+moneyStr * 100).toFixed(2));
    const [err, data] = await common.uploadImage({
      ...this.newQr,
      money: moneyCent,
    })
    console.log(err, data);
    if (!data || !data.filePath) {
      uniWrapper.showToastText('上传失败,请稍后再试');
      this.isLoadingNewQr = false;
      return;
    }
    const param = {
      payType: this.currentTab.type,
      src: data.fileID,
      money: moneyCent,
      moneyStr,
    };
    const [err2] = await agent.addQrCode(param);
    if (err2) {
      return;
    }
    this.isLoadingNewQr = false;
    uniWrapper.showToastText('添加成功');
    if (this.currentTab.type === PAY_TYPE.WECHAT) {
      this.wechatMap[moneyCent] = param;
    } else {
      this.alipayMap[moneyCent] = param;
    }
    this.newQr = Object();
  }

  /**
   * 切换tab
   */
  switchTab(item: admin.IAgentQrTab) {
    this.currentTab = item;
  }

  /**
   * 删除一张二维码
   */
  async removeQr(item: admin.IQrItem) {
    const [, data]: any = await uniWrapper.showModalText('确定要删除吗？', true);
    if (data.cancel) {
      return;
    }
    const [err] = await agent.removeQr({
      payType: this.currentTab.type,
      money: item.money,
    });
    if (err) {
      return;
    }
    await this.getAgentInfo();
  }
}
</script>

<style
  lang="scss"
  scoped
>
  /* 切换tab */
  .tab {
    &__items {
      @include flex-row;
      text-align: center;
      background-color: #fff;
    }

    &__item {
      position: relative;
      flex-grow: 1;
      height: px2rpx(44);
      line-height: px2rpx(44);

      &-active {
        color: $c-theme;
        font-weight: bold;

        &::after {
          content: ' ';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: px2rpx(2);
          background-color: $c-theme;
        }
      }
    }
  }

  /* 二维码列表 */
  .qr {
    &__items {
      @include flex-row;
      flex-wrap: wrap;
    }

    &__item {
      position: relative;
      width: px2rpx(185);
      margin-top: $s-xs;
      background-color: #fff;

      &:nth-child(2n-1) {
        margin-right: px2rpx(5);
      }

      /deep/ > .uv-icon {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 8;
        padding: $s-xxs;
        background-color: rgba(0, 0, 0, .4);
      }
    }

    &__image {
      width: 100%;
      height: px2rpx(185);
      color: $c-muted;

      &-empty {
        @include flex-row;
        position: relative;
        justify-content: center;

        &::before {
          content: '\F09C';
          font: normal normal normal 14px/1 'vant-icon';
          font-size: px2rpx(18);
        }

        &::after {
          content: '点击上传';
          margin-left: $s-xxs;
          line-height: px2rpx(18);
        }
      }
    }

    &__input {
      @include flex-row;
      @include bd-hairline-top;
      box-sizing: border-box;
      padding: $s-xs;
      height: px2rpx(38);

      /deep/ {
        .uv-cell {
          padding: 0;
          margin-right: $s-sm;
        }

        .uv-field-body {
          background-color: $bgc-base;
        }

        .uv-btn-text {
          margin-left: 0;
        }
      }

    }
  }
</style>
