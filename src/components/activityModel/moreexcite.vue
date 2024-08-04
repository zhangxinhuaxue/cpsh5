<!--
    2017-07-10
    修改图片的打开链接方式
-->
<template>
    <div type="more-excite" :class="isFloor">
        <!-- moreExcite start  -->
        <div class="more-bg" :style="{ background: bgColor}">
            <template v-if="this.config.img">
                <axd-image :src="this.config.img" :lazyParents="lazyParents"></axd-image>
            </template>
            <div class="more-list clearfix">
                <div :class="['clearfix', blockLayoutStyle]">
                    <a v-for='m in config.objList' @click="gotoLink(m.url)" href="javascript:" class="img-wid">
                        <axd-image :src="m.img" :lazyParents="lazyParents"></axd-image>
                    </a>
                </div>
            </div>
        </div>
        <!-- moreExcite end -->
    </div>
</template>
<script>
import {
    formatColor
} from 'src/libs/util'
import {
    AXD
} from 'src/libs/util'
import axdImage from 'src/components/image/index.vue'
import { saveAym } from 'src/store/api'

export default {
    name: 'more-excite',
    props: {
        config: Object,
        lazyParents: String
    },
    components: {
        axdImage
    },
    computed: {
        // 如需要把标题添加到楼层里，则类名为floor
        isFloor() {
            return this.config.floorShow && this.config.floorShow === 'y' ? 'floor' : null
        },
        bgColor() {
            return formatColor(this.config.bgColor)
        },
        blockLayoutStyle() {
            if (this.config.blockLayoutStyle === 'more_excite_row4') {
                return 'four-row'
            } else if (this.config.blockLayoutStyle === 'more_excite_row13') {
                return 'one-three'
            } else if (this.config.blockLayoutStyle === 'more_excite_row3') {
                return 'three-row'
            } else {
                return 'two-row'
            }
        }
    },
    methods: {
        gotoLink(link) {
            let isProduct = (link.indexOf('/product/detail.html?') >= 0 || link.indexOf('/pages/mall/product/') >= 0)

            if (window.aixuedai && window.aixuedai.isUavoApp === 'y') {
                // 在app下
                if (isProduct) {
                    // 将要打开商详页，判断url是否包含域名，如果没有包含就加上域名
                    if (link.indexOf('http') < 0) {
                        link = window.location.origin + link
                    }
                    saveAym(encodeURIComponent(link))
                    AXD.util.goURL({
                        url: link,
                        rootPage: 0
                    })
                } else {
                    window.location.href = link
                }
            } else {
                window.location.href = link
            }
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
div[type='more-excite'] {
    overflow: hidden;
}
.more-list {
    &>div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }
    img {
        width: 100%;
    }
    .two-row {
        // padding-bottom: px2rem(10);
        .img-wid {
            // float: left;
            // display: inline-block;
            width: 50%;
            overflow: hidden;
        }
    }
    .three-row {
        // padding-bottom: px2rem(10);
        .img-wid {
            // float: left;
            // display: inline-block;
            width: 33.3%;
        }
    }
    .four-row {
        // padding-bottom: px2rem(10);
        .img-wid {
            // float: left;
            // display: inline-block;
            width: 25%;
        }
    }
    .one-three {
        display: block;
        // padding-bottom: px2rem(10);
        .img-wid {
            float: left;
            display: inline-block;
            height: px2rem(130);
            overflow: hidden;
            width: px2rem(190);
            height: px2rem(190);
            &:first-child {
                width: px2rem(260);
                height: px2rem(400);
            }
            &:nth-child(2) {
                width: px2rem(380);
                height: px2rem(210);
            }
            img {
                height: 100%;
            }
        }
    }
}
</style>
