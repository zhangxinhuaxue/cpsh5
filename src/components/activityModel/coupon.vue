
<template>
    <!-- 去除所有自定义版式的间距，交给设计控制 -->
    <!-- by daly 20190927 -->
    <div :data-name="config.title" type="coupon" :class="isFloor" :style="getStyle">
        <div :class="[couponClass,{'coupon_isCustom':isCustom}]">
            <template v-if="!isCustom">
                <section :class="item.className" :style="getHBStyle(item.img)" @click="receiveIt(item.accessToken)" v-for="(item, index) in couponData" :key="index">
                    <div>
                        <label v-if="item.className === 'coupon__money'" :style="{'color': formatColor(item.amountColor)}">
                            {{ item.flag }}
                        </label>
                        <span :style="{'color': formatColor(item.amountColor)}">{{ item.displayTxt }}</span>
                        <label v-if="item.className !== 'coupon__money'" :style="{'color': formatColor(item.amountColor)}">
                            {{ item.flag }}
                        </label>
                    </div>
                    <div>
                        <h4 :style="{'color': formatColor(item.nameColor)}">{{ item.name }}</h4>
                        <p :style="{'color': formatColor(item.limitColor)}">{{ item.limit }}</p>
                    </div>
                </section>
            </template>
            <template v-else>
                <div v-for="(item, i) in couponData" :key="i" :class="['hongbao-btn']" href="javascript:;" @click="receiveIt(item.accessToken)" :data-couponid="item.accessToken">
                    <template>
                        <axd-image :src="item.customImg"></axd-image>
                    </template>
                </div>
            </template>
        </div>
        <coupon-dialog :config="dialogConfig"></coupon-dialog>
        <vip-dialog
          :visible.sync="vipDialogVisible"
          type="notVIP"
        />
    </div>
</template>
<script type="text/javascript">
import { AXD } from 'src/libs/util'
import { receiveCoupon } from 'src/store/modules/activity'
import { formatImg, formatColor, formatImgWH } from 'src/libs/util'
import axdImage from 'src/components/image/index.vue'
import axdToast from 'components/toast/index'
import couponDialog from './cp-dialog.vue'
import vipDialog from './vipDialog.vue'

export default {
    name: 'coupon',
    data() {
        return {
            isSingle: false,
            couponClass: 'hb-list',
            styleObj: {},
            bgColor: '',
            couponData: [],
            dialogConfig: {
                show: false,
                title: '恭喜您!',
                couponTop: 'YEAH~',
                couponTips: '已成功领取红包<br>快去使用吧!',
                couponUrl: '',
                btnTxt: '立即使用',
                showBtn: true,
                showAir: true
            },
            vipDialogVisible: false
        }
    },
    components: {
        couponDialog,
        vipDialog,
        axdImage
    },
    props: {
        config: {
            type: Object,
            default: () => {
                return {
                    blockLayoutStyle: '',
                    bgColor: '',
                    img: '',
                    showBtn: true
                }
            }
        },
        couponList: {
            type: Array,
            required: true,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: []
        },
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
    beforeMount() {
        let classObj = {
            'coupon_single': 'coupon__one',
            'coupon_single_new': 'coupon__one',
            'coupon_more': 'coupon__two',
            'coupon_more__new': 'coupon__two',
            'coupon_three_new': 'coupon__three'
        }
        this.couponClass = (Object.keys(classObj).includes(this.config.blockLayoutStyle) ?
            classObj[this.config.blockLayoutStyle] :
            'coupon__two') + ' coupon__list'

        // 处理传过来的数据
        if (this.couponList && this.couponList.length) {
            console.log(this.couponList)
            if (this.isCustom) {
                this.couponData = this.couponList
                return
            }
            let category = ''

            this.couponData = this.couponList.map((coupon) => {
                category = coupon.category

                if (category === 'group') {
                    // 复合红包
                    coupon.displayTxt = coupon.sheet
                    coupon.flag = '张券'
                    coupon.className = 'coupon__sheet'
                } else if (category === 'deductible' || category === 'full_cut' || category === 'free_interest' || category === 'product' || category === 'shop' || category === 'money_off') {
                    // 现金红包  满减  免息
                    coupon.displayTxt = coupon.money
                    coupon.flag = '¥'
                    coupon.className = 'coupon__money'
                } else if (category === 'discount') {
                    coupon.displayTxt = coupon.discount
                    coupon.flag = '折'
                    coupon.className = 'coupon__discount'
                }

                return coupon
            })
        }
    },
    methods: {
        formatColor,
        receiveIt(couponIdsEnum) {
            this.hongbao({
                couponIdsEnum
            })
        },
        hongbao(s) {
            receiveCoupon(s, (data) => {
                if (data.code === '10010' || data.code === '-1999' || data.code === '-1997') {
                    // 需要引用$.AXD.util js
                    AXD.util.login(this.customLoginParam)
                    return
                } else if (data.code === '9999') {
                    this.vipDialogVisible = true
                    return
                } else if (data.code === '10020') {
                    AXD.util.addBasicInfo()
                    return
                }
                if (data.success) {
                    if (!data.result) {
                        axdToast('亲，不要太频繁，请一分钟后再试')
                    } else {
                        Object.assign(this.dialogConfig, {
                            show: true,
                            title: '恭喜您!',
                            couponTop: 'YEAH~',
                            couponTips: '已成功领取红包<br>快去使用吧!',
                            btnTxt: '立即使用',
                            showAir: true
                        })
                        if (data.resultDes) {
                            this.dialogConfig.showBtn = true
                            this.dialogConfig.couponUrl = data.resultDes || '/pages/rrh/index'
                        }
                    }
                } else {
                    if (data.code === '10000') { // 已领取
                        Object.assign(this.dialogConfig, {
                            show: true,
                            title: '领过喽!',
                            couponTop: '. . .',
                            couponTips: '您已领取过一次了哟<br>快把福利告诉更多小伙伴吧!',
                            couponUrl: data.result || '/pages/rrh/index',
                            btnTxt: '去使用',
                            showBtn: true,
                            showAir: false
                        })
                    } else {
                        axdToast(data.resultDes)
                    }
                }
            })
        },
        getHBStyle(imgSrc) {
            return {
                'background-image': 'url("' + imgSrc + '")',
                'background-size': '100% 100%'
            }
        }
    },
    computed: {
        // 如需要把标题添加到楼层里，则类名为floor
        isFloor() {
            return this.config.floorShow === 'y' ? 'floor' : null
        },
        // 如果下发列表里带有自定义图片参数，说明这个红包模块是自定义的
        // eslint-disable-next-line vue/return-in-computed-property
        isCustom() {
            console.log(this.couponList[0].customImg)
            if (this.couponList[0].customImg) {
                return true
            }
        },
        getStyle() {
            let backgroundSize = '100% 100%'
            let backgroundColor = formatColor(this.config.bgColor)

            if (this.config.img) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.styleObj = {
                    backgroundSize,
                    backgroundColor,
                    'background-image': 'url(' + this.config.img + ')'
                }
            } else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.styleObj = {
                    backgroundSize,
                    backgroundColor
                }
            }

            return this.styleObj
        }
    }
}
</script>
<style lang="scss">
@import './style';

// cyrillic-ext
@font-face {
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    src: local('Impact'), url(https://fonts.gstatic.com/l/font?kit=jtUY83O5VEhzjUctwNPMo_esZW2xOQ-xsNqO47m55DA&skey=5128cd07406988e&v=v8) format('woff2');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

// cyrillic
@font-face {
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    src: local('Impact'), url(https://fonts.gstatic.com/l/font?kit=ZBUH7cp8T_ExTflKD-HEqPesZW2xOQ-xsNqO47m55DA&skey=5128cd07406988e&v=v8) format('woff2');
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

// greek-ext
@font-face {
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    src: local('Impact'), url(https://fonts.gstatic.com/l/font?kit=WbJ-Oy5zHb3FpYjMwyRK3fesZW2xOQ-xsNqO47m55DA&skey=5128cd07406988e&v=v8) format('woff2');
    unicode-range: U+1F00-1FFF;
}

// greek
@font-face {
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    src: local('Impact'), url(https://fonts.gstatic.com/l/font?kit=3smcbG2VqzWje5_fh8Gpg_esZW2xOQ-xsNqO47m55DA&skey=5128cd07406988e&v=v8) format('woff2');
    unicode-range: U+0370-03FF;
}

// latin-ext
@font-face {
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    src: local('Impact'), url(https://fonts.gstatic.com/l/font?kit=CC3eHVdpicjUvrVelSlHrPesZW2xOQ-xsNqO47m55DA&skey=5128cd07406988e&v=v8) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

// latin
@font-face {
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    src: local('Impact'), url(https://fonts.gstatic.com/l/font?kit=Q8EoN0_Oow67nwSRSWFESQ&skey=5128cd07406988e&v=v8) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}

$designWidth: 750;
.coupon__list {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    align-content: flex-start;
    background-size: 100% 100%;
    // padding-bottom: px2rem(10);
}

// 一行一列的红包样式
.coupon__one {
    section {
        width: px2rem(730);
        height: px2rem(130);
        margin-top: px2rem(10);
        position: relative;
        div:first-child {
            width: px2rem(212);
            height: px2rem(130);
            position: absolute;
            left: 0;
            top: 0;
        }
        div:last-child {
            width: px2rem(320);
            height: px2rem(130);
            position: absolute;
            left: px2rem(220);
            top: 0;
            overflow: hidden;
        }
        h4 {
            font-size: px2rem(30);
            height: px2rem(43);
            line-height: px2rem(43);
            overflow: hidden;
            margin-top: px2rem(30);
        }
        p {
            font-size: px2rem(20);
            height: px2rem(40);
            line-height: px2rem(40);
            overflow: hidden;
        }
        span {
            font-size: px2rem(75);
            font-family: 'Impact';
            line-height: px2rem(130);
            display: block;
            text-align: center;
        }
    }
    div {
        display: inline-block;
    }
    .coupon__sheet {
        label {
            font-size: px2rem(24);
            position: absolute;
            top: 0;
            right: px2rem(10);
            line-height: px2rem(130);
        }
    }
    .coupon__money {
        label {
            font-size: px2rem(24);
            position: absolute;
            left: px2rem(10);
            top: px2rem(5);
        }
    }
    .coupon__discount {
        label {
            font-size: px2rem(24);
            position: absolute;
            top: 0;
            right: px2rem(20);
            line-height: px2rem(130);
        }
    }
}

// 一行两列的红包样式
.coupon__two {
    // width: px2rem(740);
    margin: 0 auto;
    section {
        width: px2rem(360);
        height: px2rem(130);
        margin-top: px2rem(10);
        position: relative;
    }
    h4 {
        font-size: px2rem(22);
        line-height: px2rem(30);
        overflow: hidden;
        position: absolute;
        width: px2rem(120);
        height: px2rem(60);
        left: px2rem(146);
        top: px2rem(27);
        font-weight: 600;
    }
    p {
        font-size: px2rem(20);
        height: px2rem(40);
        width: px2rem(260);
        line-height: px2rem(40);
        overflow: hidden;
        position: absolute;
        bottom: 0;
        text-align: center;
    }
    span {
        font-size: px2rem(50);
        font-family: 'Impact';
        position: absolute;
        top: px2rem(27);
    }
    label {
        font-size: px2rem(22);
        position: absolute;
    }
    .coupon__sheet {
        span {
            left: px2rem(30);
            width: px2rem(60);
            text-align: center;
        }
        label {
            left: px2rem(90);
            top: px2rem(45);
        }
    }
    .coupon__money {
        span {
            left: px2rem(10);
            width: px2rem(123);
            text-align: center;
        }
        label {
            left: px2rem(10);
            top: px2rem(10);
        }
    }
    .coupon__discount {
        span {
            left: px2rem(30);
        }
        label {
            left: px2rem(100);
            top: px2rem(45);
        }
    }
}

// 一行三列的红包样式
.coupon__three {
    // width: px2rem(740);
    margin: 0 auto;
    section {
        width: px2rem(236);
        height: px2rem(170);
        margin-top: px2rem(10);
        position: relative;
    }
    h4 {
        font-size: px2rem(22);
        line-height: px2rem(30);
        overflow: hidden;
        position: absolute;
        top: px2rem(17);
        left: px2rem(13);
        text-align: center;
        text-overflow: ellipsis;
        height: px2rem(30);
        width: px2rem(210);
        font-weight: 600;
    }
    p {
        font-size: px2rem(20);
        height: px2rem(40);
        width: px2rem(220);
        line-height: px2rem(40);
        overflow: hidden;
        position: absolute;
        left: px2rem(6);
        bottom: px2rem(5);
        text-align: center;
    }
    span {
        font-size: px2rem(60);
        font-family: 'Impact';
        display: block;
    }
    label {
        font-size: px2rem(22);
        display: block;
    }
    div:first-child {
        position: relative;
        width: 100%;
        height: 100%;
        display: -webkit-box;
        display: -moz-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -ms-flex-pack: distribute;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        align-content: center;
    }
}

.hb-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
}

.coupon_isCustom {
    // padding: px2rem(20) px2rem(20) 0;
    overflow: hidden;
    .hongbao-btn {
        // margin-bottom: px2rem(20);
    }
    &.coupon__one {
        .hongbao-btn {
            display: block;
            width: 100%; // padding: px2rem(5) 0;
            text-align: center;
            div {
                display: block;
            }
            img {
                // width: auto;
                // max-width: px2rem(710);
                // margin: 0 auto;
            }
        }
    }
    &.coupon__two {
        .hongbao-btn {
            // display: block;
            // width: 49%;
            width: 50%;
            img {
                width: 100%;
            }
        }
    }
    &.coupon__three {
        .hongbao-btn {
            // display: block;
            // width: 32%;
            // float: left;
            width: 33.3%;
            img {
                width: 100%;
            }
        }
    }
}
.mui-dialog__ft {
    line-height: 2.13333rem!important;
}
</style>
