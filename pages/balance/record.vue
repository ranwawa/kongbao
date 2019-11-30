<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
  /deep/ .mu-item-action.is-more {
  @mixin flex-column;
    align-items: flex-end;
    justify-content: center;
  .money {
    color: var(--red);
    font-size: 18px;
    font-weight: bold;
  }
  .money.active {
    color: var(--green);
  }
  }
  }
</style>
<template>
  <div class="container">
    <mu-tabs
      :value.sync="type"
      full-width
      @change="switchTab"
    >
      <mu-tab
        v-for="item in tabs"
        :key="item.id"
        :value="item.id"
      >{{item.name}}
      </mu-tab>
    </mu-tabs>
    <mu-load-more
      style="max-height: 500px; overflow: auto;"
      :loaded-all="!haveMore"
      :loading="isLoading"
      loading-text="正在加载"
      @load="loadMore"
    >
      <mu-list textline="two-line">
        <template v-for="item in list">
          <mu-list-item
            :key="item.id"
            ripple
            button
          >
            <mu-list-item-content>
              <mu-list-item-title>
                {{tabs[type > 3 ? type-2 : type - 1].name}}
              </mu-list-item-title>
              <mu-list-item-sub-title>
                {{item.created_at}}
              </mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-list-item-after-text
                :class="{active: type === 4}"
                class="money"
              >
                {{type === 4 ? '-' : '+'}}{{item.money}}
              </mu-list-item-after-text>
              <mu-list-item-after-text>余额：￥{{item.total_money}}
              </mu-list-item-after-text>
            </mu-list-item-action>
          </mu-list-item>
          <mu-divider :key="item.name"></mu-divider>
        </template>
      </mu-list>
      <div
        v-if="!this.haveMore"
        style="text-align: center;"
      >
        没有啦~
      </div>
    </mu-load-more>
    <rww-empty
      v-if="list.length < 1"
      text="还没有纪录哦"
    ></rww-empty>
  </div>
</template>
<script>
import utils from 'utils';
import account from 'account';
import rwwEmpty from 'rww-empty';

export default {
  data() {
    return {
      tabs: [
        { name: '充值', id: 1 },
        { name: '红包', id: 2 },
        { name: '消费', id: 4 },
        { name: '线下充值', id: 5 },
      ],
      type: 2, // 当前订单类型 1充值 2红包 3退款 4消费
      page: 1, // 当前第几页
      haveMore: true,
      total_pages: 1, // 总页数
      list: [], // 订单列表
      isLoading: false, // 是否正在加载
    };
  },
  components: {
    rwwEmpty,
  },
  methods: {
    switchTab() {
      this.list = [];
      this.page = 1;
      this.haveMore = true;
      this.getList();
    },
    loadMore() {
      this.isLoading = true;
      this.page += 1;
      this.getList();
    },
    // 获取列表
    getList() {
      account
        .getCashList({
          type: this.type,
          page: this.page,
        })
        .then(res => {
          this.isLoading = false;
          const cb = () => {
            let data = res.data.data;
            if (data.length < 1) {
              this.haveMore = false;
              return;
            }
            this.list = this.list.concat(data);
          };
          utils.dealResponse.call(this, res, cb);
        })
        .catch(err => {
          this.isLoading = falseve;
          utils.dealError.call(this, err);
        });
    },
  },
  mounted() {
    this.getList();
    utils.setTitle.call(this, '帐单明细');
  },
};
</script>
