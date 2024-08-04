<template>
    <div v-if="!noData">
        <div class="plugin-mask" v-if="showMask" @click="close"></div>
        <div class="plugin-box">
            <div class="plugin-more-box" v-if="showMask">
                <h2 class="title"></h2>
                <div class="plugin-close" @click="close">
                    <span></span>
                </div>
                <div class="plugin-more" v-html="moreHTML"></div>
            </div>
            <div class="plugin-foot" v-if="show" v-bind:style="footerStyle">
                <ul>
                    <li v-for="item in menus" @click="goto(item)"><a :href="item.url"></a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {_post} from 'src/store/base'
import {AXD} from 'libs/util'
import * as filters from 'src/libs/util/format'

export default {
    name: 'bottommenu',
    props: {
        listName: String
    },
    data() {
        return {
            menus: [],
            show: false,
            showMask: false,
            footerStyle: {},
            moreHTML: '',
            isApp: AXD.util.isapp(),
            noData: false
        }
    },
    beforeMount() {
        window.addEventListener('scroll', this.handleScroll)
        this.fetchData()
        this.handleScroll()
    },
    mounted() {
        // 如果配置了该模块，则要给页面加样式~
        let domEle = document.querySelector('#pageContent')
        domEle.className += ' has-bottom-menu'
    },
    methods: {
        fetchData() {
            let me = this
            _post('/plist/plistByIdOrName', {
                type: 'name',
                idOrName: me.listName,
                needAll: 'true'
            }, (data) => {
                data = data.ret || data
                data.success
                    ? me.renderHtml(data)
                    : me.noData = true
            })
        },

        renderHtml(data) {
            let me = this
            if (data.result && data.result.length) {
                let result = data.result
                let rLength = result.length
                let i = 0
                let num = 4
                let moreHtml = '<ul class="clearfix">'

                for (; i < rLength; i++) {
                    // 第一个为背景
                    if (i === 0) {
                        me.footerStyle = {
                            'background-image': 'url(' + result[0].productImgUrl + ')',
                            'background-size': '100% 100%'
                        }
                        if (result[0].int1 && result[0].int1 > 0) {
                            num = result[0].int1 - 0
                        }
                    } else if (i > 0 && i < num && result[i].url && result[i].varchar1) {
                        // 这几个为tab的html
                        me.menus.push({
                            url: me.isApp ? result[i].url : result[i].varchar1
                        })
                    } else if (i === num && result[i].url && result[i].varchar1) {
                        // 更多内容是否为可点击
                        me.menus.push({
                            url: me.isShow(result[i]) ? 'javascript:' : (me.isApp ? result[i].url : result[i].varchar1)
                        })
                    } else if (i >= num + 1 && result[i].url && result[i].varchar1) {
                        // 这些是更多内容的html
                        moreHtml += '<li><a href="' +
                            (me.isApp ? result[i].url : result[i].varchar1) + '"><img src="' + filters.formatImg(result[i].productImgUrl) + '"/></a></li>'
                    }
                }

                moreHtml += '</ul>'
                me.moreHTML = moreHtml
            } else {
                me.show = false
                me.showMask = false
                me.noData = true
            }
        },

        isShow(data) {
            if (data.varchar2) {
                return data.varchar2 !== ''
            } else {
                return false
            }
        },
        close() {
            this.showMask = false
        },
        handleScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            let clientHeight = document.documentElement.clientHeight

            if (scrollTop >= clientHeight) {
                this.show = true
                this.showMask = false
            } else {
                this.show = false
                this.showMask = false
            }
        },
        goto(m) {
            if (m.url === 'javascript:') {
                this.showMask = !this.showMask
            }
        }
    }
}
</script>

<style lang="scss">
    @import 'src/assets/styles/style.scss';
    $designWidth: 750;
    // 样式覆盖
    .has-bottom-menu {
        padding-bottom: px2rem(126);
    }

    .has-bottom-menu .gotop {
        z-index: 1230;
    }
    .plugin-box {
        width: px2rem(750);
        height: auto;
        position: fixed;
        z-index: 1230;
        bottom: 0;
        left: 0;
        background: transparent no-repeat;
        background-size: 100% 100%;
        -webkit-background-size: 100% 100%;
        .plugin-foot {
            width: px2rem(750);
            height: px2rem(125);
            position: absolute;
            bottom:0;
            left: 0;
            z-index: 310;
            background-color: transparent;
            li{
                display: inline-block;
                width: 25%;
                height: px2rem(125);
                a {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .plugin-more-box {
            width: 100%;
            height: auto;
            bottom: px2rem(125);
            background-color: transparent;
            margin-bottom:px2rem(126);
            .plugin-close {
                width: 100%;
                height: px2rem(78);
                text-align: right;
                padding-bottom: px2rem(20);
                span{
                    display: inline-block;
                    width: px2rem(58);
                    height: px2rem(58);
                    margin: 0 px2rem(16) 0 0;
                    background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA5CAMAAAC/M6OKAAAAnFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+TINBkAAAAM3RSTlMABAgMrPGIWfrqkIt/FeGwJRvStNbNo3kt3MO8t5VWMBDzp4RqyJpyZElu99icXUBVQ89namd3AAACiklEQVRIx6VX63qqMBDcgEARqHKp1l5Ee9FqW20P7/9uZ8DGFLIhfHX+SLIZSXZ2NwvxSINokoVe5YXZJApSGozSX1RtLPxyCFEENxWHm0DYqMF1s9LL42WZuOQm5TLOvWbuOuhl3t5VwHq2E+297Gbr2nB3a6a+vGNBOF8xptU8hO39xcB0RrBe+a7B7PpXsI8czrZ6rT0yJTOmtRdfmV0lBQxjh/rgjLGmSLS3ZtjvG9mwr9/sdlS9B/WL7Ahw6Pu2Cj7+T/MhrwVWxr8njpiIaBgi7PCohs4HdBcDuQLx86F8OkcQ/uTKmzdyePE96ckUITo/y4PB9ucZEj44DPUB2svBFmErhYohmjjPgyy0fYJabc+j4uwuB5F6IIlnrMpFh5pj8lmND4h69yQZ0ktQizwRLeqkTSWBRD0lZI4ddLUeiQ7VlyN5yrzJD0TKtK1giyxGuvhTaFxveldVGbUxlmRJHVMHiP5ds0WYGPKTaKhPHJWi0ymQBUviyUYqLZER+IHPmDL0CM5MiBl+HrnCBm2gLqwOGcgGqmSl0Jk4bKoGG2KBeEprdy9482dN/SQeCwhb7zz7AzeDl7T3snvm36udl/UVf17Oz3aNJKvW1xIbvL4yrliqOZzpC3HFx3PUzYWIi2c2j+w5SP+QRyp/+cKhcp/NX8pVybTWHFWUc6ZexaZaF3P1yg3lE7A319j97+wNXa0+W2q7Vp8pWcvCbb1T1L2g30d2qPvo8nuQjkpBK/z6/r3g3r+437i8z1H9leh3E99fgdx0bb19XdP5JZzJHdRPun/uY/fW/nnz3emfvzd8/2zv2yd6385DHLKKQ3YYFLRlpH2nRGUfQf8+Kprvo8L8ffQfNHiCDVCPe0gAAAAASUVORK5CYII=) no-repeat;
                    -webkit-background-size:100% 100%;
                    background-size:100% 100%;
                }
            }
            .plugin-more {
                width: px2rem(750);
                height: auto;
                background-color: white;
                padding-left: px2rem(13);
                padding-top: px2rem(11);
                padding-bottom: px2rem(17);
                li {
                    width: px2rem(350);
                    // height: px2rem(115);
                    margin-left: px2rem(7);
                    margin-top: px2rem(7);
                    float: left;

                    a {
                        display: block;
                        width: 100%;
                        height: 100%;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
    .plugin-mask {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1220;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.38);
        cursor:pointer;
    }
</style>
