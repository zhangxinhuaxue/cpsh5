<template></template>
<script>
/* window.AXDShareConfig */
import {AXD} from 'libs/util'
import {weixinShareConf} from 'libs/share'
// 设置用户分享的数据 默认数据从cms后台配置的地方获取 【分享的标题、描述、url, 图片】
export default {
    name: 'share',
    props: {
        config: Object
    },
    created() {
        // 首先配置页面分享的基本信息
        if (this.config) {
            window.AXDShareConfig = {
                'title': this.config.title,
                'info': this.config.desc || '年轻人分期购物首选网站、专门服务年轻人的分期消费品牌',
                'url': this.config.url,
                'img': this.config.img
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            // meta name="description" content 为 shareDesc
            let meta = document.getElementsByTagName('meta')
            let shareDesc = window.AXDShareConfig.info

            for (let val of meta) {
                if (val.name.toLowerCase() === 'description') {
                    val.setAttribute('content', shareDesc)
                    break
                }
            }
        })

        // 处理微信的分享，如果在非app情况下，调用微信的分享
        if (AXD.util.isWeixin() || AXD.util.isQQBrowser()) {
            weixinShareConf()
        }
    }
}
</script>
