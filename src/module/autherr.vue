<template>
    <div class="err_page">
        <p class="err_logo"></p>
        <p class="err_tip-title">居然到了这个页面</p>
        <p class="err_tip-subtitle">我们出了点状况~</p>
        <a class="err_btn" :href="returnUrl">返回</a>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'errorTip',
    data() {
        return {
            downloadUrl: window.aixuedai.appDownloadUrl || 'javascript:'
        }
    },
    computed: {
        returnUrl() {
            return this.$route.query.url ? this.$route.query.url : this.downloadUrl
        }
    }
}
</script>
<style>
.err_btn,
.err_page p {
    text-align: center;
}

.err_page {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 3.41333rem;
    z-index: 9999;
}

.err_logo {
    width: 7rem;
    height: 7rem;
    background: url(https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202009/13115714346.png) 0 center no-repeat;
    background-size: cover;
    margin: 0 auto;
}

.err_tip-title {
    font-size: .768rem;
    color: #222;
    line-height: .85333rem;
    margin-top: .64rem;
}

.err_tip-subtitle {
    font-size: .568rem;
    color: #999;
    line-height: .85333rem;
    margin-top: .64rem;
}

.err_tip-content {
    width: 11.73333rem;
    margin: 0 auto;
    font-size: .64rem;
    color: #666;
    line-height: .85333rem;
    padding-top: .21333rem;
}

.err_btn {
    width: 7.736rem;
    height: 1.49333rem;
    margin: .64rem auto 0;
    border: 1px solid #F99E00;
    border-radius: 2.13333rem;
    font-size: .59733rem;
    color: #F99E00;
    line-height: 1.49333rem;
    display: block
}

.top88 {
    top: 1.87733rem;
}

</style>
