<!--
 * @Description: 分期popup,选择分期
 * @Author: sunxj
 * @Date: 2019-01-09 18:08:48
 * @LastEditTime: 2019-01-12 16:59:54
 * @LastEditors: sunxj
 -->
<template>
    <div>
        <div class="aui-popup__hd">
            {{popData.title}}
        </div>
        <div class="aui-popup__ft">
            <a v-if="isShouldTie" href="javascript:;" class="aui-btn_full" @click="confirmTie">额度不够，去提额</a>
            <a v-else href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd">
            <div class="aui-cells">
                <div class="aui-cell_auto">
                    <div class="aui-cell__bd">
                        <div class="pop-cells">
                            <div class="pop-cells__title">
                                首付比例
                            </div>
                            <div class="pop-cells__content">
                                <ul class="option-list">
                                    <li v-for="(item,index) in levelOne" :key="item.name" :class="{ 'active': levelOneActiveIndex === index }" @click="levelOneEvent(index)">
                                        <!-- {{item.firstPay|percent}} -->
                                        {{item.name}}
                                        <template v-if="item.value===0">首付</template>
                                        <span class="aui-tag_bgcolor active-tag tag-tie" v-if="item.type==='increase'">提额</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="pop-cells__title">
                                分期数
                            </div>
                            <div class="pop-cells__content">
                                <ul class="option-list">
                                    <li v-for="(item,index) in levelTwo" :key="item" :class="{ 'active': levelTwoActiveIndex === index }" @click="levelTwoEvent(index) ">
                                        {{item}}期
                                        <span class="aui-tag_bgcolor active-tag" v-if="freeArr.indexOf(item)!==-1">免息</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <stages-detail v-if="stageDetail" :info="stageDetail" />
            </div>
        </div>
    </div>
</template>
<script>
import findIndex from 'lodash/findIndex'
import debounce from 'lodash/debounce'
import stagesDetail from 'module/trade/common/item_staging/detail.vue'
import { AXD } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapStateCommon } = createNamespacedHelpers('trade/common')

export default {
    name: 'confirmStagesCellPop',
    props: {
        popData: {
            type: [Array, Object]
        }
    },
    data() {
        return {
            levelOneActiveIndex: '',
            levelTwoActiveIndex: '',
            stageDetailDefault: {
                loading: true,
                firstPayAmount: '',
                stageAmount: '',
                monthPay: ''
            },
            selectItem: {
                name: '',
                value: '',
                month: ''
            }
        }
    },
    computed: {
        ...mapStateCommon({
            storeDirstpaybal: state => state.stages.firstpaybal,
            storeMonth: state => state.stages.month
        }),
        stages() {
            return this.popData.stages || {}
        },
        levelOne() {
            return this.popData.content.showStages
        },
        levelOneName() {
            return this.levelOne[~~this.levelOneActiveIndex].name
        },
        levelOneValue() {
            return this.levelOne[~~this.levelOneActiveIndex].value
        },
        levelTwo() {
            return this.levelOne[~~this.levelOneActiveIndex].stages
        },
        levelTwoValue() {
            return this.levelTwo[this.levelTwoActiveIndex]
        },
        isShouldTie() {
            return this.levelOne[~~this.levelOneActiveIndex].type === 'increase'
        },
        freeArr() {
            return this.popData.content.freeStageInfo || []
        },
        stageDetail() {
            return this.levelTwoValue ? this.stages.detail : this.stageDetailDefault
        }
    },
    components: {
        stagesDetail
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let oneIndex = findIndex(this.levelOne, (o) => {
                return o.value === this.storeDirstpaybal
            })
            let twoIndex = findIndex(this.levelTwo, (o) => {
                return o === this.storeMonth
            })
            if (oneIndex === -1 || twoIndex === -1) {
                let availableOneIndex = findIndex(this.levelOne, (o) => {
                    return o.type === 'pay'
                })
                availableOneIndex = (availableOneIndex === -1) ? 0 : availableOneIndex
                this.levelOneEvent(availableOneIndex, 'first')
            } else {
                this.levelOneActiveIndex = oneIndex
                this.levelTwoActiveIndex = twoIndex
                this.stageDetail = this.storeDetail
            }
        },
        levelOneEvent(index, type) {
            if (this.levelOneActiveIndex === index) {
                return
            }
            this.levelOneActiveIndex = index
            if (type === 'first') {
                let levelTwoLastIndex = this.levelOne[index].stages.length - 1
                this.levelTwoEvent(levelTwoLastIndex)
            } else {
                this.levelTwoActiveIndex = ''

                // this.stageDetail.loading = true

                // this.$set(this.stageDetail, 'loading', true)
                this.stageDetail = {
                    loading: true,
                    firstPayAmount: '',
                    stageAmount: '',
                    monthPay: ''
                }
            }
        },
        selectLevelTwo: debounce(function() {
            let selectItem = {
                name: this.levelOneName,
                value: this.levelOneValue,
                month: this.levelTwoValue
            }
            Object.assign(this.selectItem, selectItem)
            this.$emit('confirm', this.popData.type, selectItem)
        }, 500, { leading: true }),
        levelTwoEvent(index) {
            if (this.levelTwoActiveIndex === index) {
                return
            }
            this.levelTwoActiveIndex = index
            this.selectLevelTwo()
        },
        confirmTie() {
            // 1:加入购物车 -- 又不加购物车了。。
            // 2: 跳转到提额页面
            // let msg = this.$route.query.data
            AXD.util.goCredit(this.levelOne[this.levelOneActiveIndex].creditUrl)
        },
        confirm() {
            if (!this.levelTwoValue) {
                this.$_toast('请选择分期数')
                return
            }
            if (this.stages.month !== this.selectItem.month) {
                this.$_toast('数据加载中...')
                return
            }
            this.$emit('confirm', this.popData.type)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.pop-cells {

    // padding: px2rem(32);
    .pop-cells__title {
        font-size: $auiFontSizeLevel5;
        color: $auiTextColorGeneral;
    }
}

.aui-cells:before,
.aui-cells:after {
    display: none;
}

.option-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-top: px2rem(20);

    li {
        position: relative;
        width: px2rem(154);
        height: px2rem(60);
        line-height: px2rem(66); // margin-bottom: px2rem(20);
        margin: 0 px2rem(20) px2rem(20) 0;
        text-align: center;
        background: #f7f7f7;
        border-radius: px2rem(12);

        &.active {
            background: #ffd72d;
        }

        &:nth-child(4n) {
            margin-right: 0;
        }
    }
}

.active-tag {
    position: absolute;
    top: px2rem(-15);
    right: px2rem(-10);

    &:before {
        content: "";
        width: 0;
        height: 0;
        border-top: px2rem(5) solid $auiTipsColor;
        border-right: px2rem(8) solid transparent;
        position: absolute;
        top: 100%;
        left: px2rem(10);
    }

    &.tag-tie {
        top: px2rem(-20);
        background: #FF515A;
        border-radius: px2rem(14) px2rem(14) px2rem(14) 0;

        &:before {
            display: none;
        }

        padding:px2rem(6) px2rem(8);
    }
}

.aui-cells {
    margin-top: 0;
}

.aui-popup__bd {
    height: px2rem(800);
}
</style>
