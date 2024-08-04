<!--
    created: mahui, on 03/13/2018
    desc: cms限时抢购，一个cms限时抢购模块可以配置若干场次的限时抢购，限时抢购的状态有未开抢，抢购中和已抢完
-->
<template>
    <div class="flashsale" :style="{backgroundColor: '#'+config.bgColor}" v-lazyajax="init">
        <div class="flashsale__img">
            <a :href="config.url">
                <axd-image :src="config.img" :lazy="false"></axd-image>
            </a>
            <p class="flashsale__countdown" :style="{color: '#'+styleObj.countDownCharColor}" v-html="countDownHtml">
            </p>
        </div>
        <!-- 场次拖动条，使用原生scroll拖动，并且已做了隐藏滚动条的处理，下面商品列表同理 -->
        <div class="flashsale__topbar clearfix">
            <div class="scroll-topbar">
                <ul class="clearfix" :style="{width: tabsListWidth + 'px'}">
                    <li v-for="(item, index) in tabsList" :class="{'active': index == activeIndex}" :style="(index == activeIndex ? activeTabStyle : tabStyle)" @click="changeProductList(item, index)" v-html="formatTime(item.startTime, true)">
                    </li>
                </ul>
            </div>
        </div>
        <!-- 场次对应的商品列表，可横向滑动 -->
        <div class="flashsale__product-list">
            <div class="scroll-product" ref="scrollBox">
                <ul class="clearfix" :style="{width: productListWidth + 'px'}">
                    <li v-for="item in productList" class="flashsale__product">
                        <flashsale-product :customLoginParam="customLoginParam" :styleConfig="styleObj" :productConfig="item" :entryConfig="activeEntry" :status="status" :formatStartTime="formatTime(activeEntry.startTime)"></flashsale-product>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import flashsaleProduct from './flashsale-product.vue'
import {
    getLimitSeckillEntryListById,
    getCMSLimitSeckillProductList
} from 'src/store/modules/flashsale/index'
import {
    getSystime
} from 'store/modules/trade/product'
import {
    timeFomater
} from 'src/libs/util'
import axdToast from 'components/toast/index'
export default {
    name: 'flashsale',
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
            tabsList: [],
            productList: [],
            tabsListWidth: 0,
            tabWidth: 0,
            productListWidth: 0,
            activeIndex: null, // 选中的场次下标值
            activeEntry: null, // 选中的场次
            status: '',
            countDownHtml: '距开始还有0天0时0分0秒',
            sysTime: '',
            subTime: 0,
            timeReady: false,
            initReady: false,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            timer: null,
            startTime: ''
        }
    },
    watch: {
        // 切换场次，更新倒计时
        activeIndex(index) {
            this.activeEntry = this.tabsList[index]

            // 检测服务器时间请求是否成功，防止出现服务器时间还没请求到就开始倒计时的情况
            if (!this.dataReady) return

            // 根据选中场次的开始和结束时间来判断当前场次的状态
            // 清除掉上一场次的倒计时
            if (this.timer) {
                this.timer = null
                clearTimeout(this.timer)
            }
            this.countTimeByTime()
        },
        dataReady(flag) {
            // 请求到系统时间,开始倒计时
            if (flag) {
                this.countTimeByTime()
            }
        }
    },
    computed: {
        dataReady() {
            return this.timeReady && this.initReady
        },
        countDownText() {
            let txtObj = {
                'started': '距结束还有',
                'before': '距开始还有'
            }
            return txtObj[this.status]
        },
        clientWidth() {
            return document.body.clientWidth
        },
        styleObj() {
            return this.config.objExtJson
        },
        activeTabStyle() {
            return {
                width: this.tabWidth + 'px',
                backgroundColor: '#' + this.styleObj.tabSelectedButtColor,
                color: '#' + this.styleObj.tabSelectedCharColor
            }
        },
        tabStyle() {
            return {
                width: this.tabWidth + 'px',
                backgroundColor: '#' + this.styleObj.tabUnSelectButtColor,
                color: '#' + this.styleObj.tabUnSelectCharColor
            }
        }
    },
    created() {
        // 初始化场次和商品列表
        // this.init()

        // if (this.config.subTime) {
        //     // 统一由上级传入，无需再次请求服务器时间 20181205
        //     this.subTime = this.config.subTime
        //     this.timeReady = true
        // } else {
        //     // 获取系统时间
        //     this.getNow()
        // }

        // 获取系统时间 2019-07-22 daly 初始化服务器时间，init放置在lazyajax
        this.getNow()
    },
    methods: {
        countTimeByTime() {
            let curTime = new Date(+new Date() + this.subTime)
            let startTime = new Date(timeFomater(this.activeEntry.startTime)).getTime()
            let endTime = new Date(timeFomater(this.activeEntry.endTime)).getTime()

            if (curTime < startTime) {
                this.status = 'before'
                this.countTime(this.activeEntry.startTime, this.subTime)
            } else if (curTime < endTime) {
                this.status = 'started'
                this.countTime(this.activeEntry.endTime, this.subTime)
            } else {
                this.status = 'end'
                this.countDownHtml = '已结束'
            }
        },
        formatTime(time, flag) {
            time = new Date(timeFomater(time))

            let month = time.getMonth() + 1
            let d = time.getDate()

            let h = time.getHours()
            let m = time.getMinutes()

            return flag ? month + '月' + d + '日' + '<br>' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) : month + '月' + d + '日' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m)
        },
        countTime(targetTime, subTime) {
            targetTime = timeFomater(targetTime)

            let curTime = new Date(+new Date() + subTime)
            let endTime = new Date(targetTime).getTime()
            let leftTime = endTime - curTime

            if (leftTime <= 0) return
            // console.log('leftTime', leftTime)
            this.days = Math.floor(leftTime / 1000 / 60 / 60 / 24)
            this.hours = Math.floor(leftTime / 1000 / 60 / 60 % 24)
            this.minutes = Math.floor(leftTime / 1000 / 60 % 60)
            this.seconds = Math.floor(leftTime / 1000 % 60)

            if (!this.days && !this.hours && !this.minutes && !this.seconds) {
                clearTimeout(this.timer)
                this.timer = null

                // 倒计时结束，刷新状态
                this.refreshStatus()
                return
            }

            this.setCountDownHtml()

            this.timer = setTimeout(() => {
                this.countTimeByTime()
            }, 1000)
        },
        setCountDownHtml() {
            this.countDownHtml = this.countDownText + this.days + '天' + this.hours + '时' + this.minutes + '分' + this.seconds + '秒'
        },
        refreshStatus() {
            if (this.status === 'before') {
                this.status = 'started'
                this.countTime(this.activeEntry.endTime, this.subTime)
            } else if (this.status === 'started') {
                this.status = 'end'
            }
        },
        init() {
            getLimitSeckillEntryListById({ templateId: this.config.id }).then((res) => {
                if (res.success && res.result.length) {
                    this.tabsList = res.result

                    // tabs选项宽度样式根据场次数目自适应
                    if (this.tabsList.length <= 5) {
                        this.tabWidth = this.clientWidth / this.tabsList.length
                        this.tabsListWidth = this.clientWidth
                    } else {
                        this.tabWidth = this.clientWidth / 5
                        this.tabsListWidth = this.tabsList.length * this.tabWidth
                    }

                    // 查询默认选中场次对应的商品列表信息
                    let selected = res.result.find((item, index) => {
                        if (item.selected) {
                            this.activeIndex = index

                            return item
                        }
                    })
                    this.initReady = true
                    this.getProductListByEntryId(selected.id)
                }
            })
        },
        getNow() {
            getSystime().then((data) => {
                if (data.success) {
                    // 这里的转换是为了避免系统接口返回2010-10-10 10:10:10这种数据，这种格式IOS解析异常
                    this.sysTime = data.result
                    this.subTime = new Date(data.result.replace(/-/g, '/')) - (+new Date())

                    this.timeReady = true
                } else {
                    axdToast(data.resultDes)
                }
            })
        },
        changeProductList(item, index) {
            if (this.activeIndex == index) return

            // 重置滑动距离为0
            this.$refs.scrollBox.scrollLeft = 0

            // 先重置商品列表再赋值，否则会引起试图视图不更新问题
            this.productList = []

            this.activeIndex = index
            this.getProductListByEntryId(item.id)
        },
        getProductListByEntryId(id) {
            getCMSLimitSeckillProductList({
                entryId: id
            }).then((res) => {
                if (res.success && res.result.entryProductList) {
                    this.productList = res.result.entryProductList

                    // 求商品列表总宽度
                    this.productListWidth = Math.ceil((this.productList.length * 300 + 20) * this.clientWidth / 750)
                }
            })
        }
    },
    components: {
        'flashsale-product': flashsaleProduct,
        axdImage
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.flashsale {
    padding-bottom: px2rem(10);
    &__img {
        position: relative;
    }
    &__countdown {
        position: absolute;
        bottom: px2rem(10);
        left: 0;
        width: 100%;
        text-align: center;
        font-size: px2rem(24);
    }
    &__topbar {
        position: relative;
        overflow: hidden;
        height: px2rem(74);
        margin-bottom: px2rem(10);

        li {
            float: left;
            height: px2rem(74);
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            text-align: center;
            font-size: px2rem(22);
            line-height: px2rem(26);
        }
    }
    &__product-list {
        overflow: hidden;
        height: px2rem(510);
    }
}

.scroll-product {
    width: 100%;
    height: 120%;
    overflow-x: scroll;
    overflow-y: hidden;
    ul {
        height: px2rem(510);
    }
}

.scroll-topbar {
    width: 100%;
    height: 120%;
    overflow-x: scroll;
    overflow-y: hidden;
    ul {
        width: px2rem(1800);
        height: px2rem(74);
    }
}
</style>
