<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    padding: var(--padding);
    .item {
      @mixin flex-column;
      position: relative;
      box-shadow: var(--shadow);
      margin-top: var(--padding) * 2;
      padding: var(--padding) var(--padding) 0 var(--padding);
      background-color: #fff;
      > div {
        text-align: left;
      }
      .namePhone {
        @mixin flex-row;
        justify-content: flex-start;
        color: #000;
        font-size: 18px;
        font-weight: bold;
        /deep/ .mu-avatar {
          margin-right: 10px;
          background: none;
        }
      }
      .address {
        margin-top: var(--padding);
        padding-bottom: var(--padding);
      }
      .btn {
        @mixin flex-row;
        justify-content: flex-end;
        border-top: var(--border);
        color: var(--gray) !important;
      }
      > .iconfont {
        position: absolute;
        top: -15px;
        right: 1px;
        color: var(--green);
        font-size: 68px;
        text-align: right;
      }
    }
    > /deep/ .mu-button {
      margin-top: 2em;
    }
  }
</style>
<template>
  <div class="container">
    <div class="item" v-for="item in list" :key="item.id" @click="item.show = !item.show">
      <div class="namePhone">
        <mu-avatar>
          <img :src="'/img/logo/' + item.platform_logo + '.png'">
        </mu-avatar>
        <div :class="'iconfont ' + item.icon"></div>
        <div class="name">收件人：{{item.name}} {{item.phone}}</div>
      </div>
      <div class="address">收货地址：{{item.province}} {{item.city}} {{item.area}} {{item.address}}</div>
      <div class="btn" v-show="item.show" @click.stop.prevent>
        <!--<mu-radio v-model="defaultId" :label="item.is_default ? '默认地址' : '设为默认'" :value="item.id"></mu-radio>-->
        <mu-button flat class="edit" :to="'/address/edit?id=' + item.id">
          <mu-icon left value=":iconfont icon-edit_light"></mu-icon>
          编辑
        </mu-button>
        <mu-button flat @click="deleteAddress(item)">
          <mu-icon left value=":iconfont icon-delete_light"></mu-icon>
          删除
        </mu-button>
      </div>
      <div class="iconfont icon-moren" v-if="item.is_default"></div>
    </div>
    <rww-empty v-if="list.length < 1" text="一个地址也没有添加过"></rww-empty>
    <mu-button full-width color="success" to="/address/add">添加新地址</mu-button>
  </div>
</template>
<script>
  import address from 'address';
  import utils from 'utils';
  import rwwEmpty from 'rww-empty';
  export default {
    data () {
      return {
        defaultId: '',
        list: []
      };
    },
    components: {
      rwwEmpty
    },
    methods: {
      // 删除地址
      deleteAddress (item) {
        address.delete({id: item.id})
          .then(res => {
            const cb = () => {
              this.$toast.success('删除成功');
              this.list.splice(this.list.indexOf(item), 1);
            };
            utils.dealResponse.call(this, res, cb);
          })
          .catch(err => {
            utils.dealError.call(this, err);
          });
      },
      // 获取地址列表
      getList () {
        address.getList()
          .then(res => {
            const cb = () => {
              let data = res.data.data;
              data = data.map(ele => {
                // 是否显示操作按钮
                ele.show = true;
                // 默认按钮
                if (ele.is_default) {
                  this.defaultId = ele.id;
                }
                return ele;
              });
              this.list = data;
            };
            utils.dealResponse.call(this, res, cb);
          })
          .catch(err => {
            utils.dealError.call(this, err);
          });
      }
    },
    mounted () {
      this.getList();
      utils.setTitle.call(this, '我的地址');
    }
  };
</script>
