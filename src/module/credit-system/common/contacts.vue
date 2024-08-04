<!--
 * @Author: dongyusi
 * @Date: 2018-07
 * @LastEditTime: 2019-09-04 11:57:44
 * @LastEditors: sunxj
 * @Description: 联系人无权限提示
 -->
<template>
    <m-page v-if="isShow" class="page-out">
        <p class="cell-sub">确保所填信息真实，虚假或错误信息将无法获得额度</p>
        <m-cell-group>
            <m-cell title="与本人关系"
	            :value="relationMap[formData.moduleType1]"
                class="ref-out"
	            is-link
                @click="showActionsheet('moduleType1')">
	        </m-cell>
            <div class="part">
                <m-input
                    title="姓名"
                    v-model="formData.moduleName1"
                    placeholder="请输入联系人姓名">
                </m-input>
                <m-input
                    title="联系方式"
                    type="tel"
                    v-model="formData.moduleTel1"
                    placeholder="请输入联系人联系方式"
                    :maxlength="13">
                </m-input>
                <div class="addressbtn" @click="pickContacts(1)"><img src="../assets/images/contact-icon.png"/></div>
            </div>
        </m-cell-group>
        <m-cell-group>
            <m-cell title="与本人关系"
	            :value="relationMap[formData.moduleType2]"
                class="ref-out"
	            is-link
                @click="showActionsheet('moduleType2')">
	        </m-cell>
            <div class="part">
                <m-input
                    title="姓名"
                    v-model="formData.moduleName2"
                    placeholder="请输入联系人姓名">
                </m-input>
                <m-input
                    title="联系方式"
                    type="tel"
                    v-model="formData.moduleTel2"
                    placeholder="请输入联系人联系方式"
                    :maxlength="13">
                </m-input>
                <div class="addressbtn" @click="pickContacts(2)"><img src="../assets/images/contact-icon.png"/></div>
            </div>
        </m-cell-group>
        <m-button @click="submit" :disabled="disabled">{{btnText}}</m-button>
        <p v-if="isFlow" class="protocol">点击申请额度即代表你同意
            <span @click="goProto">
                {{creditContact.name}}
            </span>
        </p>
        <credit-back-dialog v-if="isFlow"></credit-back-dialog>
    </m-page>
</template>
<script>
import {
    getContacts,
    submitContacts,
    submitBasic
} from 'src/store/modules/credit-system'
import {
    AXD,
    testTelphone,
    getCookie,
    contractPath,
    isAndroid,
    permissionCheckSupport
} from 'src/libs/util'
import creditBackDialog from '../components/back-dialog.vue'
export default {
    name: 'credit-contacts',
    data() {
        let { backUrl, platform = 'aiyoumi', style = 'card', reset } = this.$route.query
        return {
            backUrl,
            platform,
            reset,
            isFlow: style === 'flow',
            isShow: false,
            formData: {
                moduleName1: '',
                moduleName2: '',
                moduleTel1: '',
                moduleTel2: '',
                moduleType1: '',
                moduleType2: ''
            },
            relationMap: {},
            list: ['spouse', 'relatives', 'friend', 'classmate', 'colleague'],
            must: ['spouse', 'relatives'],
            style: '',
            contact: {
                aiyoumi: {
                    name: '《招集令分期服务授信协议》',
                    id: 'CT170913104'
                },
                weidai: {
                    name: '《授信申请书》',
                    id: 'CT190423462'
                }
            },
            contractNum: 'CT190423462',
            // ossKey: '',
            timer: null
        }
    },
    components: {
        creditBackDialog
    },
    computed: {
        creditContact() {
            return this.contact[this.platform]
        },
        disabled() {
            return Object.values(this.formData).some(v => !v)
        },
        btnText() {
            return this.isFlow ? '申请额度' : '完成'
        }
    },
    watch: {
        'formData.moduleTel1': function(val) {
            this.formData.moduleTel1 = this.formatTel(val)
        },
        'formData.moduleTel2': function(val) {
            this.formData.moduleTel2 = this.formatTel(val)
        }
    },
    created() {
        this.getContactsFun()
    },
    methods: {
        getContactsFun() {
            getContacts().then(res => {
                if (res.success) {
                    let result = res.result
                    this.relationMap = result.relationMap
                    if(!this.reset) {
                        Object.keys(this.formData)
                            .filter(k => result[k])
                            .forEach(key => (this.formData[key] = result[key]))
                    }
                    this.isShow = true
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        submit() {
            // 上传通讯录
            // this.uploadDeviceInfo(3)
            let submitObj = Object.assign({}, this.formData, {
                moduleTel1: this.formData.moduleTel1.replace(/( )|(\s+)/g, ''),
                moduleTel2: this.formData.moduleTel2.replace(/( )|(\s+)/g, '')
            })
            if (!this.validate(submitObj)) {
                return
            }
            submitContacts(submitObj).then(res => {
                if (res.success) {
                    this.$_toast({
                        time: 1000,
                        txt: '保存成功',
                        callback: () => {
                            if (this.isFlow) {
                                this.creditSubmit()
                                // window.location.href = this.backUrl
                            } else {
                                if(this.backUrl) {
                                    window.location.href = decodeURIComponent(this.backUrl)
                                } else {
                                    this.$router.go(-1)
                                }
                            }
                        }
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        creditSubmit() {
            AXD.util.getLocationInfo('基础授信联系人提交').finally((ret) => {
                this.basicFun(ret)
            })
        },
        basicFun(baiduMac = '{}') {
            let submitData = {
                from: this.isApp ? (/android/gi.test(navigator.userAgent) ? 'android' : 'ios') : 'h5',
                platform: this.platform,
                channel: getCookie('credit-channel'),
                baiduMac
            }
            AXD.util.getPermission('checkContact', '授信判断通讯录权限')
            submitBasic(submitData).then(res => {
                if (res.success) {
                    let result = res.result
                    this.$router.push({
                        name: 'creditBasicResult',
                        query: {
                            creditOrderId: result.creditOrderId
                        }
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        showActionsheet(moduleType) {
            let another = {
                moduleType1: 'moduleType2',
                moduleType2: 'moduleType1'
            }[moduleType]
            let anotherValue = this.formData[another]
            let showMust = anotherValue && this.must.every(k => k !== anotherValue)
            let list = showMust ? this.must : this.list.filter(k => k !== anotherValue)
            let actionList = list.map(key => this.relationMap[key])
            let that = this
            this.$createActionSheet({
                data: actionList,
                // isBottomBtn: false,
                selectItem: {
                    isSelect: true,
                    index: list.indexOf(that.formData[moduleType])
                },
                onSelect: (item, index) => {
                    that.formData[moduleType] = list[index]
                }
            }).show()
        },
        pickContacts(tab) {
            if (this.isApp) {
                axdApp.send({
                    module: 'tools',
                    repeat: true,
                    method: 'pickContacts',
                    callback: (ret) => {
                        this.log({type: 'button-logic', name: 'credit-contacts-pick', desc: '授信选择联系人'+tab, extendData: JSON.stringify(ret)})
                        // 兼容部分安卓机无法准确获取到联系人信息，返回取消操作
                        if(isAndroid && ret.code === -995) {
                            this.log({type: 'button-logic', name: 'credit-contacts-reject', desc: '授信选择联系人部分安卓机无法准确获取到联系人信息', extendData: JSON.stringify(ret)})
                        } else if (ret.code && ret.code === -994) {
                            this.$_toast('当前未获取到应用通讯录权限，请在设置中打开')
                        } else if (ret.data.phone) {
                            // this.uploadDeviceInfo(tab)
                            let data = ret.data
                            if (!data.name) {
                                this.qxTipsDialog('请先修改联系人姓名，不要使用表情')
                                return
                            }
                            // 去掉所有空白字符
                            let name = data.name.replace(/\s+/g, '')
                            this.formData[`moduleName${tab}`] = name
                            this.formData[`moduleTel${tab}`] = this.formatTel(data.phone.replace(/-|(\+86)|( )|(\s+)/g, ''))
                        } else {
                            this.qxTipsDialog('获取联系人号码失败')
                        }
                    }
                })
            }
        },
        // uploadDeviceInfo(step) {
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
        validate(submitObj) {
            let validateList = [1, 2]
            let testName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,30}$/
            for (let key of validateList) {
                if (!testName.test(this.formData[`moduleName${key}`])) {
                    this.$_toast('姓名至少2个汉字，不含其他字符')
                    return
                }
                if (!testTelphone(submitObj[`moduleTel${key}`])) {
                    this.$_toast('手机号码格式错误')
                    return
                }
            }
            if (submitObj.moduleTel1 === submitObj.moduleTel2) {
                this.$_toast('两位联系人手机号请勿重复')
                return
            }
            return true
        },
        formatTel(val) {
            return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
        },
        goProto() {
            let contractUrl = `${contractPath}${this.creditContact.id}`
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
                window.location.href = contractUrl
            }
        },
        qxTipsDialog(content) {
            this.$createDialog({
                content,
                confirmBtn: '好的'
            }).show()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page-out .mui-cells {
    margin: 0 px2rem(30) px2rem(30);
    border-radius: px2rem(12);
}
.page-out .mui-cells .mui-cell {
    font-size: px2rem(30);
}

.mui-btn {
    margin-top: px2rem(50);
}
.protocol {
    font-size: $auiFontSizeLevel6;
    line-height: px2rem(80);
    padding: 0 px2rem(32);
    color: #222;
    span {
        color: #76d0ff;
    }
}
.part {
    position: relative;
    .addressbtn {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: px2rem(-50);
        padding: px2rem(26);
        background-color: #fff;
        img {
            width: px2rem(48);
            height: px2rem(48);
        }
    }
}
::v-deep.part .mui-label {
    font-weight: bold;
}
::v-deep.ref-out .mui-cell__bd {
    font-weight: bold;
}
</style>
