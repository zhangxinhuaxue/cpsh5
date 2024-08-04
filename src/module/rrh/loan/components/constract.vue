<template>
    <div class="tip">
        <i :class="ischeck ? 'icon-agree' : 'icon-disagree'" @click="ischeck = !ischeck" id="agreeConstract"></i>
        <span for="agreeConstract" @click="ischeck = !ischeck">我已认真阅读并同意</span><span class="link" href="javascript:;" @click="viewContract">《借款等相关协议》</span>，
        借款须知<span class="link" @click="showContractDetail('zjl_jktj')">《借款条件、用途限制及逾期条款》</span>
        <template v-if="securityFlag">，<span class="link" @click="showContractDetail(contactUrl)">《{{contactName}}》</span> </template>，
        <span class="link" @click="showContractDetail('Non_student')">《非学生承诺函》</span><span v-if="creditAuthContract.creditAuthContractFlag && creditAuthContract.tempNo" class="link" @click="showContractDetail(creditAuthContract.tempNo)">《个人征信授权书》</span>
        <!-- 用户相关协议 -->
        <action-sheets :isPop="listShow" :list="contractList" @complete="listShow = false">
            <div slot="menu">
                <template v-for="(item, index) in contractList">
                    <a @click="showContractDetail(item.tempNo)" class="aui-actionsheet__cell block_a" :key="index">{{item.tempName}}</a>
                </template>
            </div>
            <div slot="btn">
                <button style="border:none" href="javascript:;" class="aui-actionsheet_default" @click.stop="listShow = false">取消</button>
            </div>
        </action-sheets>
        <!-- 强制阅读协议 -->
        <sn-constract :isShow="isShowPop" :contract="forceContract" @complete="allowedConstract"></sn-constract>
    </div>
</template>

<script>
import actionSheets from 'components/actionsheets/index.vue'
import { resetHeader } from 'components/header/resetHeader'
import { queryContractTemplates } from 'store/modules/rrh'
import snConstract from './snConstract.vue'
export default {
    props: ['securityType', 'securityFlag', 'rrhzx', 'oidBiz', 'loanProvider', 'creditAuthContract', 'secondRiskFlag', 'hubeiTempNo'],
    components: {
        actionSheets,
        snConstract
    },
    data() {
        return {
            // 服务协议默认不勾选
            ischeck: false,
            contactName: '咨询服务合同',
            contactUrl: '',
            contractList: [],
            // 合同模板路径
            relativePath: window.location.hostname.indexOf('app') > -1 ? '/app/user/contract/viewTemplate/' : '/h5/user/contract/viewTemplate/',
            listShow: false,
            isShowForceContract: false
        }
    },
    watch: {
        securityType(n, o) {
            // 根据securityType区别增信费or债务管理费or大秦咨询服务费
            this.contactName =
                n==='ruiyin' ? '债务管理计划标准条款':
                n==='taihe' ? '增信费服务协议' :
                n==='huaqi3' ? '尊享权益相关协议' :
                '咨询服务合同'
            this.contactUrl = this.rrhzx[`${n}Contract`]
        },
        loanProvider(n ,o) {
            n && this.getContract()
        }
    },
    computed: {
        // 需强制阅读的合同
        forceContract() {
            const forceList = this.contractList.filter(item => {
                return item.forceRead === 'Y'
            })
            forceList.forEach(e => {
                e.viewUrl = this.relativePath + e.tempNo
            })
            if(this.secondRiskFlag){
                forceList.push({
                    viewUrl: this.relativePath + this.hubeiTempNo,
                    forceRead: 'Y',
                    tempNo: this.hubeiTempNo,
                    tempName: '湖北消金征信授权书'
                })
            }
            return forceList
        },
        // 是否要显示强制阅读的合同
        isShowPop() {
            return !!(this.isShowForceContract && this.forceContract.length)
        }
    },
    methods: {
        // 查看服务协议
        showContractDetail(name) {
            const url = this.relativePath + name
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: window.location.origin + url,
                        closeToRoot: false
                    },
                    callback() {}
                })
            } else {
                window.location.href = url
            }
        },
        // 获取协议列表
        getContract() {
            queryContractTemplates({
                oidBiz: this.oidBiz,
                loanProvider: this.loanProvider
            }).then(res => {
                if (res.success && res.result) {
                    this.contractList = res.result
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        // 显示协议列表
        viewContract() {
            console.log(this.contractList)
            if (this.contractList.length > 1) {
                this.listShow = true
            } else if (this.contractList.length === 1) {
                const url = this.relativePath + this.contractList[0].viewUrl
                if (this.isApp) {
                    axdApp.send({
                        module: 'navigation',
                        method: 'goURL',
                        params: {
                            url: window.location.origin + url,
                            closeToRoot: false
                        },
                        callback() {}
                    })
                } else {
                    window.location.href = url
                }
            } else {
                this.$_toast('未配置协议')
            }
        },
        allowedConstract() {
            this.isShowForceContract = false
            this.$emit('complete')
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.tip {
    line-height: px2rem(40);
    font-size: px2rem(24);
    color: #A1A1A1;
    padding: px2rem(20) px2rem(10);
    background-color: #F8F8F8;
    label span {
        font-size: px2rem(26);
    }
    .link {
        color: #307EC1;
        // margin: 0 px2rem(12);
    }
}
.icon-agree {
    display: inline-block;
    width: px2rem(24);
    height: px2rem(24);
    @include img2x('../../styles/imgs/checked');
    background-size: 100%;
}
.icon-disagree {
    display: inline-block;
    width: px2rem(24);
    height: px2rem(24);
    @include img2x('../../styles/imgs/dischecked');
    background-size: 100%;
}
body.aym {
    .icon-agree {
        @include img2x('../../styles/imgs_old/checked');
    }
}
.block_a {
    display: block;
}
::v-deep .aui-actionsheet {
    transition: none;
    backface-visibility: visible;
}
</style>
