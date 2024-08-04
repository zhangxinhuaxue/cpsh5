<template>
    <div class="pages-box">
        <m-page class="page__card">
            <hybrid-header slot="header" :config="barConfig" class="mui-bar_nav"></hybrid-header>
            <div slot="bottom" class="bottom__btn mui-fixedbottom">
                <div class="agreement">
                    <m-icon :type=" isAgree ? 'checkbox_checked' : 'checkbox_unchecked' " class="icon-checkbox" @click="handleToggle" ></m-icon>
                    我已阅读并同意<span class="color-link" @click="goProtocol">《手机号码购买协议》</span>
                </div>
                <m-button :round="false" @click="handleConfirm">免费领取</m-button>
            </div>
            <div class="page__content">
                <div class="btn__right">
                    <div class="btn__refresh" @click="getList(1)">
                        <span class="icon-refresh"></span>换一批
                    </div>
                </div>
                <div class="card__list">
                    <div
                        v-for="(item, index) in list"
                        :key="item.id"
                        class="card__item"
                        :class="{
                            'card__item__ctcc': item.company === 'CTCC',
                            'card__item__cucc': item.company === 'CUCC',
                            'card__item--active': index === activeIndex
                        }"
                        @click="handleActiveItem(index)"
                    >
                        <!-- <span class="card__item__tag">
                            电信
                        </span> -->
                        <div class="card__item__phone">
                            {{ item.phone }}
                        </div>
                        <div class="card__item__area">
                            {{ item.province }}{{ item.city }}
                        </div>
                        <span
                            v-show="index === activeIndex"
                            class="icon-select"
                        ></span>
                    </div>
                </div>

                <!-- 电信 -->
                <div class="card__detail">
                    <div
                        class="card__detail__summary"
                        :class="{
                            'card__detail__summary--ctcc':
                                activeCompany === 'CTCC',
                            'card__detail__summary--cucc':
                                activeCompany === 'CUCC'
                        }"
                    ></div>
                    <div class="card__detail__desc">
                        <div class="card__detail__title">
                            服务说明
                        </div>
                        1、本服务由浙江连连科技有限公司提供；<br />
                        2、全国接听免费，赠送来电显示，长市话统一资费，全国无漫游；<br />
                        3、流量日包当天不产生国内流量不收费，自动续订，当天24:00自动清零；<br />
                        4、套餐订购后立即生效，首月套餐月费按天分摊计费；<br />
                        5、套餐变更/取消次月生效，生效前按照之前的套餐资费标准收取；<br />
                        6、入网激活时候最低充值金额为10元；<br />
                        7、其他资费按标准资费执行；<br />
                        8、上述所指的全国范围不含我国港澳台地区，默认不开通国际长途、国际漫游及港澳台长途与漫游业务。<br />
                    </div>
                </div>

                <div class="page__address">
                    <div ref="addressBox" class="address__box"  @click="handleAddAddress">
                        <div v-if="!addressObj.receiveAddress" class="address__btn">
                            <span class="icon-add"></span>
                            添加收货地址
                        </div>
                        <div v-else class="address__detail">
                            <m-cell is-link
                                    size="xlarge"
                                    >
                                <div slot="title">
                                    <p >
                                       <span class="mui-cell__bd_title_bold">{{addressObj.receiveUserName}}</span>
                                        {{addressObj.receiveUserPhone}}
                                    </p>
                                    <p   class="mui-cell__bd_subtitle">
                                        {{addressObj.provinceCityArea}}{{addressObj.receiveAddress}}
                                    </p>
                                </div>

                            </m-cell>
                        </div>
                    </div>
                </div>
            </div>
        </m-page>
        <transition name="fade">
            <router-view  :form="addressObj" @updateAddress="handleUpdateAddress"></router-view>
        </transition>
    </div>
</template>
<script>
// /api/area/phone/render

import { h5Origin } from 'src/libs/domain'
import { getSIMcardList, createOrderSIMcard } from 'src/store/modules/sim-card'
import {AXD, isSupportSessionStorage} from 'src/libs/util'

export default {
    name: 'SIMCardDetail',

    data() {
        const {taskId,zoneCode,backUrl} = this.$route.query
        return {
            taskId,
            zoneCode,
            backUrl,
            isAgree: false,
            activeIndex: 0,
            list: [],
            addressObj:{
            },
            barConfig: {
                h5: {
                    title: '免费领取手机卡',
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            }
        }
    },
    computed: {
        activeItem(){
            return this.list[this.activeIndex] || {}
        },
        activeCompany(){
            return this.activeItem.company
        }
    },
    watch: {
    },
    components: {},
    created() {
        try{
            this.addressObj =  JSON.parse(sessionStorage.getItem('addressObj')||'{}')
        }catch (e) {
        }
        this.getList(0)
    },
    mounted() {
    },
    methods: {
        getList(refresh) {
            getSIMcardList({
                taskId:this.taskId,
                zoneCode:this.zoneCode,
                refresh // 是否刷新
            }).then(res => {
                if (res.success) {
                    this.list = res.result || []
                    this.activeIndex = 0
                    if (this.list.length === 0) {
                        this.$_alert('号码已售罄').then(res => {
                            this.$router.back()
                        })
                    }
                    return
                }
                this.$_toast(res.resultDes)

                if (res.code === '-1999' || res.code ==='-1997') {
                    AXD.util.login()
                }
            })
        },
        goProtocol() {
            let contractUrl = `${h5Origin}/h5/user/contract/viewTemplate/dhk_ll`
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: contractUrl,
                        isOutSiteUrl: false
                    },
                    callback: function(ret) {}
                })
            } else {
                this.resetHref(contractUrl)
            }
        },
        handleActiveItem(index) {
            this.activeIndex = index
        },
        handleToggle() {
            this.isAgree = !this.isAgree
        },
        handleAddAddress(){
            this.$router.push({
                path:'/pages/mall/sim-card/address',
                query:{
                    channelId:this.activeItem.channelId,
                    taskId:this.taskId,
                    zoneCode:this.zoneCode
                }
            })
        },
        handleUpdateAddress(obj){
            this.addressObj = obj
        },
        handleConfirm() {
            if(!this.addressObj.receiveAddress){
                this.$_toast('请先添加收货地址')
                try {
                    const $el = this.$refs.addressBox
                    $el.scrollIntoView()
                } catch (error) {
                    console.log(error)
                }
                return
            }

            if(!this.isAgree) {
                this.$_toast('请阅读并同意手机号码购买协议')
                return
            }

            createOrderSIMcard({
                ...this.addressObj,
                taskId:this.taskId,
                phone: this.activeItem.phone
            }).then(res => {
                if (res.success) {
                    this.$_toast({
                        icon: 'check',
                        isSvg: true,
                        time: 1000,
                        txt: '领取成功',
                        callback:()=>{
                            this.backUrl && this.resetReplace(this.backUrl)
                        }
                    })
                    return
                }
                this.$_toast(res.resultDes)
                if (res.code === '-1999' || res.code ==='-1997') {
                    AXD.util.login()
                    return
                }
                if(res.code === '8305'){
                    // 号码被占用
                    this.getList(1)
                }

            })
        }

    }
}
</script>

<style lang="scss" scoped>
$colorPrimary: #4286ff;
.pages-box {
    height: 100%;
}
.color-link {
    color: $colorPrimary;
}
.page__card {
    .mui-fixedbottom {
        padding: px2rem(32) px2rem(32) px2rem(24);
    }

    .mui-fixedbottom ~ ::v-deep.mui-content {
        bottom: px2rem(216);
    }
    .agreement {
        color: #999999;
        line-height: px2rem(32);
        font-size: px2rem(24);
        margin-bottom: px2rem(32);
        .icon-checkbox {
            margin-right: px2rem(12);
            color: $colorPrimary;
            font-size: px2rem(32);
            vertical-align: middle;
        }
    }
}

.page__content {
    height: 100%;
    overflow-y: auto;
    padding: 0 px2rem(32) px2rem(32);
    background: linear-gradient(180deg, #e9f4ff 0%, #f8f8f8 100%);

    .card__list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .card__item {
            width: px2rem(331);
            height: px2rem(132);
            margin-bottom: px2rem(24);
            padding: px2rem(24) px2rem(32);
            border: px2rem(2) solid transparent;
            border-radius: px2rem(12);
            position: relative;
            color: #666;
            font-size: px2rem(24);
            white-space: nowrap;
            overflow: hidden;

            &.card__item--active {
                color: #333;
            }
            &.card__item__ctcc {
                background: center / 100% no-repeat url(../assets/bg-ctcc.png);
                &.card__item--active {
                    background: center / 100% no-repeat
                        url(../assets/bg-ctcc-active.png);
                }
            }
            &.card__item__cucc {
                background: center / 100% no-repeat url(../assets/bg-cucc.png);
                &.card__item--active {
                    background: center / 100% no-repeat
                        url(../assets/bg-cucc-active.png);
                }
            }
            .card__item__phone {
                font-weight: 600;
                color: #333;
                font-size: px2rem(32);
                line-height: px2rem(44);
                // margin-bottom: px2rem(4);
            }

            // .card__item__tag {
            //     display: inline-block;
            //     width: px2rem(64);
            //     height: px2rem(28);
            //     line-height: px2rem(28);
            //     color: #ffffff;
            //     font-size: px2rem(20);
            //     text-align: center;
            //     background: #ff3e00;
            //     border-radius: px2rem(12) 0 px2rem(12) 0px;
            //     position: absolute;
            //     left: 0;
            //     top: 0;
            // }
            .icon-select {
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
    }
    .card__detail {
        background: #fff;
        border-radius: px2rem(12);
        padding: px2rem(24) px2rem(32) px2rem(32);

        .card__detail__summary {
            // background: linear-gradient(90deg,#67c3ff, #4286ff);
            // border-radius: px2rem(8);
            width: px2rem(622);
            height: px2rem(228);
            margin: 0 auto;

            &.card__detail__summary--ctcc {
                background: no-repeat center / 100%  url(../assets/summary-ctcc.png);
            }
            &.card__detail__summary--cucc {
                height: px2rem(184);
                background: no-repeat center / 100% url(../assets/summary-cucc.png);
            }
        }
        .card__detail__desc {
            margin-top: px2rem(32);
            font-size: px2rem(28);
            color: #999;
            line-height: px2rem(40);
            .card__detail__title {
                font-size: px2rem(32);
                color: #666;
                line-height: px2rem(45);
                margin-bottom: px2rem(12);
            }
        }
    }
}
// #2cb5fc #f66045
.page__address {
    height: px2rem(152);
    margin-top: px2rem(24);
    padding-top: px2rem(4);
    background-image: repeating-linear-gradient(
        -45deg,
        #f66045,
        #f66045 px2rem(18),
        #fff 0,
        #fff px2rem(26),
        #2cb5fc 0,
        #2cb5fc px2rem(44),
        #fff 0,
        #fff px2rem(52)
    );
    background-size: 100%;
    border-radius: px2rem(12);
    .address__box {
        height: 100%;
        background: #fff;
    }
    .address__btn {
      padding: px2rem(28) 0;
      height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: px2rem(46);
        font-size: px2rem(32);
        color: $colorPrimary;
    }
}

.bottom__btn {
    z-index: 99;
    height: auto;
    padding: px2rem(20) 0;
    .mui-btn_primary,
    .mui-btn_primary:active {
        background-color: $colorPrimary;
        color: #fff;
        border-color: $colorPrimary;
        &.mui-btn.disabled {
            color: #999;
            background-color: #e6e6e6;
            border-color: #e6e6e6;
        }
    }
}
.btn__right {
    text-align: right;
    margin-bottom: px2rem(16);
}
.btn__refresh {
    display: inline-block;
    font-size: px2rem(28);
    color: $colorPrimary;
}
.icon-add {
    display: inline-block;
    width: px2rem(36);
    height: px2rem(36);
    margin-right: px2rem(12);
    background: center / 100% url(../assets/icon-add.png);
}
.icon-refresh {
    display: inline-block;
    vertical-align: middle;
    width: px2rem(28);
    height: px2rem(28);
    margin-right: px2rem(8);
    background: center / 100% url(../assets/icon-refresh.png);
}
.icon-select {
    display: inline-block;
    width: px2rem(44);
    height: px2rem(44);
    background: center / 100% url(../assets/icon-select.png);
}
</style>
