<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div v-if="carouselConfig.list.length"  class="tip">
            <carousel :list="carouselConfig.list" :stop="carouselConfig.stopCarousel"></carousel>
        </div>
        <div class="detail" style="min-height: auto;">
            <div class="detail_hd">
                <div class="title">{{currentMonth}}月应还(元)</div>
                <div class="money">{{amtTotal | formatMoneyK}}</div>
                <div v-if="hasMission">
                    <span class="assist">您已协商生成新还款计划</span><a href="javascript:;" class="repayBtn" @click="goRepayPlan"><label class="pr16">立即还款</label><m-icon type="arrow2"></m-icon></a>
                </div>
                <div v-else class="assist">{{tip}}</div>
                <div class="monthPicker" @click="isShowMonthPicker = true" ></div>
            </div>
            <div class="tabs">
                <ul>
                    <li>
                        <span href="javascript:;" @click="checkList(0)" :class="billTypeActive===0 ? 'on' : ''">借款账单</span>
                        <span @click="checkList(1)" :class="billTypeActive===1 ? 'on' : ''">其他账单<i v-if="!otherView && needPayOtherList.length" class="icon-topay">未还</i></span>
                    </li>
                </ul>
            </div>
            <div v-show="billTypeActive===0">
                <div v-if="needPayBillList.length || payBillList.length" class="detail_bd">
                    <div v-if="needPayBillList.length">
                        <div class="title">{{currentMonth}}月未还</div>
                        <bill-item
                            v-for="item in needPayBillList"
                            :key="item.id"
                            :data="item"
                            :type="0"
                            @showDetail="showBillItemDetail(item)"
                            @payment="payBill"
                            @advancePay="advancePay"
                            @goDelayPay="goDelayPay"
                            @goChangeCard="goChangeCard"
                            @goAdvancePayAll="goAdvancePayAll"
                            @openMaintain="openMaintain"
                        ></bill-item>
                    </div>
                    <div v-if="payBillList.length">
                        <div class="title">{{currentMonth}}月已还</div>
                        <bill-item
                            v-for="item in payBillList"
                            :key="item.id"
                            :data="item"
                            @showDetail="showBillItemDetail(item)"
                        ></bill-item>
                    </div>
                </div>
                <empty v-else text="暂时还没有账单哦"></empty>
                <!-- <cms-banner ref="cmsBanner" :banners="cmsBanner" event-id="bill-button-banner"></cms-banner> -->
            </div>
            <div v-show="billTypeActive===1">
                <div v-if="needPayOtherList.length || payOtherList.length" class="detail_bd">
                    <div v-if="needPayOtherList.length">
                        <div class="title">{{currentMonth}}月未还</div>
                        <bill-item
                            v-for="item in needPayOtherList"
                            :key="item.id"
                            :data="item"
                            :type="1"
                            @showDetail="showBillItemDetail(item)"
                            @payment="payBill"
                            @advancePay="advancePay"
                            @goDelayPay="goDelayPay"
                            @goChangeCard="goChangeCard"
                            @goAdvancePayAll="goAdvancePayAll"
                            @openMaintain="openMaintain"
                        ></bill-item>
                    </div>
                    <div v-if="payOtherList.length">
                        <div class="title">{{currentMonth}}月已还</div>
                        <bill-item
                            v-for="item in payOtherList"
                            :key="item.id"
                            :data="item"
                            @showDetail="showBillItemDetail(item)"
                        ></bill-item>
                    </div>
                </div>
                <empty v-else text="暂时还没有账单哦"></empty>
            </div>

        </div>
    </div>
    <month-picker v-show="isShowMonthPicker" :config="pickerConfig"  @close="isShowMonthPicker = false" @select="selectAccountPeriod"></month-picker>
    <popup-detail :data="payDetailData" :rrhzx="rrhzx" :show="isShowPayDetail" @close="closePayDetail" @submit="popupDetailPay"></popup-detail>
    <router-view></router-view>
</div>
</template>
<script>
import { renderDataForBlockType, } from 'src/store/api'
import {
    getAccountMonths,
    getBillList,
    billPayment,
    billAdvanceCal,
    billAdvancePay,
    billAdvanceSettle,
    delaySettle,
    delayCal,
    backRepayAdvSettle,
    checkSign,
    checkMaintainTime
} from 'store/modules/rrh'

import { AXD, isZjl, isAym, formatMoneyK, formatDateTime, timeYMD2 } from 'src/libs/util'
import { closeWebView } from '../common/utils'
import repay from '../common/repay'
import loanProductsHandler from '../common/loanProductsHandler'
import { resetHeader } from 'components/header/resetHeader'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')

import billItem from './bill-item.vue'
import monthPicker from 'src/module/common/bill/month-picker.vue'
import popupDetail from '../common/popup-detail.vue'
import empty from '../common/empty.vue'
import carousel from 'src/components/carousel/index.vue'
import reloginMixins from 'src/module/rrh/mixins.js'
import { isNeedTel } from 'store/modules/rrh'
export default {
    name: 'repayment',
    mixins: [repay, loanProductsHandler, reloginMixins],
    data() {
        return {
            barConfig: {
                leftAction: 'closeWindow',
                app: {
                    leftbuttonVisible: true,
                    leftbuttonAction: 'closeWindow',
                    rightBtnShow: true
                }
            },
            hasMission: false,
            // 当期账单
            amtTotal: 0,
            // 提前还款笔数
            amtCount: 0,
            // 默认期数
            defaultPeriod: '',
            isShowMonthPicker: false,
            pickerConfig: {
                current: '',
                rangeList: []
            },
            // 当前月份
            currentMonth: '',
            // 账单列表
            payBillList: [],
            needPayBillList: [],
            payOtherList: [],
            needPayOtherList: [],
            // 是否显示提前还款详情
            isShowPayDetail: false,
            payDetailData: {},
            paySwitchConfig: null,
            carouselConfig: {
                stopCarousel: false,
                list: [{text: '借还款行为均会记入征信，为保持良好信用请及时还款'}]
            },
            isDelay: false,
            cmsBanner: [],
            // cmsBanner: [{'url':'https://www.aiyoumi.com/','img':'https://img.aiyoumi.com/cpsImg/20210218160208_750x189.jpg?height=189&width=750','orderBy':2},{'url':'https://www.zhaojiling.com/','img':'https://img.aiyoumi.com/cpsImg/20210218160157_750x198.png?height=198&width=750','orderBy':1}],
            billTip: {},
            billTypeActive: 0,
            otherView: false,
            billInstall:{},
            rrhzx: {},
            userId:''
        }
    },
    components: {
        billItem,
        monthPicker,
        empty,
        popupDetail,
        carousel
        // cmsBanner
    },
    filters: {
        formatMoneyK
    },
    beforeRouteLeave(to, from, next) {
        this.stopCarousel = true
        next()
    },
    mounted() {
        window.closeWindow = () => {
            if(this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'close'
                })
            }
        }
        window.goBack = () => {
            // 重置原生head
            resetHeader()
            closeWebView()
        }
    },
    created() {
        isNeedTel().then((res) => {
            if (res && res.success && res.result) {
                this.$router.push({
                    path: '/pages/rrh/relogin',
                    query: {
                        backUrl: window.location.href
                    }
                })
            }else{
                this.init()
            }
        })
    },
    computed: {
        tip() {
            let tip = '珍惜信用，好借好还'
            if ((!this.needPayBillList.length && !this.needPayOtherList.length) && (this.payBillList.length || this.payOtherList.length)) {
                tip = '本月已还清，请继续保持'
            } else if (this.isDelay) {
                tip = '您有账单已逾期，请及时还款'
            }
            return tip
        }
    },
    methods: {
        ...mapActions(['getRenderData', 'getZjlApplyData']),
        init() {
            this.defaultPeriod = new Date().getFullYear().toString() + (new Date().getMonth() < 9 ? ('0' + (new Date().getMonth() + 1)) : new Date().getMonth() + 1)
            this.currentMonth = new Date().getMonth() + 1
            this.getBillList(this.defaultPeriod)
            // 获取开户配置数据
            renderDataForBlockType({
                alias: 'billPaySwitch',
                blockType: 'extend',
                blockName: 'paySwitchConfig',
                renderPlatform: aixuedai.isUavoApp == 'y' ? 'app' : 'h5',
                type: '/cms'
            }, (data) => {
                if (data.success && data.result && data.result.objList) {
                    let dataJson = JSON.parse(data.result.objList)
                    this.paySwitchConfig = dataJson
                }
            })
        },
        goRepayPlan() {
            this.$router.push({
                path: '/pages/rrh/newRepayPlan'
            })
        },
        /**
         * 获取账单月份
         * @return {[type]} [description]
         */
        getAccountMonths() {
            getAccountMonths().then(res => {
                if (res.success) {
                    this.pickerConfig.rangeList = res.result || []
                    // 如果账单是从下月开始， 需要将本月添加到账单月份列表中
                    if (res.result.length && this.defaultPeriod < res.result[0]) {
                        this.pickerConfig.rangeList.unshift(this.defaultPeriod)
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        getSourceData() {
            this.getRenderData().then(data => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach(data => {
                        if(data.title === 'billinstall_content') {
                            const conf = JSON.parse(data.objList)
                            if(isZjl) {
                                this.billInstall = conf.zjl || {}
                            } else if (isAym) {
                                this.billInstall = conf.aym || {}
                            } else {
                                this.billInstall = conf.default || {}
                            }
                        }
                        if(data.title === 'billtip_content') {
                            const conf = JSON.parse(data.objList)
                            if(isZjl) {
                                this.billTip = conf.zjl || {}
                            } else if (isAym) {
                                this.billTip = conf.aym || {}
                            } else {
                                this.billTip = conf.default || {}
                            }
                            return
                        }
                        if(isZjl) {
                            if (data.title === 'banner_bill_zjl') {
                                this.cmsBanner = data.objListArray
                            }
                        } else if (isAym) {
                            if (data.title === 'banner_bill_aym') {
                                this.cmsBanner = data.objListArray
                            }
                        } else {
                            if (data.title === 'banner_bill') {
                                this.cmsBanner = data.objListArray
                            }
                        }
                    })
                    // 账单为0弹窗提示
                    if (parseInt(this.amtTotal, 10) === 0 && this.billTip.content) {
                        this.$createDialog({
                            type: 'confirm',
                            title: this.billTip.title,
                            content: this.billTip.content,
                            confirmBtn: {
                                text: this.billTip.confirmText || '好的',
                                href: this.billTip.confirmUrl || '/pages/rrh/index'
                            },
                            onConfirm: ()=> {
                                this.log({type: 'button', name: 'bill-bounced-borrow', desc: this.billTip.confirmText, extendData: this.billTip.confirmUrl})
                                // window.location.href=this.billTip.confirmUrl
                            }
                        }).show()
                    }
                    // 引导app弹窗提示
                    if (this.billInstall.content && !this.hasInstall(this.userId)) {
                        this.setInstall(this.userId,true)
                        this.$createDialog({
                            type: 'confirm',
                            title: this.billInstall.title,
                            content: this.billInstall.content,
                            confirmBtn: {
                                text: this.billInstall.confirmText || '好的',
                                href: this.billInstall.confirmUrl || '/pages/rrh/index'
                            },
                            onConfirm: ()=> {}
                        }).show()
                    }

                }
            })
            this.getZjlApplyData().then(data => {
                if (data.success && data.result && data.result.blocks) {
                    this.rrhzx = JSON.parse(data.result.blocks.find(e => e.title === 'rrhzx').objList || '{}')
                }
            })
        },
        /**
         * 获取当期账单列表
         * @param  {[type]} period [description]
         * @return {[type]}        [description]
         */
        getBillList(period) {
            getBillList({
                accountPeriod: period
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    let payBillList = []
                    let needPayBillList = []
                    let payOtherList = []
                    let needPayOtherList = []
                    this.isDelay = false
                    this.otherView = false
                    this.hasMission = result.hasMission
                    this.amtTotal = result.amtTotal
                    this.amtCount = result.amtCount ? parseInt(result.amtCount) : 0
                    if (!this.pickerConfig.rangeList.length) {
                        this.getAccountMonths()
                        this.pickerConfig.current = this.defaultPeriod
                    } else {
                        this.pickerConfig.current = period
                    }
                    result.itemList && this.classifyList(result.itemList, 0)
                    this.classifyList(result.miniItemList, 1)
                    this.setUserId(result)
                    this.getSourceData()
                } else {
                    if (res.code === '-1999') {
                        AXD.util.login()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        },
        classifyList(list, type){
            const itemList = list || []
            let payList = []
            let needPayList = []
            itemList.forEach((item, i) => {
                // 针对'泰和担保费'改成'增信费'
                if (item.oidBiz === '202162') {
                    item.productName = '增信费'
                }
                item.title = `${item.productName || ''} · ${item.itemTitle || ''}`
                item.date = formatDateTime(parseInt(item.payDate), 'yyyy-MM-dd', '-')
                item.orderTime = formatDateTime(parseInt(item.orderTime), 'yyyy-MM-dd', '-')
                // 实际还款时间
                item.actualPayDate = timeYMD2(item.payTime || '')
                // 应还金额
                item.money = parseInt(item.amtRealPay || item.amtTotal)
                item.id = item.repayPlanIds
                item.orderId = item.instalmentIdStr
                item.canPay = item.canPay === 'y'
                item.mustChecked = item.canPay === 'y' && item.billStatus === 'DELAY'
                item.canPayAll = item.canPayAll && item.billStatus !== 'DELAY'
                item.loanId = item.outOrderId
                if (item.billStatus === 'DELAY') {
                    this.isDelay = true
                    this.carouselConfig.list = [{text: '您有逾期账单，逾期将产生逾期费并影响征信，请及时还款'}]
                }
                if ((item.payStatus === 'WAIT_PAY' || item.payStatus === 'DELAY' || !item.payStatus)) {
                    // item.canChangeCard = (['202162', '202163', '202164', '202165', '202270'].indexOf(item.oidBiz) > -1) === false
                    needPayList.push(item)
                } else {
                    // 账单已还款
                    payList.push(item)
                }
            })
            if(type === 0) {
                this.payBillList = payList
                this.needPayBillList = needPayList
                this.$refs && this.$refs.cmsBanner && this.$refs.cmsBanner.calcuSwiper()
            } else {
                this.payOtherList = payList
                this.needPayOtherList = needPayList
            }
        },
        checkList(tab) {
            this.billTypeActive=tab
            if(tab === 1){
                this.otherView = true
                this.log({type: 'button-logic', name: 'bill-button-otherbill', desc: '借款账单'})
            } else {
                this.log({type: 'button-logic', name: 'bill-button-loanbill', desc: '其它账单'})
            }
        },
        /**
         * 显示账单详情
         */
        showBillItemDetail(billInfo) {
            window.localStorage.setItem('bmhBillInfo', JSON.stringify(billInfo))
            this.$router.push({
                name: 'billItemDetails'
            })
        },
        /**
         * @async
         * @function
         * @description 校验资金渠道是否在维护时间 换绑卡 提前结清 提前还款 为了防止页面停止时间差问题，“更换”银行卡按钮和“还款”“提前结清”按钮点击时都需要先再请求一次维护时间，看是否需要拦截
         * @returns {Promise<boolean>} true 为在维护时间内 false 不在维护时间内
         */
       async checkMaintainTime(args = {}){
            const {maintainStartTimeStr = '',maintainEndTimeStr = '',loanProvider = '',isMaintain = false} = args
            if(!isMaintain){
                return false
            }
            let checkFlag= false
            try{
                const data = {
                    loanProvider,
                    businessType:'repay'
                }
                const res = await checkMaintainTime(data)
                if(res.success && res.result){
                    checkFlag = true
                }
            }catch{}
           if(checkFlag){
               this.$createDialog({
                   title: '系统维护公告',
                   content: `<p style="text-align:left;">系统维护期间，暂停还款以及换绑卡业务，请合理安排还款时间，给您带来不便敬请谅解。<br/>维护时间：${maintainStartTimeStr} ~<br/>${maintainEndTimeStr}</p>`,
                   confirmBtn: {
                       text: '我知道了'
                   },
                   onConfirm: ()=>{}
               }).show()
           }
           return checkFlag
        },
        /**
         * @description 展示维护期弹框
         * 
         */
        openMaintain(item = {}){
            this.checkMaintainTime(item)
        },
        /**
         * 还款
         */
        async payBill(bill, type) {
            // 校验是否在维护期
            let checkFlag = await this.checkMaintainTime(bill)
            if(checkFlag){
                return
            }
            const list = type === 0 ? this.needPayBillList : this.needPayOtherList
            for (let item of list) {
                if (item.orderId === bill.orderId && item.billStatus === 'DELAY') {
                    if (item.id !== bill.id) {
                        this.$_toast('当前借款有逾期账单未还款，请先结清逾期账单')
                        return false
                    } else {
                        break
                    }
                }
            }
            this.payment({
                repayPlanIdStr: bill.id,
                canThrow: 'y'
            }, billPayment)
        },
        /**
         * 提前结清预处理 - 获取试算数据
         */
        async goAdvancePayAll(bill, type) {
            // 校验是否在维护期
            let checkFlag = await this.checkMaintainTime(bill)
            if(checkFlag){
                return
            }
            const list = type === 0 ? this.needPayBillList : this.needPayOtherList
            for (let item of this.needPayBillList) {
                if (item.orderId === bill.orderId && item.billStatus === 'DELAY') {
                    this.$_toast('当前借款有逾期账单未还款，请先结清逾期账单')
                    return false
                }
            }
            let feeName = '平台服务费'
            let feeName1 = '手续费'
            let feeName2 = '资金管理费'
            billAdvanceCal({
                instalmentIdStr: bill.orderId
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result.status == 2) {
                        this.isShowPayDetail = true
                        this.payDetailData = {
                            money: result.amtPay,
                            oidBiz: bill.oidBiz,
                            status: result.status,
                            remainPeriods: result.remainPeriods,
                            type: 'advancePay',
                            bankCardId: bill.bankCardId,
                            orderId: bill.orderId,
                            loanId: bill.loanId,
                            canPay: result.canPay,
                            details: [{label: '本金', value: formatMoneyK(result.amtCapital || 0), show: true},
                                {label: '综合费用', value: formatMoneyK(parseFloat(result.amtService || 0) + parseFloat(result.amtManager || 0) + parseFloat(result.amtFactorage || 0) + parseFloat(result.amtAicaiAdvPenalty || 0) + parseFloat(result.amtFundAdvPenalty || 0)), show: true},
                                {label: '逾期费', value: formatMoneyK(result.amtPostponeFee || 0), warn: true, show: bill.billStatus === 'DELAY'},
                                {label: '优惠', value: formatMoneyK(result.amtCoupon || 0), show: true},
                                {label: '剩余期数', value: `${parseInt(result.period)}/${result.periodNum}期`, show: true}]
                        }
                    } else {
                        this.$_toast('尊敬的用户，该笔账单目前扣款处理中，请耐心等待，一小时后再试')
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        /**
         * 关闭提前结清详情
         * @return {[type]} [description]
         */
        closePayDetail() {
            this.isShowPayDetail = false
            this.getBillList(this.pickerConfig.current)
        },
        /**
         * 提前结清
         * @return {[type]} [description]
         */
        popupDetailPay(bill) {
            this.isShowPayDetail = false
            let des = ''
            if (!bill.canPay) {
                des = '您正在发起扣款申请，请确保绑定银行卡中有足够还款金额，每天最多发起3次代扣请求'
            }
            // canPay为true走收银台还款，为false先判断签约再走资方代扣
            if (bill.canPay) {
                // 收银台还款
                this.payment({
                    instalmentIdStr: bill.orderId,
                    canThrow: 'y'
                }, backRepayAdvSettle)
            } else {
                this.loanProductsHandler({
                    oidBiz: bill.oidBiz,
                    orderId: bill.loanId,
                    productType: 'rrh',
                    bankCardId: bill.bankCardId,
                    showLoading: true,
                    period: bill.type === 'advancePay' ? this.payDetailData.remainPeriods : bill.period,
                    succCallback: () => {
                        // 资方代扣
                        let dialog = this.$createDialog({
                            type: 'confirm',
                            title: '',
                            content: des,
                            onConfirm: () => {
                                dialog.hide()
                                let payFunc = bill.type === 'advancePay' ? billAdvanceSettle : delaySettle
                                this.payment({
                                    instalmentIdStr: bill.orderId,
                                    period: bill.period
                                }, payFunc, true, () => {
                                    this.$_toast('您的申请已提交，稍后等待短信通知扣款信息，请不要重复发起还款', () => {
                                        this.getBillList(this.pickerConfig.current)
                                    })
                                })
                            },
                            onCancel: () => {
                                dialog.hide()
                            }
                        }).show()
                    },
                    failCallback: () => {
                        this.getBillList(this.pickerConfig.current)
                    }
                }, 'rrhBill', 'rrhBill')
            }
        },
        /**
         * 提前还款
         * @return {[type]} [description]
         */
       async advancePay(bill) {
           let checkFlag =  await this.checkMaintainTime(bill)
           if(checkFlag){
               return
           }
            this.loanProductsHandler({
                oidBiz: bill.oidBiz,
                orderId: bill.loanId,
                productType: 'rrh',
                bankCardId: bill.bankCardId,
                period: bill.period,
                showLoading: true,
                succCallback: () => {
                    this.commonAdvancePay({
                        instalmentIdStr: bill.orderId,
                        period: bill.period,
                        oidBiz: bill.oidBiz
                    }, billAdvancePay)
                },
                failCallback: () => {
                    this.getBillList(this.pickerConfig.current)
                }
            }, 'rrhBill', 'rrhBill')
        },
        /**
         * @description 逾期还款
         */
        async goDelayPay(bill) {
            // 校验是否在维护期
            let checkFlag = await this.checkMaintainTime(bill)
            if(checkFlag){
                return
            }
            let feeName = '平台服务费'
            let feeName1 = '手续费'
            let feeName2 = '资金管理费'
            let req = {
                instalmentIdStr: bill.orderId,
                period: bill.period
            }
            delayCal(req).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result.status == 2) {
                        this.isShowPayDetail = true
                        this.payDetailData = {
                            money: result.amtPay,
                            oidBiz: bill.oidBiz,
                            status: result.status,
                            orderId: bill.orderId,
                            loanId: bill.loanId,
                            bankCardId: bill.bankCardId,
                            period: bill.period,
                            type: 'delayPay',
                            details: [{label: '本金', value: formatMoneyK(result.amtCapital || 0), show: true},
                                {label: '综合费用', value: formatMoneyK(parseFloat(result.amtService || 0) + parseFloat(result.amtManager || 0) + parseFloat(result.amtFactorage || 0)), show: true},
                                {label: '逾期费', value: formatMoneyK(result.amtPostphoneFee || 0), warn: true, show: bill.billStatus === 'DELAY'},
                                {label: '优惠', value: formatMoneyK(result.amtCoupon || 0), show: true},
                                {label: '当前期数', value: `第${parseInt(result.period)}期`, show: true}]
                        }
                    } else {
                        this.$_toast('尊敬的用户，该笔账单目前扣款处理中，请耐心等待，一小时后再试')
                    }
                } else {
                    window.Sentry && Sentry.captureErr({ req, res })
                    this.$_toast(res.resultDes)
                }
            })
        },
        /**
         * 通用提前还款
         * @param  {[type]} bill [description]
         * @return {[type]}      [description]
         */
        commonAdvancePay(params, payFunc) {
            let des = '您正在发起扣款申请，请确保绑定银行卡中有足够还款金额，每天最多发起3次代扣请求'
            let dialog = this.$createDialog({
                type: 'confirm',
                title: '',
                content: des,
                onConfirm: () => {
                    dialog.hide()
                    this.payment(params, payFunc, true, () => {
                        this.$_toast('您的申请已提交，稍后等待短信通知扣款信息，请不要重复发起还款')
                    })
                },
                onCancel: () => {
                    dialog.hide()
                }
            }).show()
        },
        /**
         * 选择账单分期，返回账单详情
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        selectAccountPeriod(data) {
            this.billTypeActive = 0
            this.isShowMonthPicker = false
            this.currentMonth = parseInt(data.month)
            this.getBillList(data.year.toString() + data.month)
        },
        checkSign(oidBiz, callback) {
            checkSign({
                loanProvider: oidBiz
            }).then(res => {
                if (res.success) {
                    if (res.result) {
                        let dialog = this.$createDialog({
                            type: 'confirm',
                            content: '您的银行卡变更，请确认信息',
                            confirmBtn: {text: '确认'},
                            cancelBtn: {text: '取消'},
                            onConfirm: () => {
                                this.$router.push({
                                    name: 'rrhBindBankCard',
                                    query: {
                                        from: 'bill'
                                    }
                                })
                            },
                            onCancel: () => {
                                dialog.hide()
                            }
                        })
                        dialog.show()
                    } else {
                        callback.call(this)
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        async goChangeCard(data) {
            // 校验是否在维护期
            let checkFlag = await this.checkMaintainTime(data)
            if(checkFlag){
                return
            }
            this.$router.push({
                path: '/pages/bankCard/debitCard',
                query: {
                    oidBiz: data.oidBiz,
                    loanId: data.loanId,
                    loanProvider: data.loanProvider
                }
            })
            // this.$router.push({
            //     name: 'rrhChangeCard',
            //     query: {
            //         oidBiz: data.oidBiz,
            //         loanId: data.loanId
            //     }
            // })
        },
        // 设置当前页用户id
        setUserId(res ={}){
            let userId = ''
            if(res.userId){
                userId = res.userId
            }else if(res.itemList && res.itemList.length){
                for(let i =0; i<res.itemList.length; i++){
                    if(res.itemList[i] && res.itemList[i].userId){
                        userId = res.itemList[i].userId
                        break
                    }
                }
            }else if(res.miniItemList && res.miniItemList.length){
                for(let i =0; i < res.miniItemList.length; i++){
                    if(res.miniItemList[i] && res.miniItemList[i].userId){
                        userId = res.miniItemList[i].userId
                        break
                    }
                }
            }
            this.userId = userId
        },
        // 判断是否弹过窗
        hasInstall(userId = ''){
            if(!userId)return false
            let store = localStorage.getItem('rrh_bill_install')
            store = store?JSON.parse(store):{}
            let nowDate = new Date().toLocaleDateString().replace(/\//g,'-')
            if(store.date === nowDate && store[userId] && store[userId].tip){
                return true
            }
            return false
        },
        // 设置弹窗是否加载
        setInstall(userId = '',tip = true){
            if(!userId)return
            let nowDate = new Date().toLocaleDateString().replace(/\//g,'-')
            let store = localStorage.getItem('rrh_bill_install')
            store = store?JSON.parse(store):{}
            store = store.date === nowDate?store:Object.assign({},{date:nowDate})
            if(store[userId]){
                store[userId] = Object.assign({},store[userId],{tip})
            }else{
                store[userId] = Object.assign({},{tip})
            }
            localStorage.setItem('rrh_bill_install',JSON.stringify(store))
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.detail{
    padding: 0;
    background-color: #f7f7f7;
    .detail_hd{
        height: px2rem(336);
        background: #fff;
        padding-bottom: 0;
        margin-bottom: px2rem(25);
        // border-bottom: 1px solid #e4e4e4;
        position: relative;
        .monthPicker{
            position: absolute;
            width: px2rem(33);
            height: px2rem(33);
            right: px2rem(34);
            top: px2rem(34);
            @include img2x('../styles/imgs/date');
            background-size: 100% 100%;
        }
        .assist{
            margin-top: px2rem(34);
            color: #f99e00;
        }
    }
    .detail_bd{
        padding: 0 0;
        .title{
            padding-left: px2rem(20);
            height: px2rem(86);
            line-height: px2rem(60);
            padding-top: px2rem(26);
            font-size: px2rem(24);
            color: $auiTextColorAssistant;
            background-color: $auiBgColorDefault;
            margin-bottom: 0;
        }
    }
}
.tabs {
    margin: px2rem(20) 0 0;
    ul {
        padding: 0;
        li {
            border-bottom: 1px solid var(--auiColorPrimary);
            display: flex;
            span {
                text-align: center;
                width: px2rem(375);
                height: px2rem(84);
                line-height: px2rem(84);
                background: #fff;
                border-radius: px2rem(20) px2rem(20) 0 0;
                border-color:#fff;
                font-size: px2rem(32);
                font-family: PingFangSC-Regular,PingFang SC;
                font-weight: 400;
                color:#666;
                position: relative;
                .icon-topay{
                    position: absolute;
                    right: 10%;
                    top: 0;
                    border-radius: 2px;
                    background-color: #FF3E00;
                    color: #fff;
                    font-size: px2rem(24);
                    padding: 2px 5px;
                    display: block;
                    &:after {
                        content: '';
                        position: absolute;
                        left: 20%;
                        bottom: -6px;
                        width: 0;
                        height: 0;
                        border-top: 6px solid #FF3E00;
                        border-right: 6px solid transparent;
                    }
                }
            }
            span.on {
                background:var(--auiColorPrimary);
                border-color: var(--auiColorPrimary);
                color: var(--auiButtonTextColor);
            }
        }
    }
}
.tip {
    line-height: px2rem(56);
    height: px2rem(56);
    font-size: px2rem(30);
    color: #f9a006;
    background: #fff9e1;
    padding: 0 px2rem(20);
}
.swiper-bill {
    margin: px2rem(20) 0;
}
.repayBtn {
    font-size: px2rem(28);
    color: #4286ff;
    padding: 0 px2rem(16) 0 px2rem(64);
}
.pr16 {
    padding-right: px2rem(16);
}
.mui-icon{
    font-size:px2rem(24);
    color: #ccc;
}
</style>
