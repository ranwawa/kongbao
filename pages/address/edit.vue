<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    > div {
      margin-top: var(--padding) *2;
      padding: var(--padding);
      background-color: #fff;
      /deep/ .mu-input {
        margin-bottom: 0;
      }
    }
    .quickly, .form, .platform, .isDefault {
      box-shadow: var(--shadow);;
    }
    .form {
      @mixin flex-column;
      .top {
        @mixin flex-row;
        .name {
          margin-right: 1em;
        }
      }
      /* 地址弹框 */
      /deep/ .distpicker-address-wrapper {
        color: #333;
        .address-header {
          font-weight: bold;
        }
      }
    }
    .isDefault {
      @mixin flex-row;
    }
    .btn {
      background-color: var(--gray-back);;
    }
    /deep/ .mu-bottom-sheet {
      .iconfont {
        font-size: 3em;
      }
    }
  }
</style>
<template>
  <div class="container">
    <!-- 粘贴文本 -->
    <div class="quickly">
      <mu-text-field placeholder="粘贴发件人地址,自动识别地址信息" full-width
                     action-icon=":iconfont icon-settings_light" v-model="fullAddress"></mu-text-field>
    </div>
    <!-- 表单 -->
    <div class="form">
      <div class="top">
        <mu-text-field class="name" label="寄件人姓名" label-float action-icon=":iconfont icon-my_light"
                       v-model="name"></mu-text-field>
        <mu-text-field label="电话" label-float action-icon=":iconfont icon-phone" v-model="phone"></mu-text-field>
      </div>
      <mu-text-field label="请选择省市区" label-float action-icon=":iconfont icon-right" :value="p_c_a"
                     @focus="showSelect = !showSelect"></mu-text-field>
      <v-distpicker type="mobile" v-if="showSelect" @selected="selectAddress"></v-distpicker>
      <mu-text-field label="详细地址" label-float action-icon=":iconfont icon-location" v-model="address"></mu-text-field>
    </div>
    <div class="platform">
      <mu-text-field label="请选择电商平台" label-float full-width v-model="platform.name" placeholder="点击选择电商平台"
                     @click="openSheet = !openSheet"></mu-text-field>
    </div>
    <!-- 电商平台弹框 -->
    <mu-bottom-sheet :open.sync="openSheet">
      <mu-list textline="two-line" @item-click="openSheet = !openSheet" :value="platform" @change="platform = $event;">
        <mu-sub-header>不同的电商平台支持的快递公司不一样，选择错误可能导致无法发货</mu-sub-header>
        <mu-list-item button avatar v-for="item in platformList" :key="item.id" :value="item">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="'/img/logo/' + item.logo + '.png'">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{item.name}}</mu-list-item-title>
            <mu-list-item-sub-title>支持：批量预约,{{item.is_excel === 1 ? '表格预约' : ''}}{{item.is_api === 1 ? ',一键预约' : ''}}
            </mu-list-item-sub-title>
          </mu-list-item-content>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
    <div class="isDefault">
      <div class="text">设置为默认发件地址</div>
      <mu-switch v-model="is_default"></mu-switch>
    </div>
    <div class="btn">
      <mu-button full-width color="success" round @click="submit">确认修改</mu-button>
    </div>
  </div>
</template>
<script>
import VDistpicker from 'v-distpicker';
import utils from 'utils';
import account from 'account';
import address from 'address';
// import address from 'address';
export default {
  data() {
    return {
      id: '',
      fullAddress: '', // 粘贴的完整地址
      name: '',
      phone: '',
      province: '',
      city: '',
      region: '',
      address: '',
      platform: { name: '', id: '' },
      is_default: false,
      showSelect: false, // 是否显示省市区选择
      openSheet: false, // 是否弹开平台列表
      platformList: [], // 平台列表
    };
  },
  computed: {
    p_c_a() {
      let data = `${this.province} ${this.city} ${this.region}`;
      if (data.length < 3) {
        return '';
      }
      return data;
    },
  },
  components: {
    VDistpicker,
  },
  methods: {
    // 提交数据
    submit() {
      const param = {
        id: this.id,
        platform_id: this.platform.id,
        name: this.name,
        phone: this.phone,
        province: this.province,
        city: this.city,
        region: this.region,
        address: this.address,
        is_default: this.is_default ? 1 : 0,
      };
      address.edit(param).then(res => {
        const cb = () => {
          this.$toast.success('修改成功');
          setTimeout(() => {
            this.$router.push('/address/list');
          }, 1688);
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
    // 选中了省市区
    selectAddress(data) {
      // 赋值省市区
      this.province = data.province.value;
      this.city = data.city.value;
      this.region = data.area.value;
      // 隐藏选择框
      this.showSelect = false;
    },
    // 获取平台列表
    getPlatform() {
      account.getPlatform().then(res => {
        const cb = () => {
          this.platformList = res.data.data;
        };
        utils.dealResponse.call(this, res, cb);
        return this.getSingle();
      }).then(res => {
        const cb = () => {
          let data = res.data.data;
          data.is_default = data.is_default !== 0;
          Object.assign(this._data, data);
          // 取当前平台信息
          this.platformList.forEach((ele, index) => {
            if (ele.id === res.data.data.platform_id) {
              this.platform = this.platformList[index];
            }
          });
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
    // 获取单条地址
    getSingle() {
      return address.getSingle({ id: this.id });
    },
  },
  mounted() {
    this.getPlatform();
    this.id = this.$route.query.id;
    utils.setTitle.call(this, '修改地址');
  },
};
</script>
