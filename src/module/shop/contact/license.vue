<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content white_bg">
            <img-code v-if="!showLicenseImg" @complate="checkImgCode"></img-code>
            <img-license v-else :code="code"></img-license>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import imgCode from './license/img-code.vue'
import imgLicense from './license/img-license.vue'
export default {
    name: 'groupList',
    data() {
        return {
            barConfig: {},
            showLicenseImg: false,
            code: ''
        }
    },
    // activated() {
    //     this.showLicenseImg = false
    // },
    components: {
        hybridHeader,
        imgCode,
        imgLicense
    },
    methods: {
        checkImgCode(code) {
            this.code = code
            this.showLicenseImg = true
        }
    }
}
</script>
<style lang="scss" scoped>
.white_bg {
    background-color: #fff;
}
</style>
