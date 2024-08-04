<template>
    <div>
        <div class="hlarea">
            <div class="hlarea__price">
                <em>¥</em>
                <!-- 约定按照常规商品价格获取 -->
                <span v-if="showPrice" v-html="complexMoney(price, 100, true)"></span>
                <span v-else class="hlarea__price_noprice">暂无报价</span>
            </div>
            <div class="hlarea__countdown">
                <!-- <p>1</p>
<p>2</p>
                -->
                <div class="seckill-wrap"></div>
                <!--   <div class="seckill-wrap2">
                    <div class="">
                        <p class="hlarea-desc">抢购已结束</p>0天 <span class="hlarea-time-block">00</span> : <span class="hlarea-time-block">00</span> : <span class="hlarea-time-block">00</span>
                    </div>
                </div>-->
            </div>
        </div>
        <axd-desc></axd-desc>
        <div class="info">
            <div class="info__tips">
                <div
                    class="info__tips__tag"
                    :class="{'info__tips__tag_gray':reservationStatus==3}"
                >{{reservationStatus|tags}}</div>
                <div class="info__tips__desc">
                    {{reservationStatus<=1?'预约客户抢购成功可享受优先发货，请及时预约抢购哦~':'预约客户抢购成功，可享受优先发货哦~' }}
                    <i class="info__tips__icon" @click="toRule"></i>
                </div>
            </div>
            <div class="info__status">
                <m-progress :stepText="stepText" :curStep="curStep"></m-progress>
                <br />
                <p
                    class="info__status_date"
                    :class="{active:reservationStatus==2}"
                >{{st2|dateFormat('MM.dd hh:mm')}}至{{et2|dateFormat('MM.dd hh:mm')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { getSystime, getReservation } from 'store/modules/trade/product'
import Seckill from 'src/libs/seckill'
import { Progress as mProgress, Tags as mTags } from '@fe/buss-ui'
import axdDesc from './desc.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/product')
// stepText
// const stepText = ['预约', '抢购', '发货']
// let st1 = '2019-09-24 17:06:20'
// let et1 = '2019-09-24 17:06:25'
// let st2 = '2019-09-24 17:06:25'
// let et2 = '2019-09-24 17:06:30'
const tmpl1 =
    '<p class="hlarea-desc">$isBefore{距预约开始仅剩}$isIng{距抢购开始仅剩}</p>$D天 <span class="hlarea-time-block">$h$h</span> : <span class="hlarea-time-block">$m$m</span> : <span class="hlarea-time-block">$s$s</span>'
const tmpl2 =
    '<p class="hlarea-desc">$isBefore{距抢购开始仅剩}$isIng{距抢购结束仅剩}$isAfter{抢购已结束}</p>$D天 <span class="hlarea-time-block">$h$h</span> : <span class="hlarea-time-block">$m$m</span> : <span class="hlarea-time-block">$s$s</span>'
export default {
    name: 'pdReservation',
    props: {
        productId: {
            type: [String, Number]
        }
    },
    filters: {
        tags(val = '') {
            return {
                0: '未开始',
                1: '预约中',
                2: '抢购中',
                3: '已结束'
            }[val]
        },
        desc(val = '') {}
    },
    data() {
        return {
            showPrice: false,
            status: 1,
            stepText: ['预约', '抢购', '发货'],
            st1: '',
            et1: '',
            st2: '',
            et2: '',
            seckillObj: null
        }
    },
    computed: {
        ...mapState({
            reservationStatus: state => state.interactData.reservationStatus
        }),
        ...mapGetters({
            price: 'price',
            discountPrice: 'discountPrice'
        }),
        curStep() {
            let status = this.reservationStatus
            if (status == 3) {
                return -1
            }
            return status - 1
        }
    },
    components: {
        axdDesc,
        mTags,
        mProgress
    },
    beforeDestroy() {
        this.seckillObj.destory()
    },
    mounted() {
        this.init()
    },

    methods: {
        ...mapMutations(['updateInteractData', 'updateInitData']),
        init() {
            getReservation({
                productId: this.productId
            }).then(res => {
                if (!res.success) {
                    this.$_toast(res.resultDes)
                    return
                }
                let { status, showPrice, reserveStartTime: st1, reserveEndTime: et1, saleStartTime: st2, saleEndTime: et2 } = res.result || {}
                this.upStatus(status)
                this.showPrice = showPrice
                this.st1 = st1 // 预约开始时间
                this.et1 = et1 // 预约结束时间
                this.st2 = st2 // 抢购开始时间
                this.et2 = et2 // 抢购结束
                if (this.reservationStatus == 0) {
                    this.countdown(st1, et1, tmpl1)
                    return
                }
                if (this.reservationStatus == 1 || this.reservationStatus == 2) {
                    this.countdown(st2, et2, tmpl2)
                }
            })
        },
        upStatus(status) {
            this.updateInteractData({
                reservationStatus: status
            })
        },
        countdown(startTime, endTime, tmpl) {
            this.seckillObj = new Seckill({
                el: document.querySelector('.seckill-wrap'),
                during: 1000,
                style: '', // $isBefore{后开始}$isIng{后结束}
                template: tmpl,
                endTime: endTime,
                startTime: startTime,
                perCb(rst) {
                    if (rst.time.day == 0 && this.template.indexOf('$D天') > -1) {
                        this.template = this.template.replace(/\$D天/, '')
                    }
                },
                getServerTime: () => {
                    return new Promise((resolve, reject) => {
                        getSystime().then(({ success, result }) => {
                            resolve({
                                success,
                                serverTime: result
                                // serverTime: '2019-09-24 17:06:10'
                            })
                        })
                    })
                },
                beginSeckillCb: () => {
                    // console.log(11)
                    // this.destory()
                    // this.startTime = '2019-09-24 17:06:30'
                    // 改变vuex中限时抢购状态变量

                    if (this.reservationStatus == 0) {
                        // this.status = 1
                        this.upStatus(1)
                        console.log('开始预约')
                        return
                    }
                    if (this.reservationStatus == 1) {
                        this.upStatus(2)
                        console.log('开始抢购')
                    }
                },
                endSeckillCb: () => {
                    // 预约结束 - 抢购
                    if (this.reservationStatus == 1) {
                        this.seckillObj.destory()
                        this.countdown(this.st2, this.et2, tmpl2)
                        return
                    }
                    // 抢购结束 - 活动已结束
                    if (this.reservationStatus == 2) {
                        this.upStatus(3)
                    }
                }
            })
            this.seckillObj.init()
        },
        toRule() {
            location.href = '/cms/renderPage?alias=guoqing111'
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
$hlStepsColor: #ff3e00;

::v-deep .hlarea-time-block {
    display: inline-block;
    text-align: center;
    width: px2rem(40);
    height: px2rem(40);
    background-color: #333;
    border-radius: px2rem(4);
}

::v-deep .hlarea-desc {
    margin-bottom: px2rem(8);
    text-align: center;
}

.hlarea__countdown {
    font-size: px2rem(24);

    // span {
    // font-size: px2rem(24);
    // }
}

.hlarea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: px2rem(16) px2rem(32);
    width: px2rem(750);
    height: px2rem(112);
    // overflow: hidden;
    background-size: auto 100%;
    background-color: #ff455e;
    background-image: url(../../img/reservation-bg.png);

    em {
        font-size: px2rem(32);
    }

    .hlarea__price {
        font-size: px2rem(60);
    }

    .hlarea__price_noprice {
        font-size: px2rem(44);
    }

    div,
    span,
    em,
    p {
        color: #fff;
    }
}

.info {
    background: #fff;
    padding-bottom: px2rem(42);
}

.info__tips {
    display: flex;
    padding: px2rem(32);
    align-items: flex-start;
    font-size: px2rem(28);
    color: #333;
}

.info__tips__desc {
    line-height: 1.2;
}

.info__tips__icon {
    display: inline-block;
    width: px2rem(28);
    height: px2rem(28);
    background-image: url('../../img/reservation-rule.png');
    background-size: 100% 100%;
    vertical-align: middle;
    margin-top: -1px;
}

.info__tips__tag {
    padding: 0 px2rem(8);
    margin-right: px2rem(8);
    font-size: px2rem(20);

    color: #ff3e00;
    border: 1px solid #ff3e00;
    white-space: nowrap;
    border-radius: px2rem(16);
}

.info__tips__tag_gray {
    color: #999;
    border-color: #999;
}

.info__status {
    width: px2rem(544);
    margin: 0 auto;
    font-size: px2rem(24);
    text-align: center;

    ::v-deep .mui-progress_step .mui-progress__item .mui-progress__txt {
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: #ccc;
        color: #fff;
        border-radius: px2rem(18);
        font-size: px2rem(24);
        padding: 0 px2rem(24);
        line-height: px2rem(36);
    }

    ::v-deep .mui-progress_step .mui-progress__item.cur .mui-progress__txt {
        background-color: $hlStepsColor;
    }

    ::v-deep .mui-progress_step .cur + .cur:after {
        background-color: $hlStepsColor;
    }
}

.info__status_date {
    display: inline-block;
    border: 1px solid #cccccc;
    padding: 0 px2rem(24);
    border-radius: px2rem(18);
    position: relative;
    color: #333;

    &:before {
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        // top: 0;
        left: 50%;
        bottom: 100%;
        border-width: 0 px2rem(8) px2rem(12);
        border-style: solid;
        transform: translateX(-50%);
        border-color: transparent transparent #ccc;
    }

    &:after {
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        // top: 0;
        left: 50%;
        bottom: 100%;
        border-width: 0 px2rem(6) px2rem(9);
        border-style: solid;
        transform: translateX(-50%);
        border-color: transparent transparent #fff;
    }

    &.active {
        border: none;
        background: #ffece5;

        &:before {
            z-index: 1;
            border-color: transparent transparent #ffece5;
        }
    }
}
</style>
