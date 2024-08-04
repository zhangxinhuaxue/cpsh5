<!--
    Created by limeng on 05/05/17
    Des: 页面导航模块
-->
<template>
    <div class="navigator-bottom" v-if="show">
        <div id="navigator_bg">
            <axd-image :src="backgroundImg" :lazy="false"></axd-image>
            <ul>
                <li v-for="item in menus" :style="itemStyle"><a :href="item"></a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import axdImage from 'src/components/image/index.vue'

export default {
    name: 'navigation',
    props: {
        config: Object
    },
    data() {
        return {
            show: false,
            menus: [],
            backgroundImg: '',
            itemStyle: {
                width: '25%'
            }
        }
    },
    beforeMount() {
        this.initData()
        this.checkHeight()
    },
    methods: {
        checkHeight() {
            let me = this
            window.setTimeout(() => {
                let clientHeight = document.documentElement.clientHeight
                let bodyHeight = document.body.offsetHeight

                if (clientHeight >= bodyHeight) {
                    // 如果页面没有滚动条，将导航菜单直接显示
                    me.show = true
                } else if (bodyHeight >= 2 * clientHeight) {
                    window.addEventListener('scroll', me.handleScroll(true))
                } else {
                    window.addEventListener('scroll', me.handleScroll(false))
                }
                document.body.style.paddingBottom = '2.56rem'
            }, 1500)
        },
        handleScroll(b) {
            let me = this
            return () => {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                let clientHeight = document.documentElement.clientHeight

                b ? me.show = (scrollTop >= clientHeight) : me.show = true
            }
        },
        initData() {
            if (this.config && this.config.objList) {
                try {
                    let obj
                    typeof this.config.objList === 'string' && (obj = JSON.parse(this.config.objList))
                    typeof this.config.objList === 'object' && (obj = this.config.objList)

                    this.menus = obj.url
                    this.backgroundImg = obj.navImgUrl
                    this.itemStyle.width = (100 / obj.url.length) + '%'
                } catch (e) {
                    console.log(e)
                }
            }
        }
    },
    components: {
        axdImage
    }
}
</script>

<style lang="scss">
    @import 'style.scss';
    $designWidth: 750;
    .navigator-bottom {
        position: fixed;
        z-index: 999;
        width: 100%;
        bottom: 0;
        left: 0;

        div {
            position: relative;
            width: 100%;
        }
        ul {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            li {
                height: 100%;
                float: left;
            }
            a {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
