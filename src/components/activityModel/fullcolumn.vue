<!--
    log:
    2017/04/25 limeng
    添加了可以支持是否需要登录的通栏，譬如通栏A，可以设置A的链接是需要登录才能进入

    2017/07/10 limeng
    添加了关于url的判断，app下如果url属于商详页，使用goUrl打开

    2017/12/11 limeng
    添加弹出分享的逻辑 NATIVE_OPEN_SHARE
    添加分享到朋友圈的逻辑 NATIVE_SHARE_TO_WXTIMELINE
-->
<template>
    <div :style="styleObject" type="fullcolumn" :class="isFloor">
        <swipe-column v-if="slide" :swipe-data='imgList' :config='swipeConfig' :otherName="otherClass"></swipe-column>
        <a v-else @click="jump">
            <axd-image :src="imgList[0].img"></axd-image>
            <!-- <img v-lazy="imgList[0].img"> -->
        </a>
    </div>
</template>
<script>
import {
    formatImg,
    formatColor
} from 'src/libs/util'
import swipeColumn from 'components/swipe/swipe-column.vue'
import axdImage from 'src/components/image/index.vue'
import { AXD } from 'src/libs/util'
import { appShare } from 'libs/share'
import { saveAym } from 'src/store/api'
import { accessLog } from 'src/libs/accessLog'

export default {
    name: 'fullcolmn',
    props: {
        config: Object,
        // 自定义登录, 默认值走非自定义登录逻辑
        customLoginParam: {
            type: Object,
            default: () => {
                return {
                    isCustomLogin: false,
                    customLogin: function() {}
                }
            }
        }
    },
    data() {
        return {
            otherClass: 'column-' + parseInt(Math.random() * 1000)
        }
    },
    components: {
        swipeColumn,
        axdImage
    },
    computed: {
        // 如需要把标题添加到楼层里，则类名为floor
        isFloor() {
            return this.config.floorShow && this.config.floorShow === 'y' ? 'floor' : null
        },
        swipeConfig() {
            return {
                autoplay: 2500,
                autoplayDisableOnInteraction: false,
                speed: 500,
                pagination: '.swiper-pagination',
                paginationType: 'bullets',
                loop: true
            }
        },
        styleObject() {
            return {
                backgroundColor: formatColor(this.config.bgColor)
            }
        },
        slide() {
            return this.config.objList.length > 1
        },
        imgList() {
            for (var item of this.config.objList) {
                item.img = formatImg(item.img)
            }
            return this.config.objList
        }
    },
    methods: {
        jump() {
            accessLog({type: 'button-link', name: 'cms-page-access', desc: '图片点击跳转'})
            let configUrl = this.config.objList[0].url

            if (this.config.needLogin) {
                AXD.util.login(this.customLoginParam)
            } else {
                // 判断configUrl是否为商品详情的链接，如果是商详页，则在app下使用goUrl打开
                let isProduct = (configUrl.indexOf('/product/detail.html?') >= 0 || configUrl.indexOf('/pages/mall/product/') >= 0)

                if (window.aixuedai && window.aixuedai.isUavoApp === 'y') {
                    // 在app下
                    if (isProduct) {
                        // 将要打开商详页，判断url是否包含域名，如果没有包含就加上域名
                        if (configUrl.indexOf('http') < 0) {
                            configUrl = window.location.origin + configUrl
                        }
                        saveAym(encodeURIComponent(configUrl))
                        AXD.util.goURL({
                            url: configUrl,
                            rootPage: 0
                        })
                    } else {
                        if (configUrl === 'NATIVE_OPEN_SHARE') {
                            // 调用分享面板
                            appShare('', (ret) => {})
                        } else if (configUrl === 'NATIVE_SHARE_TO_WXTIMELINE') {
                            // 分享到朋友圈
                            axdApp.send({
                                module: 'tools',
                                method: 'shareWxTimeline',
                                params: window.AXDShareConfig,
                                callback: (data) => {}
                            })
                        } else {
                            window.location.href = configUrl
                        }
                    }
                } else {
                    window.location.href = configUrl
                }
            }
        }
    }
}
</script>
