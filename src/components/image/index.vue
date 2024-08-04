<template>
    <div type="img" v-if="imgUrl" :class="parentClassName" :style="style">
        <template v-if="islazy">
            <img v-if="lazyParents" v-lazy.lazyContent="imgUrl" :alt="alt" :class="[imgClass, imgOther]" />
            <img v-else v-lazy="imgUrl" :alt="alt" :class="[imgClass, imgOther]" />
        </template>
        <img v-else :src="imgUrl" :alt="alt" :class="[imgClass, imgOther]" />
    </div>
</template>
<script>
import {
    formatImg,
    formatImgWH
} from 'src/libs/util'
export default {
    replace: true,
    name: 'aym-image', // 这里不要直接写image
    props: {
        src: {
            type: String,
            default: ''
        },
        alt: {
            type: String,
            default: 'aiyoumi image'
        },
        lazy: {
            default: 'true'
        },
        size: {
            type: String,
            default: '85'
        },
        parentClassName: {
            type: String,
            default: ''
        },
        imgClass: {
            type: String,
            default: ''
        },
        lazyParents: {
            type: String,
            default: ''
        },
        resizeW: {
            type: Number
        },
        resizeH: {
            type: Number
        },
        fixWH: {
            type: Boolean
        }
    },
    data() {
        return {
            widthHeight: [],
            deviceWidth: 0,
            useHeight: false,
            imgOther: '',
            style: null
        }
    },
    computed: {
        islazy() {
            return this.lazy === 'true'
        },
        imgUrl() {
            return formatImg(this.src, this.size, this.resizeW, this.resizeH)
        }
    },
    beforeMount() {
        let wh = formatImgWH(this.src)
        if (wh) {
            this.widthHeight = wh
        }
        this.deviceWidth = window.innerWidth
        if (this.$parent && this.$parent.config && this.$parent.config.useHeight) {
            this.useHeight = true
        }

        if (this.fixWH) {
            this.useHeight = true
        }
    },
    mounted() {
        //  解决在aui-content里监听不到scroll事件
        if (this.lazyParents) {
            let parents = document.querySelector(this.lazyParents)
            let id = window.document.getElementById('lazyContent')

            if (parents && !id) {
                parents.id = 'lazyContent'
            }
        }

        let backgroundColor = ''
        if (!this.lazy) {
            backgroundColor = 'transparent'
        }
        if (this.deviceWidth && this.widthHeight.length && this.useHeight) {
            let imgWidth = parseInt(this.widthHeight[0])
            let imgHeight = parseInt(this.widthHeight[1])

            // let height = (parseInt(this.widthHeight[1]) * 16 / imgWidth) + 'rem'
            // let width = (parseInt(this.widthHeight[0]) * 16 / imgWidth) + 'rem'
            // 判断imgWidth是否超过750
            if (imgWidth > 750) {
                imgHeight = 750 * imgHeight / imgWidth
                imgWidth = 750
            }
            let width = imgWidth / 750 * 16 + 'rem'
            let height = imgHeight / 750 * 16 + 'rem'
            this.imgOther = 'img_absolute'
            this.style = {
                height,
                width,
                backgroundColor
            }
        } else {
            this.style = {
                backgroundColor
            }
        }
    }
}
</script>
<style lang="scss" scoped>
div {
    position: relative; // background-color: #fff;
}

.img_absolute {
    position: absolute;
    left: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 100%;
    height: auto;
}

/* 加渐显效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.animation__fade {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-fill-mode: both;
}
</style>
