<template>
    <div class="custom__list" :class="{ result__list: type === 'result' }">
        <m-cell-group>
            <m-cell
                v-for="(item, index) in list"
                :key="item.trafficId"
                class="h180"
                :class="{ top__item: index < topIndex }"
                size="xlarge"
            >
                <img slot="icon" :src="item.productLogo" alt="" />
                <div slot="title">
                    <p class="mui-cell__bd_title_bold">
                        {{ item.productName }}
                        <!-- <m-tags outline class="cell__tag">新产品标签</m-tags> -->
                        <span v-if="item.productTagImg" class="cell__tag__img" >
                            <img :src="item.productTagImg" alt="">
                        </span>
                    </p>
                    <p class="mui-cell__bd_subtitle">{{ item.productDesc }}</p>
                </div>
                <m-button
                    slot="value"
                    :round="false"
                    :type="index < topIndex ? 'primary' : 'border'"
                    size="xsmall"
                    @click="handleClick(item)"
                    >
                    {{item.buttonName}}
                    <m-icon
                        v-if="index >= topIndex"
                        type="back1"
                        class="arrow__right"
                    ></m-icon>
                </m-button>
            </m-cell>
           
        </m-cell-group>
    </div>
</template>
<script>
import mixinClick from '@/module/syh/common/mixin-click'

export default {
    name: 'SyhList',
    mixins:[ mixinClick ],
    props: {
        type: {
            type: String,
            deafult: 'list'
        },
        list: {
            type: Array,
            default() {
                return []
            }
        },
        topIndex: {
            type: Number,
            default: 1
        },
        positionCode:{
            //  products:产品列表页  creditFail:授信失败  auto:auto页面
            type: String,
            default:''
        }
    },
    data() {
        return {
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
    methods: {
      
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/common';

.custom__list {
   
    .top__item {
        background: linear-gradient(270deg, #ffffff 0%, #fff4e7);
        margin: px2rem(8);
        &::after {
            display: none;
        }
        .page__top__item__button {
            border-color: #fff;
            color: var(--auiColorPrimary);
            font-weight: 600;
        }
    }
    ::v-deep .mui-cells .mui-cell:not(.mui-cell_small) {
        &::before {
            display: none;
        }
        &::after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 1px;
            border-top: 1px solid #e6e6e6;
            transform-origin: 0 0;
            transform: scaleY(0.5);
            left: 0.68267rem;
        }
      
    }

    ::v-deep .mui-btn_border {
        color: var(--auiColorPrimary);
        // border-color: var(--auiColorPrimary);
        // padding: 0 px2rem(20);
        border: none;
        padding: 0;
        .arrow__right {
            transform: rotate(180deg);
            font-size: px2rem(24);
            margin-top: px2rem(-4);
            margin-left: px2rem(-8);
        }
    }
    ::v-deep .mui-btn_primary {
        color: #fff;
        background: var(--auiColorPrimary);
        border-color: var(--auiColorPrimary);

        padding: 0 px2rem(20);
    }
    .cell__tag {
        color: #ff5547;
        margin-left: px2rem(16);
        &:after {
            border-color: #ff5547;
        }
    }

    // 结果页样式区分
    &.result__list {
        .top__item {
            margin: 0;
        }
        // ::v-deep .mui-btn_border {
        //     border: none;
        //     padding: 0;
        // }
    }
}
</style>
