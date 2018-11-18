<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    .outer {
      margin: var(--padding) 0;
      padding: 10px;
      background-color: #fff;
    }
    .numbers {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #fff;
      .title {
        border-bottom: var(--border);
        padding-bottom: var(--border);
        font-size: 16px;
        text-align: left;
      }
    }
  }
</style>
<template>
  <div class="container">
    <mu-tabs :value.sync="tab" color="primary" center full-width>
      <mu-tab>批量添加</mu-tab>
      <mu-tab>分段添加</mu-tab>
    </mu-tabs>
    <div class="outer">
      <mu-select label="快递公司" v-model="company" :error-text="companyError" full-width label-float>
        <mu-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></mu-option>
      </mu-select>
    </div>
    <div class="numbers">
      <div class="title">快递单号</div>
      <mu-text-field v-model="numbers" :placeholder="style[tab]" :error-text="numberError" :rows="10" multi-line solo
                     full-width></mu-text-field>
    </div>
    <mu-button color="success" full-width @click="submit">添加单号</mu-button>
  </div>
</template>
<script>
  import utils from 'utils';
  import order from 'order';
  export default {
    data () {
      return {
        tab: 0, // 当前添加类型索引
        company: '', // 快递公司名字
        companyError: '',
        companyList: [],
        numberError: '',
        numbers: '', // 快递单号
        style: ['请粘贴快递单号，一行一个', '请粘贴快递单号,两个快递号之间以-隔开']
      };
    },
    components: {},
    methods: {
      // 验证数据
      validate () {
        if (!this.company) {
          this.companyError = '请选择快递公司';
          return false;
        } else {
          this.companyError = '';
        }
        if (!this.numbers) {
          this.numberError = '请输入快递单号';
          return false;
        } else {
          this.numberError = '';
        }
        return true;
      },
      // 提交数据
      submit () {
        if (!this.validate()) {
          return false;
        }
        let number = [];
        // 如果是分段添加
        if (this.tab) {
          number = this.numbers.split('-');
        } else {
          number = this.numbers.split('\n');
        }
        number = number.map(ele => {
          ele = {express_id: this.company, num_no: ele};
          return ele;
        });
        order.addNumber({num_no: number})
          .then(res => {
            const cb = () => {
              utils.showModal('添加成功');
            };
            utils.dealResponse(res, cb);
          })
          .catch(err => {
            utils.dealError(err);
          });
      }
    },
    mounted () {
      let id = this.$route.query.id;
      order.getCompany()
        .then(res => {
          const cb = () => {
            this.companyList = res.data.data;
            this.companyList.forEach(ele => {
              if (ele.id === parseInt(id)) {
                this.company = ele.id;
              }
            });
          };
          utils.dealResponse(res, cb);
        })
        .catch(err => {
          utils.dealError(err);
        });
      utils.setTitle.call(this, '添加单号');
    }
  };
</script>
