<style scoped>
  @import "../assets/css/base.pcss";
  @import "../assets/css/vars.pcss";
  .container {

  }
</style>
<template>
  <div class="container">
    <mu-card>
      <mu-card-header>
        <mu-avatar slot="avatar">
          <img :src="img">
        </mu-avatar>
      </mu-card-header>
      <mu-card-media>
        <img :src="img">
      </mu-card-media>
      <mu-card-title :title="title" :sub-title="time"></mu-card-title>
      <mu-card-text>{{content}}</mu-card-text>
    </mu-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      title: 'Content Title\n',
      time: 'Content Title\n',
      img: 'https://muse-ui.org/img/sun.a646a52d.jpg',
      content: '散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。 调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。 似乎在诉说着，我也可以在漆黑的角落里，找到阴影背后的阳光， 找到阳光与阴影奏出和谐的旋律。我要用一颗敏感赤诚的心迎接每一缕滑过指尖的阳光！\n',
    };
  },
  components: {},
  methods: {},
  created() {
    let id = this.$route.query.id;
    console.log(id);
  },
};
</script>
