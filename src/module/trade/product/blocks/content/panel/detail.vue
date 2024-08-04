<!--
    created by yangjun in May 18, 2017
-->
<template>
    <div class="panel__contentItem">
        <div v-if="oriContent" :style="jdStyle">
            <div class="content-frame" :style="jdFrameStyle" v-html="content">
            </div>
        </div>
        <!-- <img class="quality-sure" @click="openQuality" src="https://img.aiyoumi.com/null/20170117/102704386/20171107102704_750x476.jpg?height=476&width=750"> -->
    </div>
</template>
<script>
/* global Image, alert */
import { mapState } from 'vuex'
export default {
    name: 'detail',
    data() {
        return {
            jdStyle: '',
            jdFrameStyle: ''
        }
    },
    computed: {
        ...mapState('trade', {
            defaultImg: state => state.product.defaultData.defaultImg,
            productType: state => state.product.initData.shop.type,
            oriContent: state => state.product.initData.desc.content
        }),
        content() {
            let content = this.oriContent
            if (typeof content == 'string' && content.length > 0) {
                // 域名过滤
                content = content.replace(/http\:\/\/img\.yzcdn\.cn/g, 'https://dn-kdt-img.qbox.me')
                content = content.replace(/http\:\/\/imgqn\.koudaitong\.com/g, 'https://dn-kdt-img.qbox.me')
                content = content.replace(/src="([^"\s]*)"/gi, (word, url) => {
                    return 'src="' + this.defaultImg + '" oriSrc="' + this.formatImg(url) + '"'
                })
                if (this.productType == 'JD') {
                    content = content.replace(/href=([^\s]*)/gi, (word, url) => {
                        if (url.indexOf('.css') != -1) {
                            return 'href=' + url
                        } else {
                            return 'href="javascript:void(0)"'
                        }
                    })
                    // 京东商品图片链接都添加dpg后缀 降低图片大小，提升图片质量
                    content = content.replace(/(360buyimg.com\/[0-9a-zA-Z\/]*\.jpg)/g, '$1.dpg')
                }
            }
            this.$nextTick(() => {
                this.preLoadContentImg()
                if (this.productType == 'JD') {
                    // eslint-disable-next-line vue/no-async-in-computed-properties
                    setTimeout(() => {
                        this.computedLayout()
                    }, 0)
                }
            })
            return content
        }
    },
    methods: {
        preLoadContentImg() {
            let imgElems = document.querySelectorAll('[oriSrc]')
            for (let i = 0; i < imgElems.length; i++) {
                let e = imgElems[i]
                let src = e.getAttribute('oriSrc')
                let newImg = new Image()
                newImg.src = src
                newImg.onload = function() {
                    e.setAttribute('src', src)
                }
            }
        },
        computedLayout() {
            // 通过skudesign属性的存在与否，决定是否进行相应计算
            let sizeObj1 = this.computedM1()
            let sizeObj2 = this.computedM2()
            if (!sizeObj1 && !sizeObj2) {
                return
            }
            let sizeObj = sizeObj1 || sizeObj2

            let cHeight = sizeObj.cHeight
            let cWidth = sizeObj.cWidth
            let windowWidth = window.innerWidth
            let marginWidth = (32 * windowWidth / 750 * 2)

            let realWidth = windowWidth - marginWidth
            let scale = realWidth / cWidth
            let windowHeight = cHeight * scale
            this.jdStyle = 'width: ' + realWidth + 'px; height: ' + windowHeight + 'px; overflow: hidden; '
            this.jdFrameStyle = 'transform-origin: 0px 0px 0px; transform: scale(' + scale + ');'
        },
        computedM1() {
            let isComputeNeeded = Boolean(document.querySelector('[skudesign]'))
            if (!isComputeNeeded) {
                return false
            }
            let jdContentElem = document.querySelector('.ssd-module-wrap')
            let cHeight = jdContentElem.clientHeight
            let cWidth = jdContentElem.clientWidth
            return {
                cHeight,
                cWidth
            }
        },
        computedM2() {
            let jdContentElem = document.querySelectorAll('table[id=__01]')
            if (!jdContentElem.length) {
                return false
            }
            let cHeight = 0
            for (let i = 0; i < jdContentElem.length; i++) {
                let item = jdContentElem[i]
                cHeight += item.clientHeight
            }

            let cWidth = jdContentElem[0].clientWidth
            return {
                cHeight,
                cWidth
            }
        },
        openQuality() {
            window.location.href = '/cms/renderPage?alias=real'
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.panel__contentItem {
    margin: px2rem(32);
    font-size: px2rem(28);
}

.quality-sure {
    margin-top: px2rem(20);
}
</style>
