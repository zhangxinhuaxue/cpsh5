<!--
 * @Author: wzy
 * @Description: 更换联系人
 * @Date: 2021-03-23
 -->
<template>
    <div class="outer-bg">
        <div class="top-out">
            <p class="top1">请更换有效联系人</p>
        </div>
        <div class="cont-out" v-for="(item, i) in contactList" :key="i">
            <m-cell-group>
                <m-cell
                    title="关系"
                    placeholder="请选择"
                    class="ref-out"
                    :value="relationMap(contactList[i].contactType)"
                    is-link
                    @click="showActionsheet(i)">
                </m-cell>
                <div class="part">
                    <m-input
                        title="姓名"
                        v-model="contactList[i].contactName"
                        @blur="toNameBlur(i)"
                        placeholder="请输入联系人姓名">
                    </m-input>
                    <m-input
                        title="联系方式"
                        type="tel"
                        v-model="contactList[i].contactTel"
                        @blur="toTelBlur(i)"
                        placeholder="请输入联系人联系方式"
                        :maxlength="11">
                    </m-input>
                    <div class="addressbtn" @click="pickContacts(i)"><img src="../assets/images/contact-icon.png"/></div>
                    <div class="tip" v-if="item.showTip">请重新选择</div>
                </div>
            </m-cell-group>
        </div>
        <div class="cont-btn">
            <m-button @click="toSubmit" :disabled="disabled">继续申请</m-button>
            <p class="cont-btn-tip">招集令承诺，严格保障您的信息安全</p>
        </div>
        <creditcheck ref="creditcheck" :creditOrderId="creditOrderId"></creditcheck>
    </div>
</template>
<script>
import {
    getRejectContacts,
    submitRepairContacts,
    checkChangeTel
} from 'src/store/modules/credit-system'
import creditcheck from '../common/credit-check.vue'
import { AXD, testTelphone, testName, isAndroid, getCookie } from 'src/libs/util'
import { setHeader } from '../common/setHeader'

export default {
    name: 'changeContacts',
    data() {
        return {
            ref1: {
                relatives: '亲属',
                spouse: '配偶'
            },
            ref2: {
                colleague: '同事',
                friend: '朋友',
                classmate: '同学'
            },
            refAll: [],
            platform: 'aiyoumi',
            contactList: [],
            ossKey: '',
            creditOrderId: '',
            type: 1,
            actionTexts: [],
            actionKeys: []
        }
    },
    components: {
        creditcheck
    },
    computed: {
        disabled() {
            let check = this.contactList.some(item => {
                return item.showTip || (!item.contactType)
            })
            return check || this.submitting
        }
    },
    created() { 
        // 页面初始高度
        const originalHeight = document.documentElement.clientHeight || document.body.clientHeight
        // 监听可视区高度变化 - 防治软键盘弹起后页面不可滚动
        window.onresize = () => {
            document.querySelector('body').setAttribute('style', 'height:' + originalHeight + 'px;')
        }
    },
    mounted() {
        this.refAll = Object.assign({}, this.ref1, this.ref2)
        this.init()
        this.setInit()
    },
    methods: {
        relationMap(contactType) {
            return this.refAll[contactType]
        },
        showActionsheet(i) {
            let refs = {}
            if (this.type === 1) {
                refs = this.ref1[this.contactList[i].contactType] ? this.ref1 : this.ref2
                
            } else if (this.type === 2) {
                let otherContactType = this.contactList[i === 0 ? 1 : 0].contactType
                if (otherContactType) {
                    if (this.ref1[otherContactType]) {
                        // 另个关系是亲属类，合并关系后剔除当前亲属
                        refs = Object.assign({}, this.refAll)
                        delete refs[otherContactType]
                    } else {
                        // 另个关系是非亲属，取亲属类关系
                        refs = this.ref1
                    }
                } else {
                    // 另个关系为空合并关系
                    refs = Object.assign({}, this.refAll)
                }
            }
            this.actionKeys = Object.keys(refs)
            this.actionTexts = Object.keys(refs).map(key => refs[key])
            this.$createActionSheet({
                data: this.actionTexts,
                selectItem: {
                    isSelect: true,
                    index: this.actionKeys.indexOf(this.contactList[i].contactType)
                },
                onSelect: (item, index) => {
                    this.contactList[i].contactType = this.actionKeys[index]
                }
            }).show()
        },
        // 姓名失去焦点
        toNameBlur(i) {
            this.contactList[i].showTip = !(this.contactList[i].contactName && this.contactList[i].checkTel)
        },
        // 手机号失去焦点
        toTelBlur(i) {
            this.contactList[i].checkTel = false
            let contactTel = this.contactList[i].contactTel
            if (!contactTel) {
                this.contactList[i].showTip = true
                return true
            }
            if (!testTelphone(contactTel)) {
                this.contactList[i].showTip = true
                let telTip = '手机号码格式错误'
                if (this.contactList.length === 2) {
                    telTip = '第' + (i === 0 ? '一' : '二') + '个' + telTip
                }
                this.$_toast(telTip)
                return true
            }
            checkChangeTel({ contactTel }).then(res => {
                if (res.success) {
                    this.contactList[i].showTip = !this.contactList[i].contactName
                    this.contactList[i].checkTel = true
                } else {
                    this.contactList[i].showTip = true
                    this.$_toast(res.resultDes)
                }
            })
        },
        setInit() {
            if (this.isApp) {
                // 设置提额页回退，跳转creditBackUrl 或 关闭当前webview
                setHeader({
                    leftbuttonAction: 'amountGoBack'
                })
                window.amountGoBack = () => {
                    sessionStorage.setItem('contactList', JSON.stringify(this.contactList))
                    axdApp.send({
                        module: 'webview',
                        method: 'close'
                    })
                }
            }
        },
        init() {
            if (sessionStorage.getItem('contactList')) {
                this.contactList = JSON.parse(sessionStorage.getItem('contactList'))
                this.contactList.forEach(item => {
                    item.contactTel = this.deleteSpace(item.contactTel)
                })
            } else {
                getRejectContacts().then(res => {
                    // res = {
                    //     code:null,
                    //     resultDes:'当前没有需要修改联系人',
                    //     success:true,
                    //     result: {
                    //         contacts: [
                    //             {
                    //                 contactTel: '15317865666',
                    //                 contactType: 'relatives',
                    //                 contactName: '丫丫',
                    //             },
                    //             {
                    //                 contactTel: '13111111111',
                    //                 contactType: 'spouse',
                    //                 contactName: '小王',
                    //             }
                    //         ]
                    //     }
                    // }
                    if (res.success) {
                        let contacts = []
                        if (res.result && res.result.contacts) {
                            contacts = res.result.contacts
                            // this.type的取值：1表示取ref1或ref2中的数据，2表示重新组装数据
                            if (contacts.length === 1) {
                                this.type = 1
                            } else {
                                if (this.ref1[contacts[0].contactType] && this.ref1[contacts[1].contactType]) {
                                    this.type = 1
                                } else if (this.ref2[contacts[0].contactType] && this.ref2[contacts[1].contactType]) {
                                    contacts[0].contactType = ''
                                    contacts[1].contactType = ''
                                    this.type = 2
                                } else {
                                    this.type = 1
                                }
                            }
                            contacts.forEach(item => {
                                item.contactTel = this.deleteSpace(item.contactTel)
                                item.showTip = true
                                item.checkTel = false
                            })
                        } else {
                            this.type = 2
                            contacts = [{
                                contactType: '',
                                contactName: '',
                                contactTel: '',
                                showTip: true,
                                checkTel: false
                            }, {
                                contactType: '',
                                contactName: '',
                                contactTel: '',
                                showTip: true,
                                checkTel: false
                            }]
                        }
                        this.contactList = contacts
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
            }
        },
        selContactType(i, val) {
            this.contactList[i].contactType = val
        },
        deleteSpace(str) {
            if (typeof(str) === 'string') {
                return str.replace(/-|(\+86)|( )|(\s+)/g, '')
            }
        },
        // 手机通讯录选择联系人
        pickContacts(index) {
            if (this.isApp) {
                axdApp.send({
                    module: 'tools',
                    repeat: true,
                    method: 'pickContacts',
                    callback: (ret) => {
                        this.log({type: 'button-logic', name: 'credit-changecontacts-pick', desc: '联系人驳回选择联系人'+index, extendData: JSON.stringify(ret)})
                        // 兼容部分安卓机无法准确获取到联系人信息，返回取消操作
                        if(isAndroid && ret.code === -995) {
                            this.log({type: 'button-logic', name: 'credit-changecontacts-reject', desc: '联系人驳回部分安卓机无法准确获取到联系人信息', extendData: JSON.stringify(ret)})
                            return
                        }
                        // 无权限处理
                        if(ret.code === -994) {
                            this.$_toast('当前未获取到应用通讯录权限，请在设置中打开')
                            return
                        }
                        let name = ret.data.name
                        let phone = ret.data.phone
                        if (phone) {
                            // 去掉iOS选择联系人返回的手机号中的空格
                            phone = this.deleteSpace(phone)
                            if (!name) {
                                this.qxTipsDialog('请先修改联系人姓名，不要使用表情')
                                return
                            }
                            // 验证手机号格式
                            if (!testTelphone(phone)) {
                                this.$_toast('手机号码格式错误')
                                return
                            }
                            // 接口验证手机号
                            checkChangeTel({ contactTel: phone }).then(res => {
                                if (res.success) {
                                    this.contactList[index].showTip = false
                                    this.contactList[index].checkTel = true
                                    this.contactList[index].contactName = name.replace(/\s+/g, '')
                                    this.contactList[index].contactTel = phone
                                    // this.uploadDeviceInfo()
                                } else {
                                    this.$_toast(res.resultDes)
                                }
                            })
                        } else {
                            this.qxTipsDialog('获取联系人号码失败')
                        }
                    }
                })
            }
        },
        // 上传通讯录
        // uploadDeviceInfo() {
        //     if (!this.isApp || (this.isApp && this.ossKey)) {
        //         return
        //     }
        //     let env = isAndroid ? 'Android' : 'IOS'
        //     // 触发原生上传通讯录
        //     axdApp.send({
        //         module: 'tools',
        //         method: 'uploadDeviceInfo',
        //         params: {
        //             event: 'event_credit_base'
        //         },
        //         callback: (res) => {
        //             let stringRes = JSON.stringify(res)
        //             if (res && res.data && res.data.ossKey) {
        //                 this.ossKey = res.data.ossKey
        //             }
        //         }
        //     })
        // },
        qxTipsDialog(content) {
            this.$createDialog({
                content,
                confirmBtn: '好的'
            }).show()
        },
        validate() {
            let list = this.contactList
            let check = list.some(item => {
                if (!testName(item.contactName)) {
                    this.$_toast('姓名至少2个汉字，不含其他字符')
                    return true
                }
            })
            if (check) {
                return false
            }
            if ((list.length === 2) && (list[0].contactTel === list[1].contactTel)) {
                this.$_toast('两位联系人手机号请勿重复')
                return false
            }
            return true
        },
        // 提交
        toSubmit() {
            // 验证
            if (!this.validate()) {
                return
            }
            // 获取百度地图
            AXD.util.getLocationInfo('基础授信修改联系人提交',()=>{
                this.$refs.creditcheck.toStart() 
            }).finally(res => {
                this.lastSubmit(res)
            })
        },
        lastSubmit(baiduMac = '{}') {
            let paramObj = {}
            let keyObj = {
                0: 'contactOne',
                1: 'contactTwo'
            }
            this.contactList.forEach((item, i) => {
                paramObj[keyObj[i]] = item
            })
            AXD.util.getPermission('checkContact', '授信判断通讯录权限')
            submitRepairContacts({
                from: this.isApp ? (/android/gi.test(navigator.userAgent) ? 'android' : 'ios') : 'h5',
                platform: this.platform,
                channel: getCookie('credit-channel'),
                baiduMac,
                contacts: JSON.stringify(paramObj)
            }).then(res => {
                if (res.success) {
                    sessionStorage.removeItem('contactList')
                    this.creditOrderId = res.result.creditOrderId 
                    
                    // 开始倒计时
                    this.$nextTick(()=>{
                        this.$refs.creditcheck.countDown() 
                    })

                } else {
                    this.$refs.creditcheck.hide() 
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.outer-bg {
    background: url('../assets/images/contact-bg.png') no-repeat 0 0 #F8F8F8;
    background-size: contain;
}
.top-out {
    text-align: center;
    padding: px2rem(65) 0;
    .top1 {
        font-size: px2rem(34);
        color: #333;
        font-weight: bold;
    }
}
.cont-out {
    position: relative;
    margin: 0 px2rem(32) px2rem(32);
    border-radius: px2rem(10);
    overflow: hidden;
    background-color: #fff;
}
.cont-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: px2rem(12) px2rem(32) 0;
    background-color: #F8F8F8;
    .cont-btn-tip {
        text-align: center;
        font-size: px2rem(24);
        color: #999;
        margin: px2rem(20) 0;
    }
}
.part {
    position: relative;
    margin-top: 0;
    .addressbtn {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: px2rem(-50);
        padding: px2rem(26) px2rem(50);
        background-color: #fff;
        img {
            width: px2rem(48);
            height: px2rem(48);
        }
    }
    .tip {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: px2rem(-80);
        font-size: px2rem(24);
        padding: 0 px2rem(10);
        background-size: px2rem(20) px2rem(20);
        background-color: #FFEBE5;
        color: #ff3e00;
    }
}
.part .mui-cell {
    font-size: px2rem(30);
}
::v-deep.part .mui-label {
    font-weight: bold;
}
::v-deep.ref-out .mui-cell__bd {
    font-weight: bold;
}
</style>
