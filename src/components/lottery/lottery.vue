<template>
    <div :class="classObj" :data-name="config.title">
        <component :is="lotteryType" :initInfo="initInfo" :cahshoutFlag="cahshoutFlag" :chanceCount="chanceCount" :pointsRunNum="pointsRunNum" :toDoLottery="toDoLottery" :isDisabledState="isDisabledState" :prizeInfo="prizeInfo" v-on:beforeLottery="beforeLottery" v-on:afterLottery="afterLottery"></component>
        <lotteryDialog :chanceCount="chanceCount" :dialogObj="dialogObj" v-show="yes" @onClose="onClose"></lotteryDialog>
    </div>
</template>
<script type="text/javascript">
import Vue from 'vue'
import grid from './grid.vue'
import rotary from './rotary.vue'
import cashout from './cashout.vue'
import lotteryDialog from './dialog.vue'
import { appShare } from 'libs/share'
import { AXD } from 'libs/util'
import {
    getLotteryInitInfo,
    getLotteryRun,
    getLotteryExchangePoints,
    getLotteryShareAddChance
} from 'src/store/modules/activity'
import { accessLog } from 'src/libs/accessLog'

export default {
    data() {
        return {
            // 以下为默认值
            shareCallBack() {
                if (aixuedai.isUavoApp != 'n') {
                    appShare('', (ret) => {
                        if (ret && ret.data.result === 'true') {
                            this.onShareReturn()
                        }
                    })
                } else {
                    window.location.href = aixuedai.appDownloadUrl
                }
            },
            ruleCallBack() {
                document.querySelector('.rule-btn').click()
            },
            earnUrl: '/app/scoretask/getscoretask',
            scoreUrl: '/pages/points/index',
            // pointsUrl: '/app/scoretask/getscoretask',
            hbUrl: '',
            token: undefined,
            initInfo: {},
            isDisabledState: false,
            prizeInfo: {},
            toDoLottery: false,
            chanceCount: 0,
            pointsRunNum: 0, // 积分可兑换的抽奖次数，只有在配置了积分可兑换且没有免费抽奖机会了才会返回
            yes: false,
            dialogObj: {
                btn: []
            },
            cahshoutFlag: false
        }
    },
    components: {
        grid,
        rotary,
        cashout,
        lotteryDialog
    },
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
    created() {
        Object.assign(this.$data, this.config)
        this.loadInitInfo()

        // 兼容老版本的分享回调
        let me = this
        window.onShareReturn = (status) => {
            if (status && status === 'success') {
                me.onShareReturn()
            }
        }
    },
    watch: {
        'initInfo.notifyAward.prizeTitle'(v, ov) {
            if (v && this.initInfo.lotteryType == '3') {
                this.dialogObj = this.dialogInfo[10]
                this.dialogObj.desc = `恭喜获得<br>${this.initInfo.notifyAward.prizeTitle || ''}`
                this.yes = true
            }
        }
    },
    computed: {
        classObj: function() {
            return {
                'lottery': true,
                'floor': this.config.floorShow && this.config.floorShow === 'y'
            }
        },
        lotteryType: function() {
            // return this.initInfo.lotteryType == '1' ? 'grid' : (this.initInfo.lotteryType == '0' ? 'rotary' : undefined)
            if (this.initInfo.lotteryType == '1') {
                return 'grid'
            } else if (this.initInfo.lotteryType == '0') {
                return 'rotary'
            } else if (this.initInfo.lotteryType == '3') {
                return 'cashout'
            } else {
                return undefined
            }
        },
        dialogInfo: function() {
            let self = this
            return {
                // 未中奖
                1: {
                    containClass: 'no-prize',
                    title: '敲遗憾~',
                    desc: '啊嗷 没中奖呢~<br>换个姿势 再来一次~',
                    btn: [{
                        title: '再玩一次',
                        func() {
                            self.yes = false
                        }
                    }]
                },
                // 中奖：红包 提供跳转url
                2: {
                    containClass: 'prize',
                    title: '中奖咯',
                    desc: '恭喜你获得<br><em>' + self.prizeInfo.prizeTitle + '</em>',
                    btn: [{
                        title: '立即使用',
                        func() {
                            window.location.href = '/pages/rrh/index'
                        }
                    }, {
                        title: '再玩一次',
                        func() {
                            self.yes = false
                        }
                    }]
                },
                // 中奖：积分 提供跳转url
                3: {
                    containClass: 'prize',
                    title: '中奖咯',
                    desc: '恭喜你获得<br><em>' + self.prizeInfo.prizeTitle + '</em>',
                    btn: [{
                        title: '立即查看',
                        func() {
                            window.location.href = '/pages/points/index'
                            // let pageUrl = self.prizeInfo.prizeUrl ? self.prizeInfo.prizeUrl : self.scoreUrl
                            // self.openInApp(pageUrl)
                            // if (aixuedai.isUavoApp != 'n') {
                            //     // window.location.href = self.prizeInfo.prizeUrl ? self.prizeInfo.prizeUrl : self.scoreUrl
                            //     let pageUrl = self.prizeInfo.prizeUrl ? self.prizeInfo.prizeUrl : self.scoreUrl
                            //     self.openInApp(pageUrl)
                            // } else {
                            //     window.location.href = aixuedai.appDownloadUrl
                            // }
                        }
                    }, {
                        title: '再玩一次',
                        func() {
                            self.yes = false
                        }
                    }]
                },
                // 无抽奖机会：无积分、有分享
                4: {
                    containClass: 'no-prize',
                    title: '没有抽奖机会啦~',
                    desc: '不过瘾 还想玩？点击<br>页面规则查看攻略~',
                    btn: [{
                        title: '查看攻略',
                        func() {
                            self.ruleCallBack()
                            self.yes = false
                        }
                    }, {
                        title: '立即分享',
                        func() {
                            self.shareCallBack()
                            self.yes = false
                        }
                    }]
                },
                // 无抽奖机会：有积分、无分享
                5: {
                    containClass: 'no-prize',
                    title: '没有抽奖机会啦~',
                    desc: `使用${this.initInfo.pointsConsume}积分<br>兑换一次抽奖机会`,
                    btn: [{
                        title: '再考虑一下',
                        func() {
                            self.yes = false
                        }
                    }, {
                        title: '确定',
                        func() {
                            self.pointsChange()
                            self.yes = false
                        }
                    }]
                },
                // 无抽奖机会：有积分、有分享
                6: {
                    containClass: 'no-prize',
                    title: '没有抽奖机会啦~',
                    desc: '不过瘾 还想玩？<br>预知详情 查看页面规则~',
                    btn: [{
                        title: '积分兑换',
                        func() {
                            self.pointsChange()
                            self.yes = false
                        }
                    }, {
                        title: '立即分享',
                        func() {
                            self.shareCallBack()
                            self.yes = false
                        }
                    }]
                },
                // 无抽奖机会：无积分、无分享
                7: {
                    containClass: 'no-prize',
                    title: '没有抽奖机会啦~',
                    desc: '不过瘾 还想玩？点击<br>页面规则查看攻略~',
                    btn: [{
                        title: '查看攻略',
                        func() {
                            self.ruleCallBack()
                            self.yes = false
                        }
                    }]
                },
                // 积分兑换：兑换成功
                8: {
                    containClass: 'points-success',
                    title: '',
                    desc: '积分兑换成功~<br>您又获得一次抽奖机会',
                    btn: [{
                        title: '立即抽奖',
                        func() {
                            self.yes = false
                        }
                    }]
                },
                // 积分兑换：兑换失败
                9: {
                    containClass: 'points-fail',
                    title: '',
                    desc: '您的积分不足~<br>请先去赚积分~',
                    btn: [{
                        title: '去赚积分',
                        func() {
                            self.openInApp(self.scoreUrl)
                            // if (aixuedai.isUavoApp != 'n') {
                            //     // window.location.href = self.scoreUrl
                            //     self.openInApp(self.scoreUrl)
                            // } else {
                            //     window.location.href = aixuedai.appDownloadUrl
                            // }
                        }
                    }]
                },
                // 取现抽奖获取红包弹框
                10: {
                    containClass: 'prize',
                    title: '中奖咯',
                    desc: '',
                    btn: [{
                        title: '我知道了',
                        func() {
                            self.yes = false
                        }
                    }]
                },
                // 取现抽奖报名成功弹框
                11: {
                    containClass: 'points-success',
                    title: '报名成功',
                    desc: '恭喜你报名成功~',
                    btn: [{
                        title: '知道了',
                        func() {
                            self.yes = false
                        }
                    }, {
                        title: '立即取现',
                        func() {
                            accessLog({type: 'button', name: 'button-go-cash', desc: '报名成功立即取现人数'})
                            self.yes = false
                            window.location.href = '/pages/rrh/index'
                        }
                    }]
                },
                // 取现抽奖未开始弹框
                12: {
                    containClass: 'points-success',
                    title: '',
                    desc: '', // 动态设置提示语
                    btn: [{
                        title: '知道了',
                        func() {
                            self.yes = false
                        }
                    }, {
                        title: '立即取现',
                        func() {
                            window.location.href = '/pages/rrh/index'
                            self.yes = false
                        }
                    }]
                },
                13: { // 积分夺宝积分支付弹框
                    containClass: 'pointsFirst',
                    title: '',
                    desc: '', // 动态设置提示语
                    btn: [{
                        title: '立即支付',
                        func() {
                            AXD.util.isLogin(true, self.customLoginParam).then(() => {
                                self.isDisabledState = true
                                getLotteryRun({ token: self.token }, self.handlePrizeInfo)
                            })
                            self.yes = false
                        }
                    }]
                },
                // 积分夺宝参与成功弹框
                14: {
                    containClass: 'points-success',
                    title: '参与成功',
                    desc: '', // 动态设置提示语
                    btn: [{
                        title: '抽奖记录',
                        func() {
                            window.location.href = '/pages/points/pointsRecord'
                            self.yes = false
                        }
                    }, {
                        title: '再抽一次',
                        func() {
                            self.dialogObj = self.dialogInfo[13]
                            self.dialogObj.title = '积分支付'
                            self.dialogObj.desc = `完成积分支付，即可参与抽奖<div class="prizeBox">
                                <dl>
                                    <dt><img src="${self.initInfo.prizeList[0].imgUrl}"/></dt>
                                    <dd>
                                        <p class="title">${self.initInfo.prizeList[0].title || ''}</p>
                                        <p class="price">${self.initInfo.prizeList[0].objExts.description || ''}</p>
                                        <p class="points"><em>${self.initInfo.objExts.points}</em>积分</p>
                                    </dd>
                                </dl>
                            </div>`
                            self.yes = true
                        }
                    }]
                },
                15: {
                    containClass: 'no-prize',
                    title: '',
                    desc: '', // 动态设置提示语
                    btn: [{
                        title: '抽奖记录',
                        func() {
                            window.location.href = '/pages/points/pointsRecord'
                            self.yes = false
                        }
                    }, {
                        title: '前往积分中心',
                        func() {
                            window.location.href = '/pages/points/index'
                            self.yes = false
                        }
                    }]
                }
            }
        }
    },
    methods: {
        openInApp(pageUrl) {
            axdApp.send({
                module: 'navigation',
                method: 'goURL',
                params: {
                    url: window.location.origin + pageUrl,
                    rootPage: 0
                },
                callback() { }
            })
        },
        loadInitInfo() {
            getLotteryInitInfo({ token: this.token }, this.handleInitInfo)
        },
        pointsChange() {
            let self = this
            getLotteryExchangePoints({ token: this.token }, (response) => {
                if (response.success) {
                    self.dialogObj = self.dialogInfo[8]
                    self.chanceCount = response.result.chanceCount
                    self.yes = true
                } else {
                    if (response.code == '10010') {
                        // self.userLogin()
                        AXD.util.login()
                    } else if (response.code == '6003') {
                        self.dialogObj = self.dialogInfo[9]
                        self.yes = true
                    } else if (response.resultDes) {
                        this.$_toast(response.resultDes)
                    }
                }
            })
        },
        // 获取抽奖初始化信息的回调函数
        handleInitInfo(response) {
            if (response.success) {
                this.initInfo = response.result || {}
                this.chanceCount = this.initInfo.chanceCount
                this.pointsRunNum = this.initInfo.pointsRunNum || 0
                this.preLoadLotteryResource()
                this.preLoadDialogResource()
            } else {
                if (response.code == '-1999') {
                    // 未登录，重新登录
                    // this.userLogin()
                    AXD.util.login()
                }
            }
        },
        // 抽奖的回调函数
        handlePrizeInfo(response) {
            if (!response.success) {
                if (response.code == '10010' || response.code == '-1999') {
                    // 未登录，重新登录
                    // this.userLogin()
                    AXD.util.login()
                } else if (response.code == '6006') {
                    this.chanceCount = 0
                    this.chanceDialog()
                } else if (response.resultDes) {
                    if (this.initInfo.lotteryType == '3') {
                        let joinType = this.initInfo.objExts.joinType
                        if (joinType === '2') {
                            this.dialogObj =  this.dialogInfo[15]
                        } else {
                            this.dialogObj =  this.dialogInfo[12]
                        }
                        this.dialogObj.desc = response.resultDes
                        this.yes = true
                        accessLog({type: 'logic', desc: response.resultDes + '去立即取现人数'})
                        return false
                    }
                    this.$_toast(response.resultDes)
                }

                this.toDoLottery = false
                this.isDisabledState = false
            } else {
                if (this.initInfo.lotteryType == '3') {
                    let joinType = this.initInfo.objExts.joinType
                    if (joinType === '2') {
                        this.dialogObj =  this.dialogInfo[14]
                        this.dialogObj.desc = `开奖时间：${response.result.lotterySub.lotteryTime}`
                    } else {
                        this.dialogObj =  this.dialogInfo[11]
                    }

                    this.yes = true
                    this.cahshoutFlag = true
                } else {
                    this.prizeInfo = response.result
                    this.toDoLottery = true
                    this.chanceCount = this.prizeInfo.chanceCount
                    this.pointsRunNum = this.prizeInfo.pointsRunNum || 0
                }
            }
        },
        beforeLottery(state) {
            console.log(state + '++++++++++++++++++++++++++++++++++++++')
            let joinType = this.initInfo.objExts.joinType
            if (joinType === '2') {
                this.dialogObj = this.dialogInfo[13]
                this.dialogObj.title = '积分支付'
                this.dialogObj.desc = `完成积分支付，即可参与抽奖<div class="prizeBox">
                    <dl>
                        <dt><img src="${this.initInfo.prizeList[0].imgUrl}"/></dt>
                        <dd>
                            <p class="title">${this.initInfo.prizeList[0].title || ''}</p>
                            <p class="price">${this.initInfo.prizeList[0].objExts.description || ''}</p>
                            <p class="points"><em>${this.initInfo.objExts.points}</em>积分</p>
                        </dd>
                    </dl>
                </div>`
                this.yes = true
                return false
            }
            // 判断按钮状态
            if (state) {
                return
            }

            // if (!AXD.util.isLogin()) {
            //     this.userLogin()
            //     return
            // }
            console.log('comecomecomecomecomecomecomecomecomecomecomecomecomecome')
            AXD.util.isLogin(true, this.customLoginParam).then(() => {
                this.isDisabledState = true
                getLotteryRun({ token: this.token }, this.handlePrizeInfo)
            })
        },
        afterLottery() {
            // prizeType奖品类型值为 0 未中奖  1 红包  2 积分 3 现金  4 实物  9 其他
            this.toDoLottery = false
            this.isDisabledState = false
            this.dialogObj = this.dialogInfo[Number(this.prizeInfo.prizeType) + 1]
            if (this.prizeInfo.prizeType == '9') {
                this.dialogObj.desc = `恭喜获得<br>${this.prizeInfo.prizeTitle || ''}`
            }
            if (this.prizeInfo.prizeType == '4') {
                this.dialogObj = this.dialogInfo[3]
            }
            this.yes = true
        },
        // 判断抽奖机会
        chanceDialog() {
            let info = this.initInfo

            // 抽奖机会不足 4种弹窗
            if (info.hasShare) {
                if (info.hasPoints) {
                    this.dialogObj = this.dialogInfo[6]
                    this.yes = true
                } else {
                    this.dialogObj = this.dialogInfo[4]
                    this.yes = true
                }
                // 分享回调
                window.onShareReturn = this.onShareReturn
            } else {
                if (info.hasPoints) {
                    this.dialogObj = this.dialogInfo[5]
                    this.yes = true
                } else {
                    this.dialogObj = this.dialogInfo[7]
                    this.yes = true
                }
            }
        },
        // 分享回调函数
        onShareReturn() {
            var self = this
            if (this.initInfo.hasShare) {
                getLotteryShareAddChance({ token: this.token }, (response) => {
                    if (response.success) {
                        self.chanceCount = response.result.chanceCount
                    } else {
                        if (response.code == '10010') {
                            // 未登录，重新登录
                            // self.userLogin()
                            AXD.util.login()
                        } else if (response.resultDes) {
                            this.$_toast(response.resultDes)
                        }
                    }
                })
            }
        },
        preLoadLotteryResource() {
            let imgs = [
                this.initInfo.blockBg,
                this.initInfo.lotterySubBg,
                this.initInfo.startUrl,
                this.initInfo.disabledUrl
            ]

            let prizeList = this.initInfo.prizeList

            if (this.initInfo.lotteryType == 1) {
                for (let i = 0; i < prizeList.length; i++) {
                    imgs.push(prizeList[i].imgUrl)
                }
            }
            let newImgObjs = []

            for (let i = 0; i < imgs.length; i++) {
                newImgObjs[i] = new window.Image()
                newImgObjs[i].src = imgs[i]
            }
        },
        preLoadDialogResource() {
            let imgs = [
                'https://img.aiyoumi.com/null/201713/200259569/20170103200259.png',
                'https://img.aiyoumi.com/null/201713/200204687/20170103200204.png',
                'https://img.aiyoumi.com/null/201714/162008245/20170104162008.png',
                'https://img.aiyoumi.com/null/201714/161946293/20170104161946.png'
            ]
            let newImgObjs = []

            for (let i = 0; i < imgs.length; i++) {
                newImgObjs[i] = new window.Image()
                newImgObjs[i].src = imgs[i]
            }
        },
        userLogin() {
            let method = 'reLogin'
            if (AXD.util.isapp()) {
                if (window.aixuedai && window.aixuedai.appVersion && window.aixuedai.appVersion < 400) {
                    method = 'login'
                }
                axdApp.send({
                    module: 'user',
                    method,
                    params: {
                        type: 0
                    },
                    callback(ret) {
                        if (ret.data && ret.data.result == 'true') {
                            axdApp.refresh()
                        }
                    }
                })
            } else {
                // 自定义h5登录
                if (this.customLoginParam.isCustomLogin) {
                    this.customLoginParam.customLogin && this.customLoginParam.customLogin()
                    return
                }
                let url = window.location.pathname + window.location.search
                // window.location.href = '/pages/user/login?url=' + encodeURIComponent(url)
                window.location.href = '/pages/user/login?url=' + encodeURIComponent(url)
            }
        },
        onClose() {
            this.yes = false
        }
    }
}
</script>
