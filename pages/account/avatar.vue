<style scoped>
  @import "../../assets/css/base.pcss";
  @import "../../assets/css/vars.pcss";
  .container {
    background-color: #fff;
    .outer {
      @mixin flex-column;
      padding: 10px;
      .img {
        border: var(--border);;
        margin: 1em auto;
        height: 300px;
        width: 100%;
        background-color: var(--gray-back);;
        /deep/ .vue-cropper {
          .cropper-view-box {
            display: block;
            overflow: hidden;
            width: 100%;
            height: 100%;
            outline: 1px solid #39f;
            outline-color: rgba(51, 153, 255, 0.75);
            user-select: none;
            position: relative;
            img {
              user-select: none;
              text-align: left;
              max-width: none;
              max-height: none;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
      }
      .btn {
        @mixin flex-row;
      }
    }
  }
</style>
<template>
  <div class="container">
    <div class="outer">
      <div class="img">
        <vue-cropper ref="cropper" :img="avatar" :outputSize="1" outputType="png"
                     :auto-crop-width="120" :auto-crop-height="120" fixed auto-crop :canMove="false"></vue-cropper>
      </div>
      <div class="btn">
        <mu-button class="select" @click="selectImg">选择本地照片</mu-button>
        <input id="file" type="file" style="display: none;" @change="getSrc($event)">
        <mu-button class="upload" color="success" @click="upload">上传</mu-button>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from 'utils';
  import account from 'account';
  import VueCropper from 'vue-cropper';
  export default {
    data () {
      return {
        avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=597577667,523773204&fm=26&gp=0.jpg'
      };
    },
    components: {
      VueCropper
    },
    methods: {
      selectImg () {
        document.getElementById('file').click();
      },
      getSrc (e) {
        console.log(e);
        this.avatar = window.URL.createObjectURL(e.target.files[0]);
      },
      upload () {
        this.$refs.cropper.getCropData((data) => {
          account.editInfo({head: data})
            .then(res => {
              const cb = () => {
                this.avatar = data;
                this.$toast.success('修改成功');
                this.$router.go(-1);
              };
              utils.dealResponse.call(this, res, cb);
            })
            .catch(err => {
              utils.dealError.call(this, err);
            });
        });
      }
    },
    mounted () {
      utils.setTitle.call(this, '上传头像');
    }
  };
</script>
