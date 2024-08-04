<!--
    Create by sunxj on 08/09/17
 -->
<template>
    <div>
        <a v-if="showShare === 1" @click.stop.prevent="goUrl(shareInfo.url, $event)" :href="shareInfo.url">
            <axd-image :src="shareInfo.img"></axd-image>
        </a>
        <a @click="share" v-if="showShare === 2">
            <axd-image :src="shareInfo.img"></axd-image>
        </a>
        <axd-image v-if="showShare === 3" :src="shareInfo.img"></axd-image>
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { resetHeader } from 'components/header/resetHeader'
import { appShare } from 'src/libs/share'
import { getShareCon } from 'src/store/modules/trade/payResult'
import { appDownloadUrl } from 'libs/util'
export default {
    name: 'share',
    props: {
        shareInfo: {
            type: Object
        }
    },
    data() {
        return {
            config: {
                useHeight: true
            }
        }
    },
    computed: {
        showShare() {
            if (this.shareInfo.url) {
                return 1
            } else if (this.shareInfo.id) {
                return 2
            } else {
                return 3
            }
        }
    },
    methods: {
        goUrl(url) {
            resetHeader()
            // 支付成功页banner埋点
            window.location.href = url
        },
        share() {
            if (this.isApp) {
                let tradeId = this.$route.params.tradeId || ''
                getShareCon({
                    shareConfId: this.shareInfo.id,
                    tradeId: tradeId,
                    sign: this.shareInfo.sign
                }).then((res) => {
                    if (res.success && res.result) {
                        let result = res.result
                        window.AXDShareConfig = {
                            title: result.title,
                            info: result.content,
                            img: result.shareImg,
                            url: result.url
                        }
                        appShare()
                    }
                })
            } else {
                window.location.href = appDownloadUrl
            }
        }
    },
    components: {
        axdImage
    }
}
</script>
