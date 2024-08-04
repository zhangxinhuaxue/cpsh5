<template>
    <m-modal :isShow="isShow"
             title=" "
             @close="handleClose"
    >
        <div slot="content" class="model__content">
            <div class="model__title">
                付款金额
            </div>
            <div class="model__num">
                <span class="fs52">￥</span><span class="fs80">{{ payPrice|formatMoneyK }}</span>
                <div class="fs24 h34">
                    <div v-show="value">
                        总价￥{{ instalmentObj.price|formatMoneyK(0) }}
                    </div>
                    <div v-show="!value && reducedPrice" class="model__num_save">
                        ￥{{ reducedPrice|formatMoneyK(0) }}
                    </div>
                </div>
            </div>
            <div class="model__list">
                <div class="model__item" :class="{active: !value}" @click="handleToggleStage(false)">
                    <m-tags class="model__item__tag" type="warn">
                        {{ reducedPrice ? '限时折扣' : '限时' }}
                    </m-tags>
                    不分期
                    <div class="model__item__desc">
                        {{ reducedPrice ? '立享优惠价' : '限时立享价' }}￥{{ noStagePrice|formatMoneyK(0) }}
                    </div>
                    <img src="../../styles/imgs/full.png" class="model__item_tag1"/>
                </div>

                <div class="model__item ml24" :class="{active: value}" @click="handleToggleStage(true)">
                    首付￥{{ stagePrice|formatMoneyK(0) }}
                    {{instalmentObj.priceShowType}}
                    <div v-if="priceShowType === 'combine'" class="model__item__desc combine">
                        ￥{{ planDetail.periodPrice|formatMoneyK }}<m-icon type="close1" class="icon-close"></m-icon>{{planDetail.totalPeriod}}期
                    </div>
                    <div v-else class="model__item__desc">
                        <div  v-for="(item,index) in planDetail" :key="index" class="model__item__col">
                            <div v-for="(sitem,sindex) in item" :key="sindex" >
                                {{sitem.period}}期￥{{sitem.amount|formatMoneyK}}
                            </div>
                        </div>
                    </div>
                    <img src="../../styles/imgs/part.png" class="model__item_tag1"/>
                </div>
            </div>
        </div>
        <div slot="footer"
             class="modal__footer">
            <Agreement v-model="isAgree" :listProtocol="listProtocol"></Agreement>
            <m-button @click="handleConfirm">￥{{ payPrice|formatMoneyK(0) }}立即开通</m-button>
        </div>
    </m-modal>
</template>

<script>
import Agreement from 'src/components/agreement'
import {formatMoneyK} from "src/libs/util";

export default {
    name: "ModelPayMethod",
    filters: {
        formatMoneyK
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
        instalmentObj: {
            type: Object,
            default() {
                return {}
            }
        },
        listProtocolDefault: {
            type: Array,
            default() {
                return []
            }
        },
        listProtocolStage: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            isAgree: false
        }
    },
    computed: {
        listProtocol(){
            return this.value ? this.listProtocolStage : this.listProtocolDefault
        },
        stagePrice() {
            const {firstPay} = this.instalmentObj
            return firstPay
        },
        noStagePrice() {
            const {currentPrice, price} = this.instalmentObj
            return currentPrice || price
        },
        reducedPrice() {
            const {currentPrice, price} = this.instalmentObj
            if (currentPrice) {
                return price - currentPrice
            }
            return 0
        },
        payPrice() {
            if (this.value) {
                return this.stagePrice
            }
            return this.noStagePrice
        },
        priceShowType() {
            const { priceShowType } = this.instalmentObj.planDetail || {}
            return priceShowType
        },
        planDetail() {
            const {priceShowType, totalPeriod, periodPrice, planList = []} = this.instalmentObj.planDetail || {}
            // separate 单独计价，combine 合并计价
            if (priceShowType === 'combine') {
                return {
                    totalPeriod,
                    periodPrice
                }
            }

            //  for style list
            return planList.reduce((acc, cur, index) => {
                if (index % 2 === 0) {
                    acc[0].push(cur)
                } else {
                    acc[1].push(cur)
                }
                return acc
            }, [[], []])
        },
    },
    components: {
        Agreement
    },
    methods: {
        handleClose() {
            this.$emit('update:isShow', false)
        },
        handleConfirm() {
            if (!this.isAgree) {
                this.$_toast('请阅读并同意服务协议/服务规则')
                return
            }
            this.$emit('confirm')
        },
        handleToggleStage(flag) {
            if (this.value !== flag) {
                this.$emit('input', flag)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$colorPrimary: #4286ff;

.model__content {
    padding: 0 px2rem(32) px2rem(102);
    line-height: 1.4;
}

.model__title {
    font-size: px2rem(28);
    color: #666;
}

.model__num {
    color: #FF3E00;
}

.model__list {
    display: flex;
    margin-top: px2rem(42);
}

.model__item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: px2rem(210);
    padding: px2rem(34) 0;
    background: #f8f8f8;
    border-radius: px2rem(8);
    font-size: px2rem(32);
    color: #333;
    font-weight: 600;
    border: px2rem(2) solid #f8f8f8;

    &.active {
        background: rgba(66, 134, 255, 0.05);
        border: px2rem(2) solid #4286ff;
        color: $colorPrimary;

        .model__item__desc {
            color: $colorPrimary;
        }
    }
    .model__item__tag {
        position: absolute;
        left: px2rem(-2);
        top: px2rem(-2);
        border-radius: px2rem(8) 0px px2rem(8) 0px;
        font-weight: 400;
    }
    .model__item__desc {
        color: #999;
        font-size: px2rem(24);
        font-weight: 400;
        display: flex;
        &.combine{
            align-items: center;
        }
        .model__item__col {
            text-align: left;
            white-space: nowrap;
            &:last-child {
                margin-left: px2rem(24);
            }
        }
    }
}

.modal__footer {
    margin-bottom: px2rem(20);
}

.icon-close{
    font-size: px2rem(16);
    margin: 0 px2rem(4);
}
.ml24 {
    margin-left: px2rem(24);
}

.fs24 {
    font-size: px2rem(24);
}

.fs52 {
    font-size: px2rem(52);
}

.fs80 {
    font-size: px2rem(80);
}

.h34 {
    height: px2rem(34);
}
.model__num_save {
    width: px2rem(153);
    padding-left: px2rem(46);
    height: px2rem(35);
    margin: 0 auto;
    background: url('../../styles/imgs/save.png') no-repeat;
    background-size: 100% 100%;
}
.model__item_tag1 {
    position: absolute;
    right: 0;
    bottom: 0;
    width: px2rem(65);
    height: px2rem(47);
}
</style>
