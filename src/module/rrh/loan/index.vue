<template>
    <div>
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="mui-content">
            <resource product="bmh" :oidBiz="oidBiz"></resource>
            <div class="page">
                <div class="page__head">
                    <div class="page__head__main">
                        <span class="unit">￥</span>
                        <input ref="balanceInput" v-model.number="balance"  type="number" class="page__head__input" :placeholder="'最高可借' + actualMaxAmt / 1000" @blur="format" @focus="formatInts">
                        <span class="action"><span @click="pickAll">全部借出</span><span class="clear" @click="clearAll"><m-icon v-if="balance" type="delete"></m-icon></span></span>
                    </div>
                    <div class="page__head__desc">
                        {{minAmt / 1000}}元起
                    </div>
                </div>
                <div  v-if="isShowBlockLoading" class="page__loading">
                    <div class="loading__icon">
                        <img :src="iconLoading" />
                    </div>
                    <span class="loading__text">
                        匹配计算中...
                    </span>
                </div>
                <div v-show="isShowBlock">
                <repayment
                    :value="rate.monthPay"
                    :oidBiz="oidBiz"
                    :periods="periods"
                    :currentPeriod="currentPeriod"
                    :activePeriod="activePeriod"
                    :details="rate.details"
                    :yealServiceRate="yealServiceRate"
                    :rrhzx="rrhzx"
                    @selectPerild="selectPerild"
                ></repayment>
                <creditfee
                    @getCode="getCode"
                    :rate="rate"
                    :initCoupon="initCoupon"
                    :rrhzx="rrhzx"
                    :openAccountConfigInfo="openAccountConfigInfo"
                    :includeFlag="includeFlag"
                    :isChooseRights="isChooseRights"
                    :securityType="dynamicSecurityType"
                    ref="security"
                ></creditfee>
                <rightsPackage v-model="isChooseRights" :rightsObj="rightsObj" :oidBiz="oidBiz" :productName="productName" :cmsConf="rightPackageConf" :preRightPackage="preRightPackage"></rightsPackage>
                <div class="goldCard" v-if="$route.query.hasGoldenCard==='y'">
                    <span class="icon"></span>
                    <span class="cardStatus">招财金卡权益使用中</span>
                    <span class="cardEndTime">{{$route.query.overTime}}</span><span class="cardEndTime">到期</span>
                </div>
                <m-cell-group>
                    <!-- 银行卡 -->
                    <bind-card :enable="!isChangeBalance" :userId="userId" :loanProvider="loanProvider" :hisBankCardId="hisBankCardId" @complete="selectBankCard"></bind-card>
                    <bank-tip :bankCode="bankInfo.bankCode"></bank-tip>
                    <!-- 消费用途 -->
                    <consumer :value="loanReason" :loanReasonList="loanReasonList" @complete="selConsumer"></consumer>
                </m-cell-group>
                <constract ref="constract" :securityType="dynamicSecurityType" :securityFlag="rate.securityFlag" :creditAuthContract="creditAuthContract" :rrhzx="rrhzx" :oidBiz="oidBiz" :loanProvider="loanProvider" :secondRiskFlag="secondRiskFlag" :hubeiTempNo="hubeiTempNo"  @complete="orderAfterHook"></constract>
                </div>
            </div>
        </div>
        <div v-if="isShowBlock" class="bottom-action">
            <!-- <m-tags v-if="isChooseRights && rightsObj.totalDiscountAmtWithRight==='0'" type="warn" class="bottom__tag">取现通过率预计提升90%+</m-tags> -->
            <div v-if="$route.query.hasGoldenCard==='y'" class="mui-btn mui-btn_primary mui-btn_large mui-btn_round goldBtn" :class="{'disabled':!allowApply}" @click="submit">招财金卡专属借款通道申请</div>
            <div v-else class="mui-btn mui-btn_primary mui-btn_large mui-btn_round" :class="{'disabled':!allowApply}" @click="submit">一键申请</div>
        </div>
        <!-- 挽留弹窗 -->
        <com-popup :isPop="showDetention" class="detention-popup" @cancel="showDetention = false">
            <template slot="content">
                <div class="popup__body">
                    <img :src="detent.imageUrl" alt="">
                </div>
                <div class="popup__footer">
                    <m-button size="small" type="plain" @click="toCancel">{{detent.cancelText}}</m-button>
                    <m-button size="small" @click="dialogClose">{{detent.submitText}}</m-button>
                </div>
            </template>
        </com-popup>
        <!-- 提额弹窗 -->
        <com-popup :isPop="showIncrese" class="increse-popup">
            <template slot="content">
                <div class="popup__body">
                    <div>惊喜赠送额度</div>
                    <div class="amount">+<span class="bigger">{{creditIncresed}}</span>元</div>
                </div>
                <div>
                  <!-- 会员有效期内，提示语不同 -->
                  <div v-if="aplusStatus==='VALID'" class="tip">
                    亲爱的招财会员用户<br>
                    恭喜您获得会员专属额度</div>
                  <div v-else class="tip">经系统评估由于您的信用良好，当前可用额度提升<span class="amount">{{creditIncresed}}</span>元，限时有效</div>
                </div>
                <div class="popup__footer">
                    <m-button @click="showIncrese = false">立即使用</m-button>
                </div>
            </template>
        </com-popup>
        <!-- 漏斗加载弹窗：reqOrder -->
        <m-popup ref="hourglass">
            <div class="hourglass">
                <div class="hourglass__main">
                    <div class="hourglass__img">
                        <img :src="iconHourglass" />
                    </div>
                    <div class="hourglass__text">
                        借款申请正在提交中
                    </div>
                </div>
            </div>
        </m-popup>
    </div>
</template>
<script>
import iconLoading from '@/assets/images/loading.png'
import iconHourglass from '@/assets/images/hourglass.gif'
import { AXD, isZjl, isAym, formatMoneyK, tailNum } from 'src/libs/util'

import {
    increaseCredit,
    getApply,
    getPeriodsByAmy,
    calRate,
    reqOrder,
    // getCreditSub,
    detentStatus,
    detentStatusCallback
} from 'store/modules/rrh'
import bindCard from 'module/common/bankbind/bankcard.vue'
import bankTip from 'src/module/common/bankbind/banktip.vue'
import resource from 'src/module/common/resource/index.vue'
import loanProductsHandler from '../common/loanProductsHandler'
import comPopup from 'components/popup/index.vue'
// 月供&分期
import repayment from './components/repayment.vue'
// 债务管理费
import creditfee from './components/creditfee.vue'
// 消费用途
import consumer from './components/consumer.vue'
// 协议
import constract from './components/constract.vue'
// 权益包
import rightsPackage from './components/rightsPackage.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')
export default {
    name: 'rrhLoan',
    mixins: [loanProductsHandler],
    components: {
        bindCard,
        bankTip,
        resource,
        creditfee,
        repayment,
        consumer,
        constract,
        comPopup,
        rightsPackage
    },
    data() {
        return {
            iconLoading,
            iconHourglass,
            isFirst:true,  // 从auto页首次进入不默认金额
            isShowBlockLoading: false,
            isShowBlock: false,
            querys: this.$route.query,
            includeFlag: false,
            // 产品渠道编码
            oidBiz: this.$route.query.oidBiz,
            productName: this.$route.query.name,
            userId: '',
            // 最小额度
            minAmt: '1000000',
            // 最大额度
            maxAmt: '50000000',
            // 取现金额
            balance: '',
            // 分期数, 默认倒序排列
            periods: [],
            // 默认选中分期数index
            activePeriod: null,
            // 选择的分期数
            currentPeriod: '',
            // 资金产品编号
            loanProvider: '',
            // 银行卡id
            bankCardId: '',
            // 上一次借款选中的银行卡ID
            hisBankCardId: '',
            // 选中的银行卡信息
            bankInfo: {
                // 银行code
                bankCode: '',
                // 银行卡号， 晋商渠道下单之前需要弹框显示
                cardCode: '',
                // 银行名称
                bankName: '',
                // 银行图标
                bankIcon: '',
                // 用户身份证号， 晋商渠道下单之前需要弹框显示
                custId: '',
                // 用户名称， 晋商渠道下单之前需要弹框显示
                custName: '',
                // 用户手机号， 晋商渠道下单之前需要弹框显示
                mobile: ''
            },
            // 借款原因
            loanReason: '',
            // 借款原因列表
            loanReasonList: ['旅游消费', '学习进修', '购物消费', '医疗服务', '生活开销', '运动健身'],
            // 控制下单按钮是否可点击
            allowApply: false,
            // 缓存分期对应的月供数据， 修改借款金额时要清空
            cacheData: {},
            barConfig: {
                leftAction: 'detention',
                h5: {
                    title: this.$route.query.name || ''
                },
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: 'detention'
                }
            },
            yealServiceRate: '',
            // 费率相关数据， 选择不同的借款金额、分期， 费率不同
            rate: {
                // 月供
                monthPay: '￥0.00',
                // 手续费
                handlerServiceFee: '0.00',
                // 费用名称，手续费、保费、风险评估费， 不同的渠道显示的名称不同
                feeName: '手续费',
                // 月供详情
                details: [],
                securityFlag: false,
                securityInfo: {},
                preRiskFlag: true
            },
            creditAuthContract: {
                creditAuthContractFlag: false,
                tempNo: ''
            },
            isChangeBalance: true,
            // 开户、签约、换绑卡配置信息
            openAccountConfigInfo: null,
            rrhzx: {},
            // 订单ID
            loanId: '',
            additionParams: '', // 苏宁金融下单需要
            currentCode: '', // 用户已选的优惠券code码
            initCoupon: true,
            showDetention: false,
            showIncrese: false,
            aplusStatus: '',
            creditIncresed: 0,
            detentConf: {},
            detentPartConf: {},
            detent: {},
            isDetentPartConf: false,
            rightsObj:{},
            securityType: '', // 担保费机构
            securityTypeWithRight: '', // 权益后担保费机构
            isChooseRights: false,
            rightPackageConf:{
                newRightPackage:{} // 开通权益卡背景图
            },
            preRightPackage:this.$route.query.preRightPackage,
            secondRiskFlag: false, //风控校验
            hubeiTempNo: '' // 湖北消金协议模版地址
        }
    },
    computed: {
        dynamicSecurityType(){
            if(this.isChooseRights){
                return this.securityTypeWithRight
            }
            return this.securityType
        },
        actualMaxAmt() {
            // 默认填充金额为：最大可借金额取整到百位
            return Math.floor(this.maxAmt / 100000) * 100000
        }
    },

    created() {
        // 优先取用户输入的金额，其次循环路由等途径初始化的金额
        this.balance = ~~window.sessionStorage.getItem('balance') || (this.querys.balance / 1000) ||''
        if(this.balance!==''){
            this.isFirst = false
            this.isShowBlock = true
        }
        this.preInit()
    },
    mounted() {
        let $this = this
        window.goBack = () => {
            if ($this.isChangeBalance) {
                return false
            }
            $this.goBack()
        }
        window.detention = () => {
            if(document.querySelector('.mui-popup') && document.querySelector('.mui-popup').style.display !== 'none') {
                $this.goBack()
            } else {
                $this.showIncrese = false
                this.$refs.constract.listShow = false
                this.$refs.constract.isShowForceContract = false
                $this.showDetention = true
                // 挽留弹窗特殊用户走回调
                if (this.isDetentPartConf) {
                    detentStatusCallback()
                }
                return false
            }
        }
    },
    methods: {
        ...mapActions(['getZjlApplyData']),
        preInit() {
            // 获取CMS配置信息
            this.getZjlApplyData().then(res => {
                if (res.success) {
                    const { blocks } = res.result
                    this.rrhzx = JSON.parse(blocks.find(e => e.title === 'rrhzx').objList || '{}')
                    this.detentConf = JSON.parse(blocks.find(e => e.title === 'detentionConfig').objList || '{}')
                    this.detentPartConf = JSON.parse(blocks.find(e => e.title === 'detentionPartConfig').objList || '{}')
                    this.rightPackageConf.newRightPackage = blocks.find(e=>e.title === 'newRightBackground')
                    const opAccountConfigAym = blocks.find(e => e.title === 'opAccountConfig-aym')
                    if(isAym && opAccountConfigAym) {
                        this.openAccountConfigInfo = JSON.parse(opAccountConfigAym.objList)
                    } else {
                        this.openAccountConfigInfo = JSON.parse(blocks.find(e => e.title === 'opAccountConfig').objList || '{}')
                    }

                    // 挽留弹窗赋值
                    this.detent = this.detentConf
                    this.isDetentPartConf = false
                    detentStatus().then(res => {
                        if (res.success && res.result) {
                            this.detent = this.detentPartConf
                            this.isDetentPartConf = true
                        }
                    })
                } else {
                    this.$_alert(res.resultDes).then(() => {
                        this.goBack()
                    })
                }
            })
            // 判断是否可提额，
            increaseCredit().then(res => {
                // 获取借款信息
                this.getApplyInit()
                if (res.success) {
                    /*
                    | Code | 描述 | 备注 |
                    | ---- | --- | --- |
                    | S000 | 提额成功 | 该code下，amount有值 |
                    | S001 | 提额超时 |  |
                    | S099 | 系统异常 |  |
                    | S101 | 该用户不可提额 | 非提额池用户，对应用户错误码15000001 |
                    | S102 | 已提额，暂时不可提额 | 对应用户错误码15000002 |
                    | S103 | 信用账户异常 | 对应用户错误码15000003 |
                    | S104 | 尚未通过基础授信 | 对应用户错误码15000004 |
                    | S105 | 有逾期的账单 | 对应用户错误码15000005 |
                    */
                    this.log({ type: 'button-logic', name: 'credit_increase_code_'+res.result.code, desc: '取现信用提额', extendData: (res.result&&res.result.amount) ? parseInt(res.result.amount / 1000) : null })

                    if(res.result.code==='S000' && res.result.amount) {
                        this.creditIncresed = parseInt(res.result.amount / 1000)
                        this.aplusStatus =  res.result.aplusStatus
                        this.showIncrese = true
                    }
                }
            })
            // 获取担保费标题和红包 当前接口fei s
            // getCreditSub({oidBiz: this.oidBiz}).then(res => {
            //     if (res.success) {
            //         this.includeFlag = res.result
            //     }
            // })
        },
        /**
         * 初始化， 获取可借区间
         */
        getApplyInit() {
            getApply({
                oidBiz: this.oidBiz
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    // 可借金额区间取整
                    this.maxAmt = Math.floor((~~result.maxAmt - ~~result.maxAmt % 1000) / 100000) * 100000
                    this.minAmt = Math.ceil((~~result.minAmt - ~~result.minAmt % 1000) / 100000) * 100000
                    if (!this.maxAmt || this.maxAmt < this.minAmt) {
                        this.errorHandler('2021fe01', '您可借额度不足，请还款或提额后再借款')
                        return false
                    }

                    if(!this.isFirst){
                        this.calPeriods()
                    }
                    this.hisBankCardId = (result.hisBank && result.hisBank.id) + ''
                    if(result.productName) {
                        this.barConfig.h5.title = result.productName
                        document.title = result.productName
                        this.productName = result.productName
                    }
                } else {
                    this.log({type: 'logic', name: 'loan_code_'+res.code, desc: '初始化'})
                    this.errorHandler(res.code, res.resultDes)
                }
            })
            const reasonIndex = Math.floor(Math.random() * this.loanReasonList.length )
            this.loanReason = this.loanReasonList[reasonIndex]
        },
        /**
         * 异常处理
         * @param  {[type]} code [异常code]
         * @param  {[type]} desc [异常描述信息]
         * @return {[type]}      [description]
         */
        errorHandler(code, desc) {
            // 常用错误处理读配置信息
            for (let [key, value] of Object.entries(this.openAccountConfigInfo || {})) {
                if (key === code) {
                    let dialog1 = this.$createDialog(
                        value.cancelText ?
                            {
                                type: 'confirm',
                                content: value.contentText,
                                confirmBtn: {
                                    text: value.confirmText
                                },
                                cancelBtn: {
                                    text: value.cancelText
                                },
                                onConfirm: () => {
                                    dialog1.hide()
                                    this.resetHref(value.url)
                                },
                                onCancel: () => {
                                    dialog1.hide()
                                    if (value.cancelUrl) {
                                        this.resetHref(value.cancelUrl)
                                    }
                                }
                            } : {
                                content: value.contentText,
                                confirmBtn: {
                                    text: value.confirmText
                                },
                                onConfirm: () => {
                                    dialog1.hide()
                                    this.resetHref(value.url)
                                }
                            }
                    ).show()
                    return
                }
            }
            // 特殊错误处理单独写代码
            switch (code) {
                // 未登录
                case '-1999':
                    this.$_toast(desc, () => {
                        AXD.util.login()
                    })
                    break
                    // 补充身份证信息
                case '2851000':
                case '2851001':
                    let dialog = this.$createDialog({
                        type: 'confirm',
                        title: '',
                        content: '您预留的身份证证件信息已过期或未登记完整，请补充完整',
                        confirmBtn: {
                            text: '立即补充'
                        },
                        cancelBtn: {
                            text: '关闭'
                        },
                        onConfirm: () => {
                            dialog.hide()
                            // this.resetHref('http://10.18.10.161:5000')
                            this.goAuth()
                        },
                        onCancel: () => {
                            dialog.hide()
                            this.goBack()
                        }
                    }).show()
                    break
                // 改成CMS配置项
                // case '2851004':
                //     window.location.replace('https://m.zhaojiling.com/cms/renderPage?alias=BMHGG')
                //     break
                default:
                    this.$_alert(desc).then(res => {
                        this.goBack()
                    })
                    break
            }
        },

        /**
         * 返回功能
         */
        goBack() {
            this.log({type: 'button-link', name: 'cash-bounced-return', desc: '返回', extendData: '/pages/rrh/index'})
            if(document.referrer.indexOf(window.location.host) === 0 ) {
                window.history.back()
            } else {
                this.$router.push('/pages/rrh/index')
            }
        },
        /**
         * 授信获得额度、提额
         * @return {[type]} [description]
         */
        goCredit() {
            AXD.util.goCredit({
                creditBackUrl: encodeURIComponent(window.location.href)
            })
        },
        /**
         * 未认证， 去认证
         */
        goAuth() {
            AXD.util.goAuth({
                backUrl: encodeURIComponent(window.location.href),
                authItem: 5,
                channel: 'aym_finance'
            })
        },
        pickAll() {
            this.log({type: 'button', name: 'cash-button-allout', desc: '全部取出'})
            this.balance = this.actualMaxAmt / 1000
            this.activePeriod = null
            this.cacheData = {}
            this.formatInts()
            // this.format()
            this.$refs.balanceInput && this.$refs.balanceInput.focus()
        },
        clearAll() {
            this.balance = ''
            this.$refs.balanceInput && this.$refs.balanceInput.focus()
        },
        /**
         * 借款金额input获取焦点时， 借款金额初始化为空
         * @return {[type]} [description]
         */
        formatInts() {
            // this.balance = ''
            this.isChangeBalance = true
            this.activePeriod = null
            this.cacheData = {}
            this.rate.monthPay = '￥0.00'
            this.rate.handlerServiceFee = '0.00'
            this.rate.details = []
            this.periods = []
        },
        /**
         * 格式化借款金额
         * @return {[type]} [description]
         */

        format(e) {
            setTimeout(()=>{  // 失焦&清除
                if (this.balance !== '') {
                    let obj = parseInt(this.balance) * 1000
                    if (obj > this.maxAmt) {
                        this.$_toast('最大可借金额：' + this.maxAmt / 1000, () => {
                            this.balance = this.maxAmt / 1000
                            this.calPeriods()
                        })
                    } else if (obj < this.minAmt) {
                        this.$_toast('最小可借金额：' + this.minAmt / 1000, () => {
                            this.balance = this.minAmt / 1000
                            this.calPeriods()
                        })
                    } else {
                        this.balance = obj / 1000
                        if (this.balance % 100) {
                            this.$_toast('借款金额为100的整数倍', () => {
                                this.balance =Math.floor(this.balance/100)*100
                                this.calPeriods()
                            })
                        } else {
                            this.calPeriods()
                        }
                    }
                }
            })
        },
        resetForm() {
            this.rate.monthPay = '￥0.00'
            this.rate.handlerServiceFee = '0.00'
            this.rate.details = []
            this.rate.securityFlag = false
            this.allowApply = false
        },
        /**
         * 初始化金额借款金额/修改借款金额，都会重新计算分期数
         * @return {[type]} [description]
         */
        calPeriods() {
            // 首次显示块加载
            if(this.isFirst){
                this.isShowBlockLoading = true
                this.isFirst = false
            }
            // 当前借款金额存入sessionStorage
            window.sessionStorage.setItem('balance', this.balance)
            this.cacheData = {}
            getPeriodsByAmy({
                oidBiz: this.oidBiz,
                amtLoan: parseInt(this.balance) * 1000
            }, { showLoading: !this.isShowBlockLoading } ).then(res => {
                if (res.success) {
                    if (res.result && res.result.bs && res.result.bs.length) {
                        if (!this.userId) {
                            // 用以获取用户银行卡信息
                            this.userId = res.result.custId + ''
                        }
                        // 借款分期排序，倒序排序
                        this.periods = res.result.bs.sort((pre, next) => next - pre)
                        let activePeriodVal =  window.sessionStorage.getItem('activePeriodVal') || this.querys.activePeriodVal
                        let curIndex = 0
                        if (activePeriodVal) {
                            // 优先取客户填写的分期或者循环路由预定的分期
                            curIndex = this.periods.findIndex(e => (e+'') === activePeriodVal)
                        } else {
                            // 否则取服务端给的defaultStage
                            curIndex = this.periods.findIndex( e=> (e+'') === res.result.defaultStage)
                        }
                        this.selectPerild(curIndex < 0 ? 0 : curIndex)
                    } else {
                        let dialog = this.$createDialog({
                            type: 'confirm',
                            title: '',
                            content: '您暂不符合当前资金渠道借款条件，请调整金额或者选择其他产品',
                            confirmBtn: {
                                text: '调整金额'
                            },
                            cancelBtn: {
                                text: '返回'
                            },
                            onConfirm: () => {
                                dialog.hide()
                                this.$refs.balanceInput && this.$refs.balanceInput.focus()
                            },
                            onCancel: () => {
                                dialog.hide()
                                this.goBack()
                            }
                        }).show()
                    }
                } else {
                    this.errorHandler(res.code, res.resultDes)
                }
            })
        },
        /**
         * 选择分期， 计算月供、还款计划
         * @param  {[type]} index [分期数]
         * @return {[type]}       [description]
         */
        selectPerild(index) {
            this.currentCode = ''
            if (!this.balance) {
                this.$_toast('请输入借款金额')
                return false
            }
            if (index !== this.activePeriod) {
                this.activePeriod = index
                this.currentPeriod = this.periods[index]
                // 选中分期数存入sessionStorage
                window.sessionStorage.setItem('activePeriodVal', this.currentPeriod)
                // 计算月供、选中分期数
                this.initCoupon = true // 清空当前优惠券code码，重新显示多少张优惠券可用
                this.calRateFn({
                    amtLoan: parseInt(this.balance) * 1000,
                    oidBiz: this.oidBiz,
                    period: this.periods[index]
                })
            }
        },
        /**
         * 计算月供、分期数
         * @return {[type]} [description]
         */
        calRateFn(obj) {
            // if (this.cacheData[obj.period]) {
            //     let rate = this.cacheData[obj.period]
            //     this.rate = Object.assign({}, rate)
            //     this.allowApply = true
            // } else {
            calRate(obj, { showLoading: !this.isShowBlockLoading }).then(res => {
                if (res.success) {

                    this.isChangeBalance = false
                    let result = res.result
                    // 是否预风控资产
                    this.rate.preRiskFlag = result.preRiskFlag
                    // 是否需要签约中互金协会征信授权书
                    this.creditAuthContract = {
                        creditAuthContractFlag: result.creditAuthContractFlag,
                        tempNo: result.tempNo || ''
                    }
                    // 平均月供
                    this.rate.monthPay = '￥' + formatMoneyK(result.monthPay)
                    // 手续费、保费、担保费、风险评估费
                    // 其他渠道-手续费， 使用 handlerService 字段
                    this.rate.handlerServiceFee = formatMoneyK(result.handlerService)
                    // 还款计划
                    this.rate.details = result.details
                    this.yealServiceRate = result.yealServiceRate
                    this.additionParams = result.additionParams
                    // 增信费是否显示
                    this.rate.securityFlag = result.securityFlag
                    this.loanProvider = result.loanProvider

                    const {
                        /**
                         *  rightStatus
                            0: 默认无权益使用，不展示权益模块(非权益资产或者无匹配权益的用户
                            1: 有符合条件的可使用权益
                            2: 有符合条件的权益,但是在支付中
                            3: 没有符合条件的可使用权益，可以提示用户购买
                            4: 有符合条件的权益，但是权益已经失效
                         */
                        rightStatus,
                        packageUserId,
                        buyPackageId,
                        rightPackageName,
                        rightTitle,
                        rightSubTitle,
                        preRiskId,  // 预风控id
                        rateLevel, // 最终该用户预风控和资金匹配的费率等级
                        rightForceSelect // 是否强制使用权益卡
                    } = result

                    const {
                        totalDiscountAmtWithRight,
                        securityAmt,
                        securityAmtWithRight,

                        securityType,
                        securityTypeWithRight
                    } = result.securityInfo || {}

                    this.rightsObj = {
                        rightStatus,
                        packageUserId,
                        buyPackageId,
                        rightPackageName,
                        rightTitle,
                        rightSubTitle,
                        preRiskId,
                        rateLevel,
                        rightForceSelect,

                        totalDiscountAmtWithRight,
                        securityAmt,
                        securityAmtWithRight
                    }

                    this.securityType = securityType
                    this.securityTypeWithRight = securityTypeWithRight

                    if (result.securityFlag) {
                        this.rate.securityInfo = {
                            oidBiz: this.oidBiz,
                            ...result.securityInfo
                        }
                    } else {
                        this.rate.securityInfo = {}
                    }
                    // 存入缓存
                    // this.cacheData[obj.period] = Object.assign({}, this.rate)
                    this.allowApply = true
                } else {
                    this.resetForm()
                    if (res.code === '1000') {
                        this.$_alert('获取不到借款信息啦，联系客服试试').then(res => {
                            this.goBack()
                        })
                    } else {
                        this.$_alert(res.resultDes)
                    }
                }
            }).finally(()=>{
                this.isShowBlockLoading = false
                this.isShowBlock = true
            })
            // }
        },
        /**
         * 选择银行卡
         * @return {[type]} [description]
         */
        selectBankCard(data) {
            if (data && data.cardId) {
                // 银行卡ID
                this.bankCardId = data.cardId
                // 银行code
                this.bankInfo.bankCode = data.bankCode
                // 银行卡号
                this.bankInfo.cardCode = data.cardCode
                // 银行名称
                this.bankInfo.bankName = data.bankName
                // 用户身份证号
                this.bankInfo.custId = data.custId
                // 用户姓名
                this.bankInfo.custName = data.custName
                // 用户手机号
                this.bankInfo.mobile = data.mobile
            }
        },
        /**
         * 选择消费用途
         */
        selConsumer(val) {
            this.loanReason = val
        },
        /**
         * 立即申请
         * @return {[type]} [description]
         */
        async submit() {
            if (!this.allowApply) {
                return false
            }
            // 借款金额不能为空
            if (this.balance === '') {
                this.$_toast('借款金额不能为空')
                return false
            }
            if(this.balance % 100) {
                this.$_toast('借款金额为100的整数倍')
                return false
            }
            let balance = parseInt(this.balance) * 1000
            // 输入金额不满足要求, 分期数不符合要求， 直接返回，不进行请求
            if (isNaN(balance) || balance < this.minAmt || balance > this.maxAmt || this.activePeriod === null) {
                return false
            }
            if (this.bankCardId === '') {
                const $this = this
                let dialog = this.$createDialog({
                    type: 'confirm',
                    title: '',
                    content: '您当前未绑定符合资方要求的银行卡，请先绑卡',
                    confirmBtn: {
                        text: '立即绑卡'
                    },
                    cancelBtn: {
                        text: '关闭'
                    },
                    onConfirm: () => {
                        dialog.hide()
                        $this.$router.push({
                            path: '/pages/bankCard/add',
                            query: {
                                loanProvider: $this.loanProvider
                            }
                        })
                    },
                    onCancel: () => {
                        dialog.hide()
                    }
                }).show()
                return false
            }
            // 勾选《增信费服务协议》验证
            if (!this.$refs.constract.ischeck) {
                this.$_toast('请同意借款等相关服务协议')
                return false
            }

            this.log({type: 'button', name: 'cash-button-next', desc: '一键申请'})
            this.allowApply = false
            await this.checkRightStatus(this.rightsObj)
            this.order()
            // if(this.$refs.constract.forceContract.length) {
            //     this.$refs.constract.isShowForceContract = true
            // } else {
            //     this.order()
            // }
        },
        async checkRightStatus(rightsObj){
            if(rightsObj.rightStatus == '1' && !this.isChooseRights){
                // 服务费减免 undefined 0 '0' null
                if(rightsObj.totalDiscountAmtWithRight && rightsObj.totalDiscountAmtWithRight !== '0'){
                    if(await this.showRightStatusDialog({content:'服务费减免权益'})){
                        this.isChooseRights = true
                    }
                }else{
                    if(await this.showRightStatusDialog({content:'取现通过率提升权益'})){
                        this.isChooseRights = true
                    }
                }
            }
        },
        showRightStatusDialog(config = {}){
            const dialog = new Promise((resolve,reject)=>{
                try{
                    this.$createDialog({
                        type:config.type || 'confirm',
                        title: config.title || '',
                        content:`确认不使用${config.content}吗？`,
                        confirmBtn: '我要使用',
                        cancelBtn:'不使用',
                        onConfirm:()=>{
                            resolve(true)
                        },
                        onCancel:()=>{
                            resolve(false)
                        }
                    }).show()
                }catch(e){
                    reject(e)
                }
            })
            return dialog
        },
        getLocation(){
            let  autoLocationInfo = window.sessionStorage.getItem('autoLocationInfo')
            try{
                const obj  = JSON.parse(autoLocationInfo)
                if(obj && obj.longitude){
                    return Promise.resolve(autoLocationInfo)
                }
            }catch(e){}

            return AXD.util.getLocationFromServer('取现详情获取定位')
        },
        showTipsBuyRights(code){
            const {
                buyPackageId,
                totalDiscountAmtWithRight,
                securityAmt,
                securityAmtWithRight,
                rightPackageName
            }  = this.rightsObj

            // 5001 低费率 无权益
            // 5002 支付中
            // 5003 低费率没有选择权益卡
            if(code === '5002'){
                this.$_toast(`您的${rightPackageName}尚在支付中，请耐心等待`)
                return
            }
            if(code === '5003'){
                this.$_toast(`请选择${rightPackageName}帮您提高取现通过率`)
                return
            }
            if(code === '5001'){
                if(this.preRightPackage === 'y'){
                    this.$_toast('抱歉，您的取现审核未通过')
                }else{
                    this.$_confirm({
                        title: '很抱歉，审核未通过',
                        content: `您已获得资质提升机会，开通${rightPackageName}，取现通过率提升至90%`,
                        confirmBtn: '马上提升',
                        cancelBtn: '取消',
                        onConfirm:()=>{
                            this.log({type: 'button-logic', name: 'dialog-rights-confirm', desc: '购买权益弹窗'})

                            this.$router.push({
                                path:'/pages/rrh/rights',
                                query:{
                                    oidBiz: this.oidBiz,
                                    productName: this.productName,
                                    buyPackageId,
                                    totalDiscountAmtWithRight,
                                    securityAmt,
                                    securityAmtWithRight,
                                    preNeedCard: 'n'
                                }
                            })
                        },
                        onCancel:()=>{
                            this.log({type: 'button-logic', name: 'dialog-rights-cancel', desc: '购买权益弹窗'})
                            // this.$router.replace({
                            //     name: 'rrhIndex'
                            // })
                        }
                    })
                }
                return
            }

        },
        /**
         * 下单
         * @return {[type]} [description]
         */
        async order() {
            const baiduMac = await this.getLocation()
            this.log({type: 'logic', name: 'cash-button-submit', desc: '取现提交定位',extendData:baiduMac})

            // 审核中
            this.$refs.hourglass.show()
            // 默认倒计时2秒后再请求reqOrder接口
            let times = 2000
            // 当有复选框且咨询服务费未勾选，倒计时3秒后假弹窗展示
            let selectSecurityFlag = this.rate.securityInfo.selectSecurityFlag
            if (selectSecurityFlag && (!this.$refs.security.isChecked)) {
                times = 3000
            }
            setTimeout(() => {
                // 预风控资产(preRiskFlag为true) or 非预风控资产且无复选框，走老逻辑
                if (this.rate.preRiskFlag || (!this.rate.preRiskFlag && (!selectSecurityFlag || (selectSecurityFlag === '0')))) {
                    this.reqOrder(baiduMac)
                    return
                }
                // 非预风控资产有复选框,判断复选框未勾选走假弹窗
                if (this.$refs.security.isChecked) {
                    this.reqOrder(baiduMac)
                } else {
                    this.log({type: 'button-logic', name: 'loan_uncheck_dialog', desc: '一键申请咨询费未勾选假弹窗'})
                    this.$refs.hourglass.hide()
                    let serviceFeeTip = this.openAccountConfigInfo.serviceFeeTip
                    let dialog1 = this.$createDialog({
                        type: 'confirm',
                        title: '',
                        content: serviceFeeTip.contentText,
                        confirmBtn: {
                            text: serviceFeeTip.confirmText
                        },
                        cancelBtn: {
                            text: serviceFeeTip.cancelText
                        },
                        onConfirm: () => {
                            this.log({type: 'button-logic', name: 'loan_uncheck_confirm', desc: '一键申请咨询费未勾选假弹窗点了确认'})
                            dialog1.hide()
                            this.resetHref(serviceFeeTip.url)
                        },
                        onCancel: () => {
                            this.log({type: 'button-logic', name: 'loan_uncheck_cancel', desc: '一键申请咨询费未勾选假弹窗点了取消'})
                            dialog1.hide()
                            this.allowApply = true
                        }
                    }).show()
                }
            }, times)
        },
        reqOrder(baiduMac) {
            const { preRiskId, rateLevel, packageUserId, rightStatus } = this.rightsObj
            const startTime = new Date()
            reqOrder({
                baiduMac,

                rightSelect: +this.isChooseRights,
                preRiskId, // 预风控id
                rateLevel, // 最终该用户预风控和资金匹配的费率等级
                activityCode: packageUserId,
                rightStatus, // 使用权益状态

                couponCode: this.currentCode,
                amtLoan: parseInt(this.balance) * 1000,
                bankCardId: this.bankCardId,
                loanReason: this.loanReason,
                period: this.periods[this.activePeriod],
                oidBiz: this.oidBiz,
                loanProvider: this.loanProvider,
                additionParams: this.additionParams
            }).then(res => {
                if (res.success) {
                    this.log({type: 'button-logic', name: 'cash-button-success', desc: '一键申请进入成功逻辑'})
                    this.allowApply = true
                    // 订单ID
                    this.loanId = res.result.loanId
                    // 是否二次风控  0:不需要2次风控 ，1：需要2次风控
                    this.secondRiskFlag = res.result.secondRiskFlag === '1'? true : false
                    // 湖北消金模版地址
                    this.hubeiTempNo = res.result.tempNo || ''
                    if(res.result.relationRejectFlag === '1') {
                        const relationShips = Array.isArray(res.result.relationShips) ? res.result.relationShips.join('_') : ''
                        if(!relationShips) {
                            this.$_alert('服务器错误, 需要补充联系人为空')
                            return
                        }
                        this.$createDialog({
                            content: '根据信用评估，您提交的联系人相关信息已过期，为了不影响您的取现申请，请重新提交',
                            confirmBtn: '知道了',
                            onConfirm: () => {
                                const path = `/pages/rrh/replenishVerify?oidBiz=${this.oidBiz}&loanId=${res.result.loanId}&bankCardId=${this.bankCardId}`
                                AXD.util.goContacts({
                                    backUrl: encodeURIComponent(window.location.origin + path),
                                    reset: relationShips,
                                    loanId: res.result.loanId
                                })
                            }
                        }).show()
                        return
                    }
                    // 强制阅读后置
                    if(this.$refs.constract.forceContract.length){
                        this.$refs.constract.isShowForceContract = true
                    }else{
                        this.orderAfterHook()
                    }
                    // 把银行卡信息带到贷款签约页面
                    // window.sessionStorage.setItem('loanInfo', JSON.stringify({
                    //     cardCode: tailNum(this.bankInfo.cardCode),
                    //     bankName: this.bankInfo.bankName
                    // }))
                    // localReplenish引用自mixins['loanProductsHandler'],先判断区域补录，再判断签约
                    // this.localReplenish({
                    //     oidBiz: this.oidBiz,
                    //     loanId: this.loanId,
                    //     bankCardId: this.bankCardId,
                    //     closeLoading: () => {
                    //         this.allowApply = true
                    //     },
                    //     succCallback: () => {
                    //         this.allowApply = true
                    //         this.toPassword()
                    //     }
                    // }, 'password', 'rrhIndex')
                } else {
                    this.allowApply = true
                    this.log({type: 'button-logic', name: 'loan_code_'+res.code, desc: '一键申请进入失败逻辑'})
                    if (res.code) {
                        if (['5001','5002','5003'].indexOf(res.code)>-1){
                            const diff = 1000 - (new Date() - startTime)
                            if(res.code === '5001' && diff > 100 ){
                                // 至少显示1s
                                return new Promise((resolve)=>{
                                    setTimeout(()=>{
                                        this.showTipsBuyRights(res.code)
                                        resolve()
                                    },diff)
                                })
                            }
                            return  this.showTipsBuyRights(res.code)
                        }

                        for (let [key, value] of Object.entries(this.openAccountConfigInfo|| {})) {
                            if (key === res.code) {
                                let dialog1 = this.$createDialog({
                                    type: 'confirm',
                                    title: '',
                                    content: value.contentText,
                                    confirmBtn: {
                                        text: value.confirmText
                                    },
                                    cancelBtn: {
                                        text: value.cancelText
                                    },
                                    onConfirm: () => {
                                        this.log({type: 'button-logic', name: 'loan_fail_confirm_code_'+res.code, desc: '一键申请失败弹窗点了确认'})
                                        dialog1.hide()
                                        this.resetHref(value.url)
                                    },
                                    onCancel: () => {
                                        dialog1.hide()
                                        this.$router.replace({
                                            name: 'rrhIndex'
                                        })
                                    }
                                }).show()
                                return
                            }
                        }
                        let text = res.code === '2003' ? '您暂不符合申请条件，请尝试其他产品' : res.resultDes
                        this.$_alert(text).then(res => {
                            this.goBack()
                        })
                    } else {
                        this.$_alert(res.resultDes)
                    }
                }
            }).finally(()=>{
                this.$refs.hourglass && this.$refs.hourglass.hide()
            })
        },
        orderAfterHook(){
        // 把银行卡信息带到贷款签约页面
           window.sessionStorage.setItem('loanInfo', JSON.stringify({
                cardCode: tailNum(this.bankInfo.cardCode),
                bankName: this.bankInfo.bankName
            }))
        // localReplenish引用自mixins['loanProductsHandler'],先判断区域补录，再判断签约
            this.localReplenish({
                oidBiz: this.oidBiz,
                loanId: this.loanId,
                bankCardId: this.bankCardId,
                closeLoading: () => {
                    this.allowApply = true
                },
                succCallback: () => {
                    this.allowApply = true
                    this.toPassword()
                    }
                }, 'password', 'rrhIndex')
        },
        getCode(code) {
            this.currentCode = code
            if(!code) {
                this.initCoupon = true
            } else {
                this.initCoupon = false
            }
            // 把code码传给trial这个接口
            this.cacheData = {}
            this.calRateFn({
                amtLoan: parseInt(this.balance) * 1000, // 取现金额
                oidBiz: this.oidBiz, // 资产编号
                period: this.periods[this.activePeriod], // 分期数
                couponCode: this.currentCode
            })
        },
        toPassword() {
            // 召集令取现外放用验证码，召集令APP内部调用用密码
            if (isZjl) {
                this.$router.push({
                    name: 'commonPwdpage',
                    query: { source: 'rrh', id: this.loanId }
                })
            } else {
                this.$router.push({
                    name: 'rrhVfCode',
                    query: {
                        key: 'wf',
                        id: this.loanId
                    }
                })
            }
        },
        dialogClose() {
            this.log({type: 'button', name: 'cash-bounced-borrow', desc: this.detent.submitText})
            this.showDetention = false
            // 有配置走配置
            if (this.detent.submitUrl) {
                this.resetHref(this.detent.submitUrl)
            }
        },
        toCancel() {
            // 有配置走配置
            if (this.detent.cancelUrl) {
                this.resetHref(this.detent.cancelUrl)
            } else {
                this.goBack()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
@import 'src/assets/styles/flex.scss';

::v-deep .mui-content {
    padding-bottom: px2rem(120);


    .date-tip {
        color: #999;
        font-size: px2rem(30);
    }
    .mui-cell {
        font-size: .63rem;
    }
}

.page {
    background: #F8F8F8;
    padding: px2rem(20);
    .page__head{
        padding:px2rem(32);
        background-color: #fff;
        border-radius:px2rem(4);
        .page__head__main {
            display: flex;
            align-items: center;
            margin:px2rem(16) 0 px2rem(8);
            .unit {
                font-weight: 600;
                font-size: px2rem(48);
                // line-height: px2rem(100);
            }
            .page__head__input {
                flex:1;
                width: 100%;
                // height: px2rem(100);
                line-height: px2rem(93);
                font-size: px2rem(80);
                font-weight:700;
                background-color: transparent;
                border: none;
                font-family: DINAlternate, DINAlternate-Bold;
                position:relative;

                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                &::-webkit-input-placeholder {
                    color: $auiLineColorLight;
                    font-weight:600;
                    font-size: px2rem(48);
                    position: absolute;
                    bottom: px2rem(13);
                }
            }

            .action{
                color: var(--auiLinkColorDefault);
                font-size: px2rem(24);
                line-height: px2rem(100);
                position: relative;
                .clear {
                    display: block;
                    position: absolute;
                    left: px2rem(-80);
                    width: px2rem(80);
                    text-align: center;
                    top: 0;
                    ::v-deep .mui-icon {
                        color: #ccc;
                        font-size: px2rem(30);
                    }
                }
            }
        }
        .page__head__desc{
            font-size: $auiFontSizeLevel6;
            color: $auiTextColorAssistant;
        }
    }
    @keyframes icon-rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .page__loading{
        margin-top:px2rem(24);
        text-align:center;
        color:#333;
        font-size:px2rem(28);
        .loading__icon{
            display: inline-block;
            margin-right: px2rem(8);
            vertical-align: middle;
            width:px2rem(30);
            height:px2rem(30);
            animation: icon-rotate 0.6s linear infinite;
        }
    }

}

::v-deep .detention-popup {
    .aui-mask {
        z-index: 2000;
    }
    .aui-popup_content {
        width: 70%;
        padding: px2rem(40) 0;
        top: 50%;
        bottom: auto;
        margin: -40% auto 0;
        border-radius: 2px;
        z-index: 2001;
    }
    .popup__body {
        padding: 0 px2rem(40) px2rem(40);
        img{
            max-width: 100%;
            max-height: px2rem(410);
        }
    }
    .popup__footer {
        text-align: center;
        .mui-btn {
            width: 40%;
            margin: 0 px2rem(10);
        }
        .mui-btn_plain{
            background: rgba(0,0,0,0.1);
        }
    }
}

::v-deep .increse-popup {
    .aui-mask {
        z-index: 2000;
    }
    .aui-popup_content {
        font-size: px2rem(40);
        width: 75%;
        padding: px2rem(40) px2rem(30);
        text-align: center;
        top: 50%;
        bottom: auto;
        margin: -50% auto 0;
        border-radius: 2px;
        z-index: 2001;
    }
    .popup__body {
        padding: 0 px2rem(40) 0;
        background: url(../styles/imgs/increseCredit.png) center 90% no-repeat;
        background-size: 60% 60%;
        height: px2rem(420);
    }
    .tip {
        color: #666;
        font-size: px2rem(30);
    }
    .bigger {
        font-size: px2rem(60);
    }
    .amount {
        color: #FF3E00;
    }
    .popup__footer {
        padding-top: px2rem(20);
        text-align: center;
        .mui-btn {
            width: 80%;
            display: inline-block;
        }
    }
}


.aui-cell.disabled:active {
    background-color: #ffffff;
}

.aui-cell.disabled .aui-cell__ft:after {
    display: none;
}

::v-deep .bankcard {
    .bank {
        margin-top: 0;
    }
}

.right-align ::v-deep .mui-cell__ft {
    padding-right: 1.06667rem;
}

::v-deep .mui-cell {
    border-bottom: 1px solid #E6E6E6;
    padding: 0 px2rem(32);
    border-bottom: none;
    // padding: 0;
}
::v-deep .fee .mui-cell__hd_icon {
    width: 0;
    margin-right: 0;
}
::v-deep .view .mui-cell__ft:after {
    width: px2rem(25);
    height: px2rem(13);
    @include img2x('../styles/imgs/shrink');
    margin-top: 0;
    transform: translateY(-50%);
}
::v-deep .view-expand .mui-cell__ft:after {
    @include img2x('../styles/imgs/expand');
}
.goldCard {
    margin-top: px2rem(24);
    height: px2rem(109);
    opacity: 1;
    background: linear-gradient(180deg,#ffffff 0%, #fffcf5 100%);
    border: px2rem(2) solid #e1cea6;
    border-radius: px2rem(6);
    padding: 0 px2rem(36);
    span {
        display: inline-block;
        vertical-align: middle;
        line-height: px2rem(109);
    }
    .icon {
        width: px2rem(66);
        height: px2rem(66);
        margin-right: px2rem(0);
        background: url(../styles/imgs/goldCardIcon.png) center 90% no-repeat;
        background-size: cover;
    }
    .cardStatus {
        font-size: px2rem(32);
        font-weight: 600;
        color: #795b2e;
        margin-right: px2rem(40);
    }
    .cardEndTime {
        font-size: px2rem(22);
        color: #999;
    }
}
    ::v-deep .goldBtn {
        background: linear-gradient(90deg,#eed9aa, #dab780);
        border-radius: px2rem(4);
        border: none;
        color: #795b2e;
        font-size: px2rem(36);
        font-weight: 400;
    }
.bottom__tag{
    position:absolute;
    right:px2rem(32);
    top:0;
    z-index:1;
    border-radius: px2rem(28) px2rem(28) px2rem(28) 0;
    // border-bottom-left-radius:0;
    font-size:px2rem(22);
    line-height:px2rem(44);
}
.hourglass{
    display: flex;
    align-items: center;
    width: px2rem(470);
    height: px2rem(400);
    padding: px2rem(30);
    background: #fff;
    border-radius: px2rem(12);
    color: #666;
    font-size: px2rem(36);
    .hourglass__main {
        margin: 0 auto;
    }
    .hourglass__img{
        width:px2rem(120);
        height:px2rem(120);
        margin: 0 auto px2rem(10);
    }
}
</style>
