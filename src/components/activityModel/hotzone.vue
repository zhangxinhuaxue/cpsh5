<!--
    created:  by mahui on 20170911
    desc: 热区模块，一个热区模块有多个背景图，一个背景图对应着多个热区，点击每个热区，打开相应链接
-->
<template>
    <ul :class="isFloor" type="hotzone" :style="floorBg">
        <li v-for="(item, index) in config.objList" :key="index">
            <img :src="item.bgImg" :usemap="useMap(index)" :class="generateMapId(index)">
            <map :name="generateMapId(index)" :id="generateMapId(index)">
                <template v-for="(hotarea, idx) in item.hotArea">
                    <area shape="rect" :coords="hotarea.coords | formatCoords(item, index)" :key="idx" href="javascript:;" @click="goHotUrl(hotarea)">
                </template>
            </map>
        </li>
    </ul>
</template>

<script>
import {formatColor, formatImgWH} from 'src/libs/util'
import {AXD, getCookie} from 'src/libs/util'
import { accessLog } from 'src/libs/accessLog'
export default {
    name: 'hotzone',
    props: ['config', 'callbackFunc'],
    data() {
        return {
            isApp: (aixuedai.isUavoApp === 'y')
        }
    },
    filters: {
        formatCoords(coords, obj, index) {
            // 求坐标缩放比例
            let wh = formatImgWH(obj.bgImg)

            let scale = document.body.clientWidth / wh[0]

            // 适应屏幕大小尺寸
            return coords.map(item => scale * item).join(',')
        }
    },
    computed: {
        // 如需要把标题添加到楼层里，则类名为floor
        isFloor() {
            return this.config.floorShow && this.config.floorShow === 'y' ? 'floor' : null
        },
        floorBg() {
            return {
                backgroundColor: formatColor(this.config.bgColor)
            }
        }
    },
    created() {
    },
    methods: {
        generateMapId(index) {
            return 'map' + this.config.id + index
        },
        useMap(index) {
            return '#map' + this.config.id + index
        },
        goHotUrl(hotarea) {
            accessLog({type: 'button-link' , name: 'cms-page-access', desc: '图片点击跳转'})
            
            let {url, isLogin} = hotarea

            // 自定义热区模块的回调函数
            if (this.callbackFunc) {
                this.callbackFunc.call(null, hotarea)
                return
            }

            let newUrl = url
            // app协议打不开相对链接，所以这边要转换成全链接
            if (newUrl.indexOf('https://') === -1 && newUrl.indexOf('http://') === -1) {
                newUrl = window.location.origin + newUrl
            }
            // 无需登录
            if (!isLogin || isLogin === 'n') {
                this.doUrl(newUrl)
            } else {
                let catCookie = getCookie('cat')
                let urlSymbol = url.indexOf('?') > -1 ? '&' : '?'
                if (this.isApp) {
                    axdApp.send({
                        module: 'user',
                        method: 'isLogin',
                        callback: (ret) => {
                            if (ret.data && ret.data.result == 'true') {
                                this.doUrl(newUrl + urlSymbol + 'cat=' + catCookie)
                            } else {
                                AXD.util.smsLogin({url: newUrl + urlSymbol + 'cat=true'})
                            }
                        }
                    })
                } else {
                    if (!catCookie) {
                        AXD.util.smsLogin({url: newUrl + urlSymbol + 'cat=true'})
                    } else {
                        this.doUrl(newUrl + urlSymbol + 'cat=' + catCookie)
                    }
                }
            }
        },
        doUrl(newUrl) {
            if (window.aixuedai.isUavoApp === 'n') {
                window.location.href = newUrl
            } else {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: newUrl,
                        rootPage: 0
                    },
                    callback() {}
                })
            }
        }
    }
}
</script>
