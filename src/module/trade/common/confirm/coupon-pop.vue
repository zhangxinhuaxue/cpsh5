<!--
 * @Description: 红包popup， 选择红包
 * @Author: sunxj
 * @Date: 2019-01-09 18:08:48
 * @LastEditTime: 2019-01-10 16:42:21
 * @LastEditors: sunxj
 -->

<template>
    <div class="couponForMulti">
        <div class="aui-popup__hd">
            <m-icon v-if="showCancelBtn" type="close" class="close-icon" @click="cancel"></m-icon>
            {{popData.title}}
        </div>
        <div class="aui-popup__ft">
            <a href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd" style="background-color: #f8f8f8;">
            <div class="aui-cells aui-cells_radio">
                <template v-if="availableList.length">
                <label v-for="(item,index) in availableList" class="coupon" :for="index" :key="'available' + index" @click="getItem(index,item)">
                    <div class="left">
                        <span v-if="!item.groupId" class="tts">{{item.amtCoupon}}<i>元</i></span>
                        <span v-if="!item.groupId">{{item.useRule}}</span>
                        <span v-else>复合红包</span>
                    </div>
                    <div class="middle">
                        <p>{{item.name}}</p>
                        <p class="cart_coupon_date">{{item.endTime|timeYMD}}到期</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio" class="aui-check" >
                        <span v-show="index === activeIndex" class="icon-check1">
                             <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span v-show="index !== activeIndex" class="icon-uncheck1">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                    </div>
                </label>
                </template>
                <template v-if="unavailableList.length">
                <label v-for="(item,index) in unavailableList" class="coupon invalidCoupon" :key="'unavailable' + index">
                    <div class="left">
                        <span>{{item.amtCoupon}}<i>元</i></span>
                        <span>{{item.useEffect}}</span>
                    </div>
                    <div class="middle">
                        <p>{{item.name}}</p>
                        <p class="cart_coupon_date">{{item.endTime|timeYMD}}到期</p>
                    </div>
                    <div class="clearfix"></div>
                    <p class="invalidCoupon-tip">结算商品不符合使用条件</p>
                </label>
                </template>
                <label class="aui-cell aui-check__label notUseCoupon" for="no">
                    <div class="aui-cell__bd">
                        <p>不使用红包</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio"   class="aui-check" id="no" @click="getItem(-1)">
                        <span v-show="-1 === activeIndex" class="icon-check1">
                             <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span v-show="-1 !== activeIndex" class="icon-uncheck1">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
import findIndex from 'lodash/findIndex'
export default {
    name: 'coupon_popup',
    props: {
        popData: {
            type: [Array, Object]
        },
        showCancelBtn:{
            type:Boolean,
            default:false
        }
    },
    computed: {
        availableList() {
            return this.popData.couponList.availableList || []
        },
        unavailableList() {
            return this.popData.couponList.unavailableList || []
        },
        couponCodeSelect() {
            return this.popData.couponCodeSelect
        }
    },
    data() {
        return {
            activeItem: null,
            activeIndex: ''
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.activeIndex = this.availableList.findIndex((item) => {
                return item.code === this.couponCodeSelect
            })
            if (this.activeIndex !== -1) {
                this.getItem(this.activeIndex, this.availableList[this.activeIndex])
            } else {
                this.getItem(this.activeIndex)
            }
        },
        getItem(index, item) {
            this.activeIndex = index
            if (item) {
                this.activeItem = item
            } else {
                let isLen = !!(this.availableList.length + this.unavailableList.length)
                this.activeItem = {
                    code: '',
                    useEffect: isLen ? '不使用红包' : '无可用红包',
                    amt: '',
                    hasCoupon: isLen
                }
            }
        },
        confirm() {
            this.$emit('confirm', this.popData.type, this.activeItem)
            console.log(this.popData.type, this.activeItem)
        },
        cancel(){
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-popup__bd .aui-cells:before {
    display: none;
}

.aui-cells {
    background-color: #f8f8f8;
}
.icon-check1,
.icon-uncheck1 {
    font-size: px2rem(40);
}
.couponForMulti {
    .aui-popup__hd {
        font-size: px2rem(36);
        color: #222222;
    }
    .aui-popup__bd {
        padding-left: px2rem(32);
        padding-right: px2rem(32);
    }

    label {
        display: block;
        position: relative;
        height: px2rem(160);
        // border: px2rem(1) solid #ffe352;
        // border-radius: px2rem(10);
        margin-bottom: px2rem(20);
        padding: px2rem(20) 0;
        background: #fff;
        border-radius: px2rem(8);
        .left {
            float: left;
            // border-right: px2rem(1) dashed #fff1ab;
            padding: 0 px2rem(5);
            width: px2rem(200);
            overflow: hidden;
            text-align: center;
            span {
                display: block;
                line-height: 1.3;
                &:first-child {
                    font-size: px2rem(68);
                    font-weight: 600;
                    color: #FF3E00;
                    i {
                        font-size: px2rem(32);
                        font-weight: normal;
                        vertical-align: middle;
                    }
                }
                &:last-child {
                    font-size: px2rem(22);
                    color: #666;
                }
                &:only-child {
                    font-size: px2rem(32);
                    line-height: px2rem(100);
                }
            }
        }
        .middle {
            float: left;
            padding-left: px2rem(25);
            padding-top: px2rem(15);
            line-height: 2.0;
            p {
                width: px2rem(290);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                &:first-child {
                    font-size: px2rem(28);
                    color: #222;
                }
                &:last-child {
                    font-size: px2rem(24);
                    color: #666;
                }
            }
        }
        .aui-cell__ft {
            position: absolute;
            right: px2rem(32);
            top: 50%;
            transform: translateY(-50%);
        }
        &.invalidCoupon {
            border-color: #ccc;
            padding: 0;
            height: px2rem(200);
            * {
                color: #999!important;
            }
            .left {
                border-color: #ccc;
            }
            .invalidCoupon-tip {
                clear: both;
                line-height: px2rem(56);
                background-color: #fff;
                padding: px2rem(5) 0 0 px2rem(50);
                font-size: px2rem(24);
                border-top: #ccc dashed px2rem(1);
                margin-top: px2rem(20);
            }
        }
        &.notUseCoupon {
            .aui-cell__bd p {
                line-height: px2rem(100);
                padding-left: px2rem(20);
            }
        }
        .icon-check1 .path1:before {
            content: "\e906";
            color: #4286FF;
        }
        .icon-check1 .path2:before {
            content: "\e907";
            margin-left: -1em;
            color: #fff;
        }
    }
}
.invalidCoupon:before, .aui-cell:before, .aui-cell_auto:before, .aui-cell_checkbox:before{
    content: " ";
    border: none;
}
.icon-check1:before {
    content: " ";
}
.coupon {
    background: #fff;
}
</style>
