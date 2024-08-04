<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <!-- 主视图 -->
            <user-info :userInfo="userInfoObj" @complete="complete"></user-info>
        </div>
        <!-- 解绑验证码弹窗 -->
        <m-dialog ref="smsDialog"
            title="验证码"
            confirmBtn="好的"
            type="confirm"
            :closeOnConfirm="false"
            @confirm="unBindCard">
            <p class="dialog_tip_context">已向手机号{{userInfoObj.phoneNum | PhoneReplace}}发送验证码</p>
            <p class="dialog_content">
                <input type="tel" v-model="smsCode" class="msg_code" maxlength="6" placeholder="请输入短信验证码">
            </p>
        </m-dialog>
        <!-- 引导下载App弹窗 -->
        <!-- <axd-dialog :showDialog="showDownloadDialog" class="updateNum_dialog" :dialogInfo="dialogInfo2" @mainClick="downLoadApp" @subClick="showDownloadDialog = false">
            <template slot="content">
                您可下载招集令App开通信用钱包获得信用额度
            </template>
        </axd-dialog> -->
        <m-dialog ref="DownloadDialog"
            title="验证码"
            confirmBtn="下载App"
            cancelBtn="继续绑卡"
            type="confirm"
            @confirm="downLoadApp">
            您可下载招集令App开通信用钱包获得信用额度
        </m-dialog>
        <!-- 子路由 -->
        <transition name="router-slide">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>
<script>
import {
    getBindCardUserInfo,
    sendLianLianCode,
    unBindCardApp,
    unBindCardH5
} from 'store/modules/bankbind/bank'
import userInfo from './userinfo.vue'
import { AXD, PhoneReplace } from 'src/libs/util'
export default {
    name: 'add',
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            userInfoObj: {
                userName: '',
                userID: '',
                phoneNum: '',
                cardCode: ''
            },
            smsCode: ''
            // 解绑验证码弹窗信息
            // showSmsDialog: false,
            // dialogInfo: {
            //     title: '验证码',
            //     btn: '好的',
            //     subBtn: '取消',
            //     singleBtn: false
            // },
            // 引导下载App弹窗信息
            // showDownloadDialog: false,
            // dialogInfo2: {
            //     btn: '下载App',
            //     subBtn: '继续绑卡',
            //     singleBtn: false
            // }
        }
    },
    filters: {
        PhoneReplace
    },
    computed: {
    },
    components: {
        userInfo
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let toUrl = AXD.util.getUrlParam('toUrl') || ''
            getBindCardUserInfo({
                toUrl
            }).then((res) => {
                if (res.success) {
                    this.userInfoObj.userName = res.result.realname
                    this.userInfoObj.userID = res.result.identifyCard
                    this.userInfoObj.phoneNum = res.result.telphone
                }
            })
        },
        complete(data) {
            this.log({type: 'button', name: 'bankcard-button-next', desc: '完成'})
            // 开始绑卡
            sendLianLianCode({
                source: '9',
                telephone: data.phoneNum,
                bankcardNo: data.cardCode
            }).then((res) => {
                if (res.success) {
                    let token = res.result
                    let telNum = data.phoneNum
                    let bankcardNo = data.cardCode
                    this.$router.push({
                        name: 'smsCheck',
                        params: {
                            token: token,
                            telNum: telNum,
                            bankcardNo: bankcardNo
                        }
                    })
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else if (res.code == '1114') { // 解绑卡，延迟等待弹窗关闭后显示验证码输入dialog
                        this.$_toast('请先校验原预留手机号')
                        setTimeout(() => {
                            this.smsCode = ''
                            this.$refs.smsDialog.show()
                            // this.showSmsDialog = true
                        }, 2030)
                    } else if (res.code == '1042') { // 引导下载APP
                        if (aixuedai.isUavoApp === 'n') {
                            this.$refs.DownloadDialog.show()
                            // this.showDownloadDialog = true
                        } else {
                            this.$_toast(res.resultDes)
                        }
                    } else if (res.code == '20905') {
                        this.$_toast('抱歉，该银行暂不支持绑卡，详情请查看“支持银行列表”')
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        },
        unBindCard() {
            if (!this.smsCode) {
                this.$_toast('验证码不可为空')
                return
            }
            let requestUrl = aixuedai.isUavoApp == 'y' ? unBindCardApp : unBindCardH5
            // this.showSmsDialog = false
            this.$refs.smsDialog.hide()
            requestUrl({
                verifyCode: this.smsCode
            }).then((res) => {
                if (res.success) {
                    this.$_toast(res.resultDes || '解绑成功，请继续绑卡剩余操作')
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        downLoadApp() {
            window.location.href = aixuedai.appDownloadUrl
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.dialog_tip_context {
    height: px2rem(60);
    line-height: px2rem(60);
    font-size: px2rem(32);
}
.dialog_content {
    width: px2rem(500);
    margin: 0 auto;
    border-bottom: 1px solid #d7d7d7;
    .msg_code {
        font-size: px2rem(28);
        display: inline-block;
        height: px2rem(100);
        width: 100%;
        line-height: px2rem(100);
        border: none;
        text-align: center;
    }
}

// .updateNum_dialog {
//     .dialog_tip_context {
//         height: px2rem(60);
//         line-height: px2rem(60);
//         font-size: px2rem(32);
//     }
//     .dialog_content {
//         width: px2rem(500);
//         margin: 0 auto;
//         border-bottom: 1px solid #d7d7d7;
//         .msg_code {
//             font-size: px2rem(28);
//             display: inline-block;
//             height: px2rem(100);
//             width: 100%;
//             line-height: px2rem(100);
//             border: none;
//             text-align: center;
//         }
//     }
// }
</style>
