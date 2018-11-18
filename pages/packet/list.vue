<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    @mixin flex-column;
    .item {
      @mixin flex-column;
      margin-top: var(--padding);
      padding: var(--padding);
      .top {
        @mixin flex-row;
        border: 1px solid var(--gray-light);
        border-bottom: none;
        padding: 20px;
        background-color: rgb(254, 247, 229);
        > div {
          flex-grow: 1;
          text-align: center;
        }
        .left {
          border-right: var(--border);
          .value {
            color: var(--red);
            font-size: 38px;
          }
          .reason {
            color: var(--gray);
          }
        }
        .right {
          .endTime {
            color: var(--gray);
            margin-bottom: 5px;
          }
        }
      }
      .bottom {
        @mixin flex-row;
        border: 1px solid var(--gray-light);
        padding: 2px var(--padding);
        background-color: #fff;
        color: var(--gray-light);
      }
    }
    .item.disabled {
      position: relative;
      .top {
        background-color: var(--gray-light);
        .left {
          .value {
            color: var(--gray);
          }
        }
        .right {
          .iconfont {
            position: absolute;
            right: var(--padding);
            top: 0;
            font-size: 58px;
          }
          .icon-yiguoqi {
            right: 0;
            color: var(--red);
          }
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <mu-load-more :loading="loading" loading-text="正在加载" :loaded-all="!haveMore" @load="load">
      <div class="item" :class="{disabled: item.status > 1}" v-for="(item,index) in packetList" :key="index">
        <div class="top">
          <div class="left">
            <div class="value">{{item.money}}</div>
            <div class="reason">{{item.name}}</div>
          </div>
          <div class="right" v-if="item.status === 1">
            <div class="endTime">到期时间</div>
            <div>{{item.end_time}}</div>
            <mu-button color="error" @click="fetchPacket(item, index)">立即领取</mu-button>
          </div>
          <div class="right" v-else-if="item.status === 2">
            <div class="iconfont icon-yilingqu"></div>
            <div class="endTime">领取时间</div>
            <div>{{item.updated_at}}</div>
          </div>
          <div class="right" v-else-if="item.status === 3">
            <div class="iconfont icon-yiguoqi"></div>
            <div class="endTime">过期时间</div>
            <div>{{item.end_time}}</div>
          </div>
        </div>
        <div class="bottom">
          <div class="startTime">赠送时间:{{item.created_at}}</div>
        </div>
      </div>
    </mu-load-more>
    <rww-empty v-if="packetList.length < 1"></rww-empty>
  </div>
</template>
<script>
import packet from 'packet';
import utils from 'utils';
import rwwEmpty from 'rww-empty';

export default {
  layout: 'tab',
  data() {
    return {
      packetList: [],
      haveMore: true,
      page: 1,
      loading: false,
    };
  },
  components: {
    rwwEmpty,
  },
  methods: {
    // 加载更多数据
    load() {
      if (this.haveMore) {
        this.loading = true;
        this.getList();
        this.page++;
      }
    },
    // 领取红包
    fetchPacket(item, index) {
      packet.edit({ id: item.id }).then(res => {
        const cb = () => {
          item.status = 2;
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
    getList() {
      packet.getList({ page: this.page }).then(res => {
        const cb = () => {
          this.loading = false;
          if (res.data.data.length < 1) {
            this.haveMore = false;
            return;
          }
          this.packetList = this.packetList.concat(res.data.data);
        };
        utils.dealResponse.call(this, res, cb);
      }).catch(err => {
        utils.dealError.call(this, err);
      });
    },
  },
  mounted() {
    this.load();
    this.$store.commit({ type: 'UPDATE_SELECTED_TAB', value: 'redPacket' });
    utils.setTitle.call(this, '现金红包');
  },
};
</script>
