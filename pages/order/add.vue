<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    text-align: left;
    /* 快速预约 */
    .quickly {
      padding-bottom: 2em;
      /* 小标题 */
      /deep/ .mu-sub-header {
        margin: 0;
        padding: 0 var(--padding);
        background: none;
      }
      > div {
        padding: 20px var(--padding);
        background-color: #fff;
      }
      /* 发件人地址 */
      .seller {
        @mixin flex-row;
        justify-content: space-around;
        box-shadow: var(--shadow);
        /deep/ .icon {
          em {
            width: 10px;
            height: 10px;
          }
        }
        .left {
          @mixin flex-column;
          flex-grow: 1;
          border-right: var(--border);
          padding: 0 1em;
          text-align: left;
          .namePhone {
            @mixin flex-row;
            justify-content: flex-start;
            color: #000;
            font-size: 16px;
            font-weight: bold;
            /deep/ .mu-avatar {
              margin: 0 10px 5px 0;
              background: none;
            }
          }
        }
        /deep/ .mu-button {
          font-size: 12px;
        }
      }
      .addressError {
        color: var(--red);;
      }
      /* 收件人地址 */
      .buyer {
        @mixin flex-column;
        box-shadow: var(--shadow);;
        > div {
          width: 100%;
        }
        .top {
          @mixin flex-row;
          align-items: center;
          /deep/ .icon {
            em {
              width: 10px;
              height: 10px;
            }
          }
          .left {
            @mixin flex-column;
            flex-grow: 1;
            padding-left: 1em;
            .title {
              font-weight: bold;
              text-align: left;
            }
            /deep/ .mu-input {
              margin-bottom: 0;
              textarea {
                font-size: 12px;
              }
            }
          }
          /* 表格时，要显示右边框 */
          .left.active {
            border-right: var(--border);;
            .info {
              color: var(--gray);;
            }
          }
          /* 选择表格按钮 */
          /deep/ .file-uploads {
            margin: 0 16px;
          }
        }
        .upload {
          @mixin flex-row;
          justify-content: flex-end;
          margin-top: var(--padding);;
          .text {
            margin-right: 1em;
          }
        }
        /deep/ .mu-button {
          align-self: flex-end;
          font-size: 12px;
        }
      }
      /* 快递公司，物品类型，重量 */
      .other {
        box-shadow: var(--shadow);;
        padding: 0 var(--padding);;
        /deep/ .mu-list {
          .mu-item {
            padding: 0;
            .mu-item-sub-title {
              margin-right: 1em;
              text-align: right;
            }
            .error {
              color: var(--red);;
            }
          }
        }
      }
      /* 物品重量及类型 */
      .object {
        /deep/ .mu-chip {
          margin: 0 1em 1em 0;
        }
      }
      /* 协议按钮 */
      /deep/ .mu-checkbox {
        padding: var(--padding);;
        background: none;
      }
      /* 小计汇总 */
      /deep/ .amount {
        position: fixed;
        top: auto;
        right: 0;
        bottom: 56px;
        left: 0;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        .mu-item-wrapper {
          margin: 0 auto;
          max-width: 750px;
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <!-- 顶部通栏 -->
    <mu-tabs :value.sync="currentIndex" color="primary" full-width indicator-color="yellow">
      <mu-tab>快速预约</mu-tab>
      <mu-tab>批量预约</mu-tab>
      <mu-tab>一键预约</mu-tab>
    </mu-tabs>
    <!-- 快速预约 -->
    <div class="quickly" v-if="currentIndex !== 2">
      <!-- 发件人地址 -->
      <mu-sub-header>发件地址</mu-sub-header>
      <div class="seller">
        <mu-badge class="icon" color="primary" content=" " circle></mu-badge>
        <!-- 如果没有默认地址，进行提示 -->
        <div class="left" v-if="currentAddress.name">
          <div class="namePhone">
            <mu-avatar size="24">
              <img :src="'/img/logo/' + currentAddress.platform_logo + '.png'">
            </mu-avatar>
            {{currentAddress.name}} {{currentAddress.phone}}
          </div>
          <div class="address">{{currentAddress.province}} {{currentAddress.city}} {{currentAddress.region}}
            {{currentAddress.address}}
          </div>
        </div>
        <!-- 如果没有发货地址显示添加 -->
        <div class="left" v-else>
          点击右侧的地址薄,{{addressList.length > 0 ? '选择' : '添加'}}发货地址
        </div>
        <mu-button flat="" color="primary" @click="openAddress = !openAddress" v-if="addressList.length > 0">选择地址
        </mu-button>
        <router-link to="/address/add" class="more" v-else>添加地址</router-link>
      </div>
      <div class="addressError" v-if="addressError">{{addressError}}</div>
      <!-- 发件人地址弹框 -->
      <mu-bottom-sheet :open.sync="openAddress">
        <mu-list textline="two-line" @item-click="openAddress = !openAddress" :value="currentAddress"
                 @change="currentAddress = $event">
          <mu-sub-header>请选择发件人地址</mu-sub-header>
          <mu-list-item button avatar v-for="item in addressList" :key="item.id" :value="item">
            <mu-list-item-action>
              <mu-avatar>
                <img :src="'/img/logo/' + item.platform_logo + '.png'" alt="">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{item.name}} {{item.phone}}</mu-list-item-title>
              <mu-list-item-sub-title>{{item.province}} {{item.city}} {{item.region}} {{item.address}}
              </mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-bottom-sheet>
      <!-- 收件人地址 -->
      <mu-sub-header>收件人地址</mu-sub-header>
      <div class="buyer">
        <div class="top">
          <mu-badge class="icon" color="success" content=" " circle></mu-badge>
          <div class="left" :class="{active: currentIndex === 1}">
            <div class="title">你想寄到哪里？</div>
            <mu-text-field v-if="currentIndex === 0" multi-line :rows="5" :rows-max="15"
                           placeholder="复制收件人信息，一行条地址，系统会自动识别"
                           v-model="buyers" :error-text="buyerError"></mu-text-field>
            <div class="info" v-else>请上传标准格式的订单表格,示例:</div>
          </div>
          <vue-upload ref="upload" @input-file="show" post-action="http://api.ranwawa.cn/api/uploadFile" name="xls"
                      v-if="currentIndex === 1"
                      v-model="files" extensions="xls,xlsx,csv,tsv" :headers="headers"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            选择表格
          </vue-upload>
        </div>
        <!-- 快速预约时显示智能识别 -->
        <!--<mu-button small color="primary" v-if="currentIndex === 0">智能识别</mu-button>-->
        <!-- 批量预约且选择了表格后，才显示立即上传-->
        <div class="upload" v-if="currentIndex === 1 && files.length > 0">
          <span class="text">{{files[0] && files[0].name}}</span>
          <mu-button small color="grey600" v-if="files[0].error">上传失败,重新选择表格{{files[0].error}}</mu-button>
          <mu-button small color="success" v-else-if="files[0].success">上传成功</mu-button>
          <mu-button small color="primary" v-else @click="$refs.upload.active = true">立即上传
          </mu-button>
        </div>
      </div>
      <!-- 快递公司，物品类型，重量 -->
      <mu-sub-header>快递公司</mu-sub-header>
      <div class="other">
        <mu-list>
          <mu-list-item button ripple @click="openCompany = !openCompany">
            <mu-list-item-title>快递公司</mu-list-item-title>
            <mu-list-item-sub-title :class="{error: currentCompany.name === '请选择快递公司'}">{{currentCompany.name ||
              '请选择快递公司'}}
            </mu-list-item-sub-title>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item button ripple @click="openObject = !openObject">
            <mu-list-item-title>物品类型</mu-list-item-title>
            <mu-list-item-sub-title>{{currentObject}}</mu-list-item-sub-title>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item button ripple @click="openWeight = !openWeight">
            <mu-list-item-title>物品重量</mu-list-item-title>
            <mu-list-item-sub-title>{{currentWeight}}</mu-list-item-sub-title>
            <mu-icon value=":iconfont icon-right"></mu-icon>
          </mu-list-item>
        </mu-list>
      </div>
      <mu-checkbox v-model="checkbox" label="我已阅读并同意服务协议"></mu-checkbox>
      <!-- 快递公司弹框 -->
      <mu-bottom-sheet :open.sync="openCompany">
        <mu-list textline="two-line" @item-click="openCompany = !openCompany" :value="currentCompany"
                 @change="currentCompany = $event">
          <mu-sub-header>请选择快递公司</mu-sub-header>
          <mu-list-item button avatar v-for="item in companyList" :key="item.id" :value="item">
            <mu-list-item-action>
              <mu-avatar color="#fff">
                <img :src="'/img/logo/' + item.logo + '.png'">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{item.name}} 会员价:{{item.price}} VIP价:{{item.vip_price}}</mu-list-item-title>
              <mu-list-item-sub-title>{{item.remark}}
              </mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-bottom-sheet>
      <!-- 物品类型弹框 -->
      <mu-bottom-sheet :open.sync="openObject" style="padding-bottom: 30px;">
        <mu-sub-header>请选择配送货物</mu-sub-header>
        <mu-chip v-for="item in objects" :key="item" @click="currentObject = item;openObject = !openObject"
                 :selected="item === currentObject" style="margin:0 10px 10px 10px;">{{item}}
        </mu-chip>
      </mu-bottom-sheet>
      <!-- 物品重量弹框 -->
      <mu-bottom-sheet :open.sync="openWeight" style="padding-bottom: 30px;">
        <mu-sub-header>请选择货物重量</mu-sub-header>
        <mu-chip v-for="item in weights" :key="item" @click="currentWeight = item;openWeight = !openWeight"
                 :selected="item === currentWeight" style="margin:0 10px 10px 10px;">{{item}}
        </mu-chip>
      </mu-bottom-sheet>
      <!-- 小计结算 -->
      <mu-list class="amount" style="">
        <mu-list-item>
          <mu-list-item-content>
            <mu-list-item-title style="color: red;">运费：{{countFee}}元</mu-list-item-title>
            <mu-list-item-sub-title>本次配送包裹数量：{{countNumber}}个</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-button color="red" @click="submit">确定预约
            <vue-loading :active="isLoading" spinner="bar-fade-scale"></vue-loading>
          </mu-button>
        </mu-list-item>
      </mu-list>
    </div>
    <div class="oneStep" v-else>一键预约正在开发中</div>
  </div>
</template>
<script>
import utils from 'utils';
import address from 'address';
import order from 'order';
import vueUpload from 'vue-upload-component';
import vueLoading from 'vue-element-loading';
import wx from 'wx';

export default {
  layout: 'tab',
  data() {
    return {
      headers: {}, // 上传表格的配置
      isLoading: false, // 是否正在进行ajax请求
      files: [], // 上传的表格
      checkbox: true,
      currentIndex: 0, // 预约类型0快速 1批量 2一键
      // 发件人地址
      // 发件人
      addressList: [], // 发件人地址列表
      currentAddress: {}, // 当前显示的发件人地址
      addressError: '',
      // 收件人地址
      buyers: '', // 收件人地址
      openAddress: false, // 是否显示发件人地址列表
      buyerError: '',
      // 快递公司
      openCompany: false, // 是否显示快递公司列表
      currentCompany: {}, // 当前选择的快递公司
      companyList: [],
      // 货物
      currentObject: '日用品', // 当前选择的货物类型
      objects: ['日用品', '数码产品', '衣物', '食物', '文件', '其它'],
      openObject: false,
      // 重量
      currentWeight: '1kg以下',
      weights: ['1kg以下', '1kg~3kg', '3kg~5kg', '5kg~10kg', '10kg以上'],
      openWeight: false,
      // 合计
      countFee: '',
      countNumber: '',
    };
  },
  watch: {
    currentCompany() {
      this.countAmount();
    },
    buyers() {
      this.countAmount();
    },
    currentAddress() {
      this.getCompany();
    },
  },
  components: {
    vueUpload,
    vueLoading,
  },
  methods: {
    // 计算总运费和数量
    countAmount() {
      // 根据会员类型确定单价
      let price = this.currentCompany.price ? parseFloat(this.currentCompany.price) : 0;
      let vipPrice = this.currentCompany.vip_price ? parseFloat(this.currentCompany.vip_price) : 0;
      price = this.$store.state.is_vip ? vipPrice : price;
      let buyers = this.buyers.split('\n');
      if (buyers[0] === '') {
        buyers.splice(0, 1);
      }
      if (buyers[buyers.length - 1] === '') {
        buyers.splice(buyers.length - 1, 1);
      }
      this.countNumber = buyers.length;
      this.countFee = (this.countNumber * price).toFixed(2);
    },
    // 上传表格回调
    show(newFile, oldFile) {
      if (newFile && newFile.success) {
        // 将返回的值进行拼接,再提交给后台
        let result = JSON.parse(newFile.xhr.response);
        result = result.map(ele => {
          return Object.values(ele).toString();
        });
        result = result.join('\n');
        this.buyers = result;
      }
    },
    validate() {
      if (!this.currentAddress.id) {
        this.addressError = '请选择发件人地址';
        return false;
      } else {
        this.addressError = '';
      }
      if (!this.buyers) {
        this.buyerError = '请添加收件人地址';
        return false;
      } else {
        this.buyerError = '';
      }
      if (!this.currentCompany.id) {
        this.currentCompany.name = '请选择快递公司';
        return false;
      }
      return true;
    },
    // 提交订单
    submit() {
      if (!this.validate()) {
        return false;
      }
      this.isLoading = true;
      order.createOrder({
        address: this.buyers,
        express_id: this.currentCompany.id,
        fa_id: this.currentAddress.id,
        w_type: this.currentObject,
        w_kg: this.currentWeight,
      }).then(res => {
        this.isLoading = false;
        const cb = () => {
          // Object.assign(this._data, res.data.result);
        };
        utils.dealResponse(res, cb);
      }).catch(err => {
        this.isLoading = false;
        utils.dealError(err);
      });
    },
    // 获取地址信息
    getAddress() {
      address.getList().then(res => {
        const cb = () => {
          // 显示设置默认地址
          this.currentAddress = res.data.data.find(ele => ele.is_default) || {};
          this.addressList = res.data.data;
        };
        utils.dealResponse(res, cb);
      }).catch(err => {
        utils.dealError(err);
      });
    },
    // 获取快递公司信息
    getCompany() {
      order.getCompany({ plateform_id: this.currentAddress.platform_id }).then(res => {
        const cb = () => {
          this.companyList = res.data.data;
        };
        utils.dealResponse(res, cb);
      }).catch(err => {
        utils.dealError(err);
      });
    },
  },
  mounted() {
    this.getAddress();
    this.$store.commit({ type: 'UPDATE_SELECTED_TAB', value: 'order' });
    this.headers.Authorization = wx.getStorageSync('rww-token');
    utils.setTitle.call(this, '预约快递');
  },
};
</script>
