<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
            console.log('App Launch')
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    });
</script>

<style lang="scss">
    /*每个页面公共css */
  page {
    background-color: #F5F5F5;
  }
  .theme-style__button {
    border-radius: 2em !important;
    background: linear-gradient(to right, #ff5000, #ff9000)
    #ff9000;
    color: #fff !important;
  }
</style>
