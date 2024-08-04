<template>
    <div class="tip">
        <i :class="ischeck ? 'icon-agree' : 'icon-disagree'" @click="checkClick" id="agreeConstract"></i>
        <span for="agreeConstract" @click="checkClick">我已认真阅读并同意</span><span class="link" href="javascript:;" @click="viewContract">相关协议</span><span v-if="type === 'one'">及<span class="link" @click="showContractDetail('route_authorization')">《授权申请书》</span></span>
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
    </div>
</template>

<script>
import actionSheets from 'components/actionsheets/index'
import { resetHeader } from 'components/header/resetHeader'
import { queryContractTemplates } from 'store/modules/rrh'
export default {
    props: {
        oidBiz: {
            type: String,
            default: ''
        },
        loanProvider: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        // 服务协议默认不勾选
        ischeck: {
            type:Boolean,
            default: true
        }
    },
    components: {
        actionSheets
    },
    data() {
        return {
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
            return forceList
        },
        // 是否要显示强制阅读的合同
        isShowPop() {
            return !!(this.isShowForceContract && this.forceContract.length)
        }
    },
    methods: {
        checkClick() {
            this.$emit('checkClick')
        },
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
                resetHeader()
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
                    resetHeader()
                    window.location.href = url
                }
            } else {
                this.$_toast('未配置协议')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.tip {
    font-size: px2rem(24);
    color: #A1A1A1;
    padding: px2rem(40) px2rem(32);
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
