<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    .outer {
      padding: var(--padding);;
      .row {
        @include flex-row;
        margin: auto;
        /deep/ .mu-input {
          width: auto;
        }
      }
    }
  }
</style>
<template>
  <div class="container">
    <div class="outer">
      <mu-text-field label="模板名称" full-width label-float v-model="name" :error-text="nameError"></mu-text-field>
      <div class="row" v-for="ele in template" :key="ele.fieldName">
        <mu-select label="选择导出的列" label-float v-model="ele.fieldName" :error-text="ele.fieldError">
          <mu-option v-for="item in fields" :label="item" :value="item" :key="item"></mu-option>
        </mu-select>
        <mu-text-field label="表格列名" label-float v-model="ele.columnName" :error-text="ele.columnError"></mu-text-field>
      </div>
      <mu-sub-header @click="addColumn" ripple>添加一列</mu-sub-header>
      <mu-button color="success" full-width @click="submit">提交</mu-button>
    </div>
  </div>
</template>
<script>
  import utils from 'utils';
  export default {
    data () {
      return {
        name: '', // 模板名称
        nameError: '',
        fields: ['province', 'city', 'region'], // 数据库字段
        template: [
          {fieldName: '', columnName: '', fieldError: '', columnError: ''}
        ] // 数据库字段对应excel列名
      };
    },
    components: {},
    methods: {
      addColumn () {
        this.template.push({fieldName: '', columnName: '', fieldError: '', columnError: ''});
      },
      validate () {
        let result = true;
        if (!this.name) {
          this.nameError = '请输入模板名称';
          result = false;
        } else {
          this.nameError = '';
        }
        this.template.forEach(ele => {
          if (!ele.fieldName) {
            ele.fieldError = '请选择表字段';
            result = false;
          } else {
            ele.fieldError = '';
          }
          if (!ele.columnName) {
            ele.columnError = '请填写别名';
            result = false;
          } else {
            ele.columnError = '';
          }
        });
        return result;
      },
      submit () {
        if (!this.validate()) {
          return false;
        }
        console.log(this._data);
      }
    },
    created () {
      utils.setTitle.call(this, '表格模板');
    }
  };
</script>
