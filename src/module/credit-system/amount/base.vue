<!--
 * @Author: dongys
 * @Date: 2018-08-08 20:37:39
 * @LastEditTime: 2019-12-10 11:10:39
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 -->
<template>
    <m-page class="page">
        <credit-head :money="config.money"/>
        <div class="page-bd">
        <!-- 会员提额-->
          <div v-if="config.showVipAmount" class="mt100">
            <group-shadow >
              <auth-cells :data="customList"  @back="goAmount"></auth-cells>
            </group-shadow>
          </div>

            <!-- 快速提额项 -->
            <template v-if="config.quickList && config.quickList.length">
                <p class="limit-group">快速提额</p>
                <group-shadow>
                    <auth-cells :data="config.quickList" :accountIsNormal="config.accountIsNormal"  @back="goAmount"></auth-cells>
                </group-shadow>
            </template>

            <template v-if="isApp">
                <!-- banner广告 针对基础授信不通过，提额失败的用户展示 -->
                <swiper :options="swiperOption" style="overflow: hidden;" class="banner-bottom_absolute" v-show="config.showSuiyihua">
                    <swiper-slide v-for="banner in cmsBanner" :key="banner.bgImg">
                        <img :src="banner.bgImg" alt="banner" @click="goCmsUrl(banner.hotArea[0].url)" />
                    </swiper-slide>
                </swiper>
                <template v-if="isAym && resourceLoad">
                    <!-- 资产资料项 -->
                    <template v-if="config.dataList && config.dataList.length > 0">
                        <p class="limit-group">资产资料</p>
                        <group-shadow>
                            <auth-cells :data="config.dataList" :taobaoIsFirst="config.taobaoIsFirst" :accountIsNormal="config.accountIsNormal"  @back="goAmount"></auth-cells>
                        </group-shadow>
                    </template>
                    <div v-if="config.dataList && config.dataList.length <= 0" :class="['limit-wait',{'limit-wait_none': limitNone}]">
                        <img :src="waitImg" alt="">
                        <p class="item-des">更多提额项开放中</p>
                    </div>
                </template>
                <p class="credit-tips" v-if="!limitNone">所有服务均符合安全标准，你的个人资料受到严密保护</p>
            </template>
            <h5Footer v-else></h5Footer>
        </div>
        <footer class="mui-fixedbottom footer_height120">
            <m-button @click="goLink">{{button_conf.text}}</m-button>
        </footer>
    </m-page>
</template>
<script>
import creditHead from './blocks/base-header.vue'
import groupShadow from '../components/group-shadow.vue'
import authCells from '../components/auth-cells.vue'
import h5Footer from './blocks/h5-footer.vue'
import { renderData, renderDataForBlockType } from 'src/store/api'
import { getStatus } from 'src/store/modules/credit-system'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    name: 'credit-increse',
    props: {
        config: {
            type: Object,
            default: () => {
                return {
                    quickList: [],
                    dataList: [],
                    money: '0',
                    taobaoIsFirst: false,
                    accountIsNormal: true
                }
            }
        }
    },
    data() {
        let { platform = 'aiyoumi', channel = ' ', version = '', creditItem = '' } = this.$route.query
        let origin = window.location.origin.replace('//app', '//m')
        return {
            creditItem,
            channel,
            version,
            from: this.isApp ? (/android/gi.test(navigator.userAgent) ? 'android' : 'ios') : 'h5',
            platform,
            isAym: platform === 'aiyoumi',
            adLabel: '',
            adActive: 0,
            adList: [],
            resourceLoad: false,
            waitImg: require('../assets/images/wait.png'),
            strategyList: [{
                title: '淘宝提额',
                subTitle: '仅需10秒 喜提10000额度',
                important: true,
                url: origin + '/cms/renderPage?alias=tbtie'
            }, {
                title: '银行卡提额',
                subTitle: '7000额度仅需3步？',
                url: origin + '/cms/renderPage?alias=yhktie'
            }, {
                title: '学信网提额',
                subTitle: '你的学历如此值钱！！！',
                url: origin + '/cms/renderPage?alias=xuexinwangtie'
            }, {
                title: '公积金提额',
                subTitle: '忘记密码，错失10000额度？？？',
                url: origin + '/cms/renderPage?alias=gjjtie'
            }, {
                title: '社保提额',
                subTitle: '忘记社保账号？原来找回如此简单',
                url: origin + '/cms/renderPage?alias=shebaotie'
            }],
            cmsBanner: [],
            button_conf: {},
            swiperOption: {
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                }
            },
            // showSuiyihua: false,
            customList:[
                {
                  name: '会员提额',
                  dese: '最高可获得1000的额度',
                  button: '去提额',
                  type:'vip'
                }
           ]
        }
    },
    components: {
        creditHead,
        groupShadow,
        authCells,
        h5Footer,
        swiper,
        swiperSlide
    },
    computed: {
        limitNone() {
            let { quickList, dataList } = this.config || {}
            quickList = quickList || []
            dataList = dataList || []
            return !quickList.length && !dataList.length
            // return !this.config.quickList.length && !this.config.dataList.length
        }
    },
    mounted() {
        document.title = '提高额度'
        // this.init()
        // this.initStatus()
        this.getBanner()
    },
    methods: {
        goLink() {
            this.log({type: 'button-link', name: 'creditpage-button-cashout', desc: '立即取现按钮', exendData: this.button_conf.url || '/pages/rrh/index'})
            if (this.button_conf.url) {
                window.location.href = this.button_conf.url
            } else {
                this.$router.push('/pages/rrh/index')
            }
        },
        getBanner() {
            renderData({
                alias: 'rrh_resource',
                type: '/cms'
            }, (data) => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach(data => {
                        switch (data.title) {
                            case 'banner_limit':
                                this.cmsBanner = JSON.parse(JSON.parse(data.objList))
                                break
                            case 'button_conf':
                                this.button_conf = JSON.parse(data.objList).amount
                                break
                            default:
                                break
                        }
                    })
                }
            })
        },
        init() {
            let params = {
                alias: 'credit_amount',
                blockType: 'extend',
                blockName: 'credit_link',
                renderPlatform: aixuedai.isUavoApp == 'y' ? 'app' : 'h5',
                type: '/cms'
            }
            renderDataForBlockType(params, (data) => {
                if (data.success && data.result && data.result.objList) {
                    let objList = JSON.parse(data.result.objList)
                    console.log(objList)
                    this.adLabel = objList.adLabel
                    this.adList = objList.adList || []
                    if (this.adList.length > 0) {
                        this.$nextTick(() => {
                            this.$refs.marquee.init()
                            this.$refs.marquee.start()
                        })
                    }
                }
            })
        },
        // initStatus() {
        //     let subObj = {
        //         version: this.version,
        //         channel: this.channel,
        //         platform: this.platform,
        //         creditItem: this.creditItem,
        //         from: this.from
        //     }
        //     getStatus(subObj).then((res) => {
        //         if (res.success) {
        //             this.showSuiyihua = res.result.showSuiyihua
        //         }
        //     })
        // },
        goAmount(type) {
            this.$emit('goAmountItem', type)
        },
        goCmsUrl(url) {
            axdApp.send({
                module: 'navigation',
                method: 'goURL',
                params: {
                    url,
                    closeToRoot: false
                },
                callback: function(ret) {}
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt100{
  margin-top: px2rem(100);
}
.mui-cells {
    margin-top: 0;
}
.auth-cell {
    height: px2rem(170);
}
.page {
    background-color: #fff;
}

.page-bd {
    overflow: hidden;
    margin-top: 0;
    padding: 0 px2rem(25) px2rem(40);
}
.limit-group {
    font-size: $auiFontSizeLevel4;
    margin: px2rem(38) 0 px2rem(20);
}
.credit-tips {
    text-align: center;
    margin: px2rem(76) 0;
    color: $auiTextColorLight;
    font-size: $auiFontSizeLevel7;
}
.item-des {
    font-size: $auiFontSizeLevel6;
    color: $auiTextColorAssistant;
}
.limit-wait {
    margin: px2rem(145) auto 0;
    width: px2rem(210);
    p {
        margin-top: px2rem(30);
    }
}
.limit-wait_none {
    margin-top: px2rem(312);
}
// .banner-bottom_absolute {
//     width: 100%;
//     position: absolute;
//     bottom: 3.5rem;
// }
.footer_height120 {
    height: px2rem(120);
    padding-top: px2rem(12);
    box-shadow: 0 -2px 3px #f0f0f0;
}
.mui-fixedbottom {
    position: fixed;
}
</style>
