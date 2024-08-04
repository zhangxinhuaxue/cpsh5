<template>
  <div class="aui-page">
    <hybrid-header />
    <div class="aui-content" v-html="content"></div>
  </div>
</template>
<script>
export default {
    name: 'detail',
    computed: {
        content() {
            return this.$route.params.content
        }
    },
    created() {
        document.title = this.$route.params.title
    }
}
</script>
<style lang="scss" scoped>
@import "src/style.scss";
.aui-content {
  background: #fff;
  padding: px2rem(40) px2rem(32);
  color: #666;
  font-size: px2rem(30);
  margin-top: px2rem(15);
}
</style>