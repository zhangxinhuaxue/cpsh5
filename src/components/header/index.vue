<template>
    <hybrid-header :config="barConfig" class="oldheader"></hybrid-header>
</template>
<script type="text/javascript">
import {
    appShare
} from 'libs/share'
import hybridHeader from './hybridheader.vue'
export default {
    name: 'axdHeader',
    data() {
        return {
            barConfig: {
                action: 'appShare',
                leftAction: this.topBar.leftbuttonAction,
                h5: {
                    visible: true,
                    rightBtnShow: false,
                    text: '分享'
                },
                app: {
                    visible: true,
                    rightBtnShow: true,
                    rightBtn: 'close',
                    leftbuttonAction: this.topBar.leftbuttonAction,
                    shareInfo: {
                        title: '',
                        info: '',
                        img: '',
                        url: ''
                    }
                }
            }
        }
    },
    props: {
        topBar: {
            type: Object,
            default: () => {
                return {
                    barshow: 'true',
                    title: document.title || '招集令',
                    backgroundColor: '%23ffffff',
                    displaySharebutton: false
                }
            }
        }
    },
    components: {
        hybridHeader
    },
    mounted() {
        window.appShare = appShare
        if (this.topBar.displaySharebutton) {
            this.barConfig.h5.rightBtnShow = true

            this.barConfig.app.rightBtn = 'share'
            Object.assign(this.barConfig.app.shareInfo, window.AXDShareConfig)
        }
    }
}
</script>
<style lang="scss">
.oldheader {
    position: relative;
}
</style>
