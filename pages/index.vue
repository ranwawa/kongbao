<style scoped>
  @import "../assets/css/base.pcss";
  @import "../assets/css/vars.pcss";
  .container {
    /* banner */
    /deep/ .mu-carousel {
      height: 200px;
      img {
        max-height: 200px;
      }
    }
    /* 平台列表 */
    /deep/ .row {
      width: 100%;
      display: flex;
      justify-content: space-between !important;
      padding: 20px;
      .item {
        display: flex;
        flex-direction: column;
        color: var(--gray-dark);
        .mu-avatar {
          margin-bottom: 5px;
        }
      }
    }
    /* 服务特色 */
    .service {
      padding: 0 10px;
      /deep/ .mu-alert {
        margin-bottom: 10px;
        .mu-icon {
          font-size: 2em;
        }
      }
    }
    /* 登陆容器 */
    .account {
      display: flex;
      justify-content: center;
      padding: 20px;
      margin-bottom: 10px;
      width: 100%;
      /deep/ .mu-button:first-child {
        margin-right: 2em;
      }
    }
    /* 新闻列表 */
    /deep/ .mu-list {
      li {
        margin-top: 30px;
        .mu-item {
          align-items: flex-start;
          .mu-item-action {
            min-width: 80px;
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <mu-carousel>
      <mu-carousel-item v-for="item in banners" :key="item">
        <img :src="item">
      </mu-carousel-item>
    </mu-carousel>
    <!-- 平台列表 -->
    <mu-row>
      <nuxt-link :to="'item?id=' + item.id" class="item" v-for="item, index in platform" :key="index">
        <mu-avatar :size="58">
          <img :src="'/img/logo/' + item.name + '.jpg'" alt="">
        </mu-avatar>
        {{item.name}}
      </nuxt-link>
    </mu-row>
    <!-- 服务特色 -->
    <div class="service">
      <mu-alert color="grey500">
        <mu-icon left value=":iconfont icon-xiaolian1"></mu-icon>
        <strong>真实发货: </strong>电商平台,快递官网, 快递官方客服电话均可查询
      </mu-alert>
      <mu-alert color="grey400">
        <mu-icon left value=":iconfont icon-xiaolian"></mu-icon>
        <strong>批量发货:</strong>通过表格导出导入操作,不用你再一个一个复制粘贴了
      </mu-alert>
      <mu-alert color="grey400">
        <mu-icon left value=":iconfont icon-xiao"></mu-icon>
        <strong>超低价格:</strong>会员价加上充值返现,绝对全网最低价,联系客服送VIP
      </mu-alert>
      <mu-alert color="grey500">
        <mu-icon left value=":iconfont icon-bqxiao"></mu-icon>
        <strong>极速发货:</strong>每天下午2点,晚上9点闲时收件,及时更新物流信息
      </mu-alert>
    </div>
    <!-- 客服信息 -->
    <!-- 登陆容器 -->
    <div class="account">
      <mu-button color="primary" large round to="/account/login">去登陆</mu-button>
      <mu-button color="warning" large round to="/account/register">去注册</mu-button>
    </div>
    <!-- 新闻列表 -->
    <mu-tabs center inverse :value.sync="currentCate">
      <mu-tab v-for="item in category" :key="'cate' + item.name">{{item.name}}</mu-tab>
    </mu-tabs>
    <mu-list textline="three-line" class="list">
      <template v-for="item in 10">
        <mu-list-item avatar :ripple="false" button>
          <mu-list-item-action>
            <mu-avatar style="width: 80px;min-width: 80px; height: 80px;overflow:hidden;border-radius: 0;">
              <img src="/img/bg2.png" style="border-radius: 0;">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content style="width: auto;">
            <mu-list-item-title>这个周末一起吃饭么?</mu-list-item-title>
            <mu-list-item-sub-title>
              <span style="color: rgba(0, 0, 0, .87)">Myron Liu -</span> 周末要来你这里出差，要不要一起吃个饭呀，实在编不下去了,哈哈哈哈哈哈
            </mu-list-item-sub-title>
          </mu-list-item-content>
        </mu-list-item>
        <mu-divider></mu-divider>
      </template>
    </mu-list>
  </div>
</template>
<script>
import utils from 'utils';
import account from 'account';
import article from 'article';

export default {
  data() {
    return {
      banners: ['/img/banner/1.png', '/img/banner/2.png', '/img/banner/3.png', '/img/banner/4.png'],
      platform: [],
      category: [],
      currentCate: 0,
      articleList: [],
    };
  },
  components: {},
  methods: {
    // 获取电商平台
    getPlatformList() {
      account.getPlatform().then((res) => {
        const cb = () => {
          this.platform = res.data.data;
        };
        utils.dealResponse(res, cb);
      }).catch((err) => {
        utils.dealError(err);
      });
    },
    // 获取文章列表
    getArticleList(id) {
      article.getArticleList({cate_id: id }).then((res) => {
        const cb = () => {
          console.log(res);
        };
        utils.dealResponse(res, cb);
      }).catch((err) => {
        utils.dealError(err);
      });
    },
  },
  created() {
    utils.setTitle.call(this, '冉娃娃首页');
  },
  mounted() {
    this.getPlatformList();
    article.getArticleCateList().then((res) => {
      const cb = () => {
        this.category = res.data.data;
        this.getArticleList(this.category[this.currentCate].id);
      };
      utils.dealResponse(res, cb);
    }).catch((err) => {
      utils.dealError(err);
    });
  },
};
</script>

