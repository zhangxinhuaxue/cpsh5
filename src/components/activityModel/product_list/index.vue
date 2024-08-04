<!--
    created by daly on 10/13/18
    Des: 全新改版
    10-18 预售去除预售前状态，预售商品开始时间前都是预售状态，付尾款时间开始就是普通商品，活动页不提供付尾款入口
    2019-02-25 重构，除一行四个，其他模板合并为一个
-->
<template id="header-template">
    <div
        type="productlist"
        :data-name="config.title"
        :class="classObj"
        :style="floorBg"
        v-lazyajax="getSystemTime">
        <!-- 模块头部图片，可配置链接 -->
        <div class="titlebox">
            <a :href="moreUrl">
                <axd-image
                    :src="config.titleImg"
                    :resizeW="750"></axd-image>
            </a>
        </div>
        <!-- 预加载骨架 -->
        <template v-if="!datalist.length">
            <div :class="['prebox',blockClass]">
                <ul>
                    <li
                        v-for="(i,index) in preboxArray"
                        :key="index"></li>
                </ul>
            </div>
        </template>
        <!-- 一行一个，一行横向||竖向两个，一行三个 -->
        <section
            :class="['product__list',blockClass]"
            v-if="datalist.length">
            <cms-product4
                v-if="blockClass=='product_four'"
                :productList="datalist"
                :config="config"
                :blockType="blockClass"></cms-product4>
            <cms-product
                v-else
                :productList="datalist"
                :config="config"
                :blockType="blockClass"></cms-product>
        </section>
    </div>
</template>
<script>
import Vue from 'vue'
import hub from 'assets/js/hub'
import axdToast from 'components/toast/index'
import cmsProduct from './block/product.vue'
import cmsProduct4 from './block/product4.vue'
import { newProductList, getSysTime } from 'src/store/modules/activity'
import { formatColor } from 'src/libs/util'
import {isSupportSessionStorage} from 'src/libs/util/support'
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'productlist',
    data() {
        return {
            datalist: [],
            floorBg: {
                backgroundColor: formatColor(this.config.bgColor)
            },
            moreUrl: this.config.moreUrl || 'javascript:',
            nowTime: ''
        }
    },
    props: {
        titleImage: {
            type: String
        },
        templateId: {
            type: [String, Number]
        },
        config: {
            type: Object
        },
        onlyPro: {
            type: Boolean,
            default: true
        }
        // nowTime: {
        //     type: Number,
        //     default: 0
        // }
    },
    components: {
        axdImage,
        axdToast,
        cmsProduct,
        cmsProduct4
    },
    computed: {
        classObj() {
            if (this.onlyPro) {
                return {
                    'tab-content': true,
                    'floor': true
                }
            } else {
                return {
                    'tab-content': true,
                    'floor': this.config.floorShow && this.config.floorShow === 'y'
                }
            }
        },
        blockClass() {
            let { blockLayoutStyle, extJsonObj } = this.config
            if (blockLayoutStyle == 'product_two') {
                if (!extJsonObj) {
                    return 'product_two-vertical'
                }
                let { prodSortType } = extJsonObj
                blockLayoutStyle = prodSortType ? blockLayoutStyle + '-' + prodSortType : 'product_two-vertical'
            }
            return blockLayoutStyle
        },
        preboxArray() {
            if (this.blockClass == 'product_one') return new Array(1)
            if (this.blockClass.indexOf('product_two') > -1) return new Array(2)
            if (this.blockClass == ('product_three')) return new Array(3)
            if (this.blockClass == ('product_four')) return new Array(4)
        },
        activitySource() {
            return this.config.extJsonObj.activitySource
        }
    },
    beforeMount() {
        hub.$on('chooseFloor', this.checkState)
        if (!this.config.extJsonObj) {
            this.config.extJsonObj = {
                activitySource: 'none',
                prodSortType: 'vertical'
            }
        }
        // if (this.activitySource == 'discount' || this.activitySource == 'preSell') {
        //     // hub.$emit('getSysTemTime')
        //     this.getSysTemTime()
        // }
    },
    watch: {
        nowTime(newVal) {
            if (this.datalist.length && this.config.extJsonObj) {
                // let { activitySource } = this.config.extJsonObj
                if (this.activitySource == 'preSell' || this.activitySource == 'discount') {
                    this.datalist.forEach((pro, index) => {
                        this.datalist[index].activityTypeFormat = this.processActivityType(pro)
                    })
                }
            }
        }
    },
    methods: {
        checkState(index) {
            if (typeof this.config.floorIndex != 'undefined' && this.config.floorIndex <= index) {
                if (this.datalist.length) {
                    this.$nextTick(() => {
                        hub.$emit('updateNavData', this.config.index)
                    })
                } else {
                    this.getProducts('nav')
                }
            }
        },
        getProducts(from) {
            if (this.datalist.length) return
            // 数据错误的情况下，增加默认值
            if (!this.config.extJsonObj) {
                this.config.extJsonObj = {
                    activitySource: 'none',
                    prodSortType: 'vertical'
                }
            }
            // console.log(this.activitySource, this.config.plistId)
            newProductList({
                plistIdOrName: this.config.plistId,
                type: 'id'
            }).then(({ success, result, code, resultDes }) => {
                console.log(result)
                if (success) {
                    if (result && result.length) {
                        // 组装数组列表
                        this.handleProList(result)
                        if (from == 'nav') {
                            this.$nextTick(() => {
                                // 更新数据
                                hub.$emit('updateNavData', this.config.index)
                            })
                        }
                    }
                } else {
                    axdToast(resultDes)
                }
            })
        },
        handleProList(list) {
            this.config.priceRand = this.formatSeq()
            this.datalist = list.map((pro) => {
                if (pro.productImgUrl) {
                    pro.summary.imgUrl = pro.productImgUrl
                }
                pro.activityTypeFormat = this.processActivityType(pro)
                return pro
            })
            // console.log(this.datalist, '====datalist')
        },
        // 处理价格排序
        formatSeq() {
            let { priceSeq } = this.config
            let order = (new Array(3)).fill('')
            if (priceSeq) {
                // console.log(priceSeq)
                priceSeq = JSON.parse(priceSeq)
                for (let i in priceSeq) {
                    // 不勾选的时候，返回值为空字符串
                    let index = priceSeq[i]
                    if (index) {
                        order[index - 1] = i
                    }
                }
                order = Array.from(new Set(order))
            }
            return order
        },
        processActivityType({ activityType, endTime, startTime, stock, summary: { totalAvail }, preheatTime }) {
            startTime = startTime && startTime.replace(/-/g, '/')
            endTime = endTime && endTime.replace(/-/g, '/')
            preheatTime = preheatTime && preheatTime.replace(/-/g, '/')
            // let { activitySource } = this.config.extJsonObj
            let nowDate = this.nowTime ? this.nowTime : (+new Date(+new Date() + this.subTime))
            let s = +new Date(startTime)
            let e = +new Date(endTime)
            let p = +new Date(preheatTime)
            if (activityType === 'discount' || activityType === 'vip') {
                if (nowDate < p) {
                    return 'discount_normal'
                } else if (nowDate >= p && nowDate < s) {
                    return 'discount_before'
                } else if (nowDate >= s && nowDate < e) {
                    return 'discount_ing'
                } else {
                    return 'discount_over'
                }
            } else if (activityType === 'presale') {
                if (nowDate < s) {
                    return 'presale_ing'
                } else {
                    return 'presale_over'
                }
            } else if (this.activitySource == 'atmosphere') {
                return 'atmosphere'
            } else {
                return 'normal'
            }
        },
        getSystemTime() {
            if (this.activitySource === 'discount' || this.activitySource === 'preSell') {
                if (sessionStorage.getItem('cms_sub')) {
                    this.subTime = Number(sessionStorage.getItem('cms_sub'))
                    this.shouldStartCd()
                } else {
                    getSysTime().then(({ success, result, code, resultDes }) => {
                        if (success) {
                            this.subTime = Number(new Date(result) - new Date())
                            if (isSupportSessionStorage()) {
                                sessionStorage.setItem('cms_sub', this.subTime.toString())
                            }
                            this.shouldStartCd()
                        } else {
                            axdToast('服务器时间错误：' + resultDes)
                        }
                    })
                }
            } else {
                this.getProducts()
            }
        },
        // 有预售或者价格体系商列模块，开启倒计时
        shouldStartCd() {
            this.countdown()
            this.getProducts()
        },
        countdown() {
            let nowDate = new Date(+new Date() + this.subTime)
            setTimeout(() => {
                this.nowTime = +nowDate
                this.countdown()
            }, 1000)
        }
    }
}
</script>
<style lang="scss">
@import './css/common.scss';
@import './css/pro-one.scss';
@import './css/pro-two-horizontal.scss';
@import './css/pro-two-vertical.scss';
@import './css/pro-three.scss';
@import './css/pro-four.scss';
</style>
