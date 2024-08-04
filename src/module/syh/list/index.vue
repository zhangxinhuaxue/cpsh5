<template>
    <m-page class="page__syh">
        <hybrid-header slot="header" class="mui-bar_nav"></hybrid-header>
        <div class="page__content">
            <div class="page__top">
                <div class="page__top__title">
                    快速放款通道
                </div>
                <m-cell class="h180 page__top__item" size="xlarge">
                    <img
                        slot="icon"
                        :src="topItem.productLogo" 
                        alt=""
                    />
                    <div slot="title">
                        <p class="mui-cell__bd_title_bold">
                            {{topItem.productName}}
                            <!-- <m-tags outline class="cell__tag--yellow"
                                >在线审核</m-tags
                            > -->
                            <span class="cell__tag__img">
                                <img  v-if="topItem.productTagImg" :src="topItem.productTagImg" alt="">
                            </span>
                        </p> 
                       <p class="mui-cell__bd_subtitle">{{ topItem.productDesc }}</p>

                    </div>
                    <m-button
                        slot="value"
                        :round="false"
                        type="plain"
                        size="xsmall"
                        class="page__top__item__button" 
                        @click="handleClick(topItem)"
                        >
                          {{topItem.buttonName}}
                          </m-button
                    >
                </m-cell>
                <div class="page__top__tips">
                    <img
                        class="icon__speaker"
                        src="../assets/icon-speaker.png"
                        alt=""
                    />
                    同时申请3个以上借款通过率99%
                </div>
            </div>
            <div class="filter__box">
                <div class="filter__box__title">
                    筛选：
                </div>
                <div class="filter__box__list">
                    <m-radio-group
                        v-model="filterIndex"
                        class="radio-group"
                        @change="getList"
                    >
                        <m-radio
                            v-for="option in radioOptions"
                            :key="option.label"
                            class="radio-item"
                            v-slot="{ isActive }"
                        >
                            <label
                                class="radio-item__label"
                                :class="{
                                    'radio-item__label_active': isActive
                                }"
                            >
                                {{ option.label }}
                            </label>
                        </m-radio>
                    </m-radio-group>
                </div>
            </div>
            <SyhList :list="otherList" :topIndex="2" /> 
        </div>
    </m-page>
</template>
<script>
import SyhList from '@/module/syh/common/list.vue'
import mixinClick from '@/module/syh/common/mixin-click'
// import SyhResult from '@/module/syh/common/result.vue'

import { getTrafficList } from '@/store/modules/syh'


export default {
    name: 'SyhListIndex',
    mixins:[ mixinClick ],
    components: {
        SyhList
        // SyhResult
    },
    data() {
        return {
            filterIndex: -1,
            list: [],
            positionCode:'',
            radioOptions: [
                {
                    label: '热门推荐',
                    value: 'hot'
                },
                {
                    label: '最新上新',
                    value: 'new'
                },
                {
                    label: '大额低息',
                    value: 'loan'
                }
            ],

            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            }
        }
    },
    computed: {
        topItem() {
            return this.list[0] || {}
        },
        otherList() {
            return this.list.slice(1)
        },
        attrCode() {
            return this.radioOptions[this.filterIndex]&&this.radioOptions[this.filterIndex].value
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            getTrafficList({ 
                attrCode: this.attrCode
            }).then(res => {
                if (res.success) {
                    this.list = res.result || []
                    return
                }
                this.list = []
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/common';

.page__syh {
    background: #fff;
    .page__content {
        padding: px2rem(24) 0;
    }
   
    ::v-deep .mui-btn_border {
        color: var(--auiColorPrimary);
        border-color: var(--auiColorPrimary);
        padding: 0 px2rem(20);
    }
  
    .cell__tag--yellow {
        color: #ffde69;
        margin-left: px2rem(16);
        &:after {
            border-color: #ffde69;
        }
    }
}
.page__top {
    padding: 0 px2rem(32);
}
.page__top__title {
    font-size: px2rem(32);
    color: #333333;
    line-height: px2rem(45);
}
.page__top__item {
    background: linear-gradient(90deg, #4286ff, #6fcdff);
    border-radius: px2rem(12);
    margin: px2rem(12) 0 px2rem(24);
    ::v-deep {
        .mui-cell__bd,
        .mui-cell__bd_subtitle {
            color: #fff;
        }
    }
    .page__top__item__button {
        border-color: #fff;
        color: var(--auiColorPrimary);
        font-weight: 600;
    }
}
.page__top__tips {
    background: #f8f8f8;
    border-radius: px2rem(4);
    padding: px2rem(14) px2rem(36);
    // height: px2rem(72);
    // line-height: px2rem(72);
    font-size: px2rem(24);
    color: #666666;
    margin-bottom: px2rem(24);

    .icon__speaker {
        display: inline-block;
        vertical-align: middle;
        width: px2rem(32);
        height: px2rem(32);
        margin-right: px2rem(16);
        margin-top: -1px;
    }
}
.filter__box {
    display: flex;

    // margin: px2rem(20) 0;
    padding: px2rem(20) px2rem(32);
    color: #666660;
    font-size: px2rem(24);
    justify-content: space-between;
    .filter__box__list {
    }
    .radio-item {
        display: inline-block;
    }

    .radio-item__label {
        font-size: px2rem(24);
        padding: px2rem(8) px2rem(24);
        margin-left: px2rem(32);
        color: #999;
        background-color: #f8f8f8;
        border-radius: px2rem(30);

        &.radio-item__label_active {
            color: var(--auiColorPrimary);
            background-color: #ecf2ff;
        }
    }
}
</style>
