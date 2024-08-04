<template>
    <div style="width:0; height:0;display:none">
        <img :src="shareImgFormated" alt="招集令Logo" />
    </div>
</template>
<script>
import {
    formatImg
} from 'src/libs/util'
export default {
    name: 'shareLogo',
    data() {
        return {
            shareImg: '//img.aiyoumi.com/null/201601220/205329861/20161220205329.png'
        }
    },
    computed: {
        shareImgFormated() {
            return this.shareImg ? formatImg(this.shareImg) : ''
        }
    },
    mounted() {
        if (window.AXDShareConfig && window.AXDShareConfig.img) {
            this.shareImg = window.AXDShareConfig.img.replace('http://aixuedaiimg.oss-cn-hangzhou.aliyuncs.com', 'http://img.aiyoumi.com')
        }
    }
}
</script>
