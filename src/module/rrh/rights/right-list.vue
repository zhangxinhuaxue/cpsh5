<template>
<div class="mui-page view">
    <hybrid-header :config="barConfig" slot="header"></hybrid-header>
    <div class="mui-content">
        <template v-if="rightPackages.length">
            <template v-for="(pkg,index) in rightPackages">
                <m-cell :key="index" size="xlarge" @click="viewRightDetail(pkg)">
                    <img slot="icon" :src="pkg.image" alt="" />
                    <div slot="title">
                        <p class="pkg-name">{{pkg.packageName}}</p>
                        <p class="pkg-time"><span>购买时间：</span><span>{{tranformDate(pkg.buyTime)}}</span></p>
                    </div>
                    <div slot="value">
                        <p class="pkg-price"><span class="price-prefix">¥</span><span>{{pkg.price/1000}}</span></p>
                        <p class="pkg-status"><span :class="pkgStatusClass(pkg)">{{pkg.statusText}}</span></p>
                    </div>
                </m-cell>
            </template>
        </template>
        <template v-else>
            <div class="pkg-default">
                <div class="default-img">
                    <img :src="defaultImgUrl" alt="" />
                </div>
                <div class="default-content">您还未开通悦享权益，现在去申请取现开通立享尊贵权益</div>
                <div class="default-btn">
                    <m-button size="xsmall" :round="false" @click="applyRight">申请开通</m-button>
                </div>
            </div>
        </template>
    </div>
</div>
</template>

<script>
import {
    getRightPackages
} from 'store/modules/rrh'
import { AXD } from 'src/libs/util'
import defaultImgUrl from '../../../assets/images/default_empty.png'
export default {
    name: 'rightList',
    data() {
        return {
            defaultImgUrl: defaultImgUrl,
            rightPackages: [],
            barConfig: {
                leftAction: '',
                h5: {
                    title: ''
                },
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: ''
                }
            }
        }
    },
    methods: {
        // 状态
        /**
         * 已支付待权益生成
         * PAID(0, "已支付待权益生成"),
         * 已生成权益可用
         * WAIT_FOR_USE(1, "已生成权益可用"),
         * 已使用
         * USED(2, "已使用"),
         * 已取消
         * CANCELLED(3, "已取消"),
         * 已失效
         * INVALID(4, "已失效"),
         * 已过期
         * EXPIRED(5, "已过期"),
         */
        pkgStatusClass(pkg = {}) {
            let sc = []
            switch (parseInt(pkg.status)) {
                case 3:
                case 4:
                case 5:
                    sc.push('status-dead')
                    break
                default:
                    sc.push('status-use')
                    break
            }
            return sc
        },
        // 时间转化
        tranformDate(str = '') {
            if (!str) return ''
            str = str.split(' ')[0]
            return str.trim()
        },
        // 获取权益包列表
        queryRightPackages() {
            getRightPackages().then(res => {
                if (res.success) {
                    this.rightPackages = (res.result && res.result.list) || []
                } else if (res.code === '-1999' || res.code === '-1997') {
                    AXD.util.login()
                }
            })
        },
        // 初始化加载
        init() {
            this.queryRightPackages()
        },
        // 查看权益详情
        viewRightDetail(pkg = {}) {
            if (!pkg.id) return
            this.$router.push({
                path: '/pages/rrh/rightDetail',
                query: {
                    id: pkg.id,
                    name: pkg.packageName
                }
            })
        },
        // 跳转至产品列表页
        applyRight() {
            this.$router.push({
                path: '/pages/rrh/index'
            })
        }
    },
    created() {
        this.init()
    }
}
</script>

<style lang="scss" scoped>
@import '../../../style';
@import '../styles/common';
@import '../../../assets/styles/flex';

.mui-content {
    background-color: #f8f8f8;
    padding: px2rem(8) px2rem(32);

    ::v-deep .mui-cell_xlarge {
        margin-top: px2rem(24);
        box-sizing: border-box;
        height: px2rem(182);
        padding: px2rem(24) 0 px2rem(24) px2rem(32);
        border-radius: px2rem(12);

        .mui-cell__hd_icon {
            width: px2rem(134);
            height: px2rem(134);
            margin: 0;

            img {
                max-width: 100%;
                max-height: 100%;
                height: initial;
                width: initial;
            }
        }

        .pkg-name {
            margin: 0 px2rem(10) 0 px2rem(24);
            font-size: px2rem(32);
            line-height: px2rem(45);
            text-align: left;
        }

        .pkg-time {
            margin: px2rem(16) 0 0 px2rem(24);
            font-size: px2rem(24);
            line-height: px2re(33);
            color: #666666;
            text-align: left;
        }

        .pkg-price {
            font-size: px2rem(28);
            line-height: px2rem(40);
            margin-right: px2rem(32);
        }

        .pkg-status {
            margin-top: px2rem(14);
            font-size: px2rem(28);
            line-height: px2rem(40);
            margin-right: px2rem(32);

            .status-use {
                color: #73a5ff;
            }

            .status-dead {
                color: #d2d2d2;
            }
        }
    }

    .pkg-default {
        position: absolute;
        top: px2rem(304);
        left: px2rem(87);
        width: px2rem(576);
        height: px2rem(560);
        display: flex;
        flex-flow: column;
        align-items: center;
        font-size: px2rem(28);
        text-align: center;

        .default-img {
            width: px2rem(320);
            height: px2rem(320);
        }

        .default-content {
            margin-top: px2rem(30);
            font-size: px2rem(32);
            line-height: px2rem(45);
            color: #999999;
        }

        .default-btn {
           margin-top: px2rem(40);
           ::v-deep .mui-btn {
                width: px2rem(200);
                height: px2rem(80);
                padding: px2rem(16) px2rem(32) px2rem(17) px2rem(32);
                font-size: px2rem(32);
                line-height: px2rem(45);
                font-weight: bold;
            }
        }
    }
}
</style>
