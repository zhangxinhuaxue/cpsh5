<template>
    <div class="page-error">
      <hybrid-header ></hybrid-header>
        <div class="page__main">
            <div class="page__img"></div>
            <p class="page__desc">
                很抱歉，服务器出现故障了
            </p>
            <m-button class="page__button" :round="false"   @click="handleBack">返回</m-button>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'PageError',
    created() {},
    components: {},
    methods: { 
        handleBack(){
            this.$router.back()
        }
    }
}
</script>
<style lang="scss" scoped>
.page-error {
    height: 100%;
  position: relative;
}
.page__main {
    width: 100%;
    text-align: center;
    font-size: px2rem(32);
    color: #999;
    font-weight: 600;
    position: absolute;
    top: 20%;
}
.page__img {
    width: px2rem(320);
    height: px2rem(320);
    margin: 0 auto;
    // background: url(http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/28150315443.png) -0.42667rem
    background: url('../assets/images/error.png') 
        no-repeat;
    background-size: 100% 100%;
}
.page__desc {
    margin-top:px2rem(32);
}
.page__button{
    margin-top: px2rem(40);
    ::v-deep &.mui-btn_primary {
        color: #fff;
        background: var(--auiColorPrimary);
        border-color: var(--auiColorPrimary);
        padding: 0 px2rem(20);
        width: px2rem(200);
        height:px2rem(80);
        line-height:px2rem(80);
    }
}
</style>
