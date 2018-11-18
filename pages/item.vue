<style scoped>
  @import "../assets/css/base.pcss";
  @import "../assets/css/vars.pcss";
  .container {
    /deep/ .mu-grid-tile-subtitle {
      color: red;
    }
  }
</style>
<template>
  <div class="container">
    <mu-grid-list>
      <mu-grid-tile v-for="(item,index) in list" :rows="index % 3 ? 1 : 2" :cols="index
       % 3 ? 1 : 2" :key="item.name">
        <img :src="'/img/logo/' + item.logo + 'big.jpg'">
        <span slot="title">{{item.name}}</span>
        <span slot="subTitle">一口价:￥{{item.vip_price}}</span>
        <mu-button to="/order/add" slot="action" icon>
          <mu-icon value=":iconfont icon-cartfill"></mu-icon>
        </mu-button>
      </mu-grid-tile>
    </mu-grid-list>
  </div>
</template>
<script>
import order from 'order';
import utils from 'utils';

export default {
  data() {
    return {
      list: [],
    };
  },
  components: {},
  methods: {},
  mounted() {
    const id = this.$route.query.id;
    order.getCompany({plateform_id: id }).then((res) => {
      const cb = () => {
        this.list = res.data.data;
      };
      utils.dealResponse(res, cb);
    }).catch((err) => {
      utils.dealError(err);
    });
  },
};
</script>
