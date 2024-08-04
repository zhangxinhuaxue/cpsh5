<template>
    <m-page>
        <result-comp
            v-if="status"
            v-bind="activeObj"
            :btnText="status==='locked'?'回到我的客服':'下一步'"
            @click="checkFace"
        />
    </m-page>
</template>
<script>
import { queryAccountStatus } from 'src/store/modules/user/account'
import { AXD } from 'libs/util'
import resultComp from './comp.vue'
import { Button as mButton, Page as mPage } from '@fe/buss-ui'

const statusObj = {
    normal: {
        imgUrl: require('./img/unfreeze.png'),
        title: '当前信用账户状态：正常',
        subTitle: '您可操作信用账户冻结。账户冻结后，无法使用信用分期/借款服务，可正常登陆和还款，添加/删除银行卡，修改登陆/交易密码。',
        desc: '如需冻结，点击下一步进入刷脸认证'
    },
    freeze: {
        imgUrl: require('./img/freeze.png'),
        title: '当前信用账户状态：冻结',
        subTitle: '您可操作信用账户解冻。账户冻结期间，无法使用信用分期/借款服务，可正常登陆和还款，添加/删除银行卡，修改登陆/交易密码。',
        desc: '如需解冻，点击下一步进入刷脸认证'
    },
    locked: {
        imgUrl: require('./img/lock.png'),
        // title: '当前信用账户状态：冻结',
        title: '',
        subTitle:
            '<div style="text-align:left">您暂时无法操作您的信用账户，可能原因为：<br>1、经系统评估，您暂不符合办理条件，信用账户已锁定；<br>2、您没有信用账户;<br>3、您的账户已被人工锁定，不支持您直接解锁！<br>如有疑问，请联系在线客服！</div>',
        desc: ''
    }
}
export default {
    name: 'account-status',

    data() {
        return {
            status: '',
            statusObj: statusObj
        }
    },
    computed: {
        activeObj() {
            return this.statusObj[this.status]
        }
    },
    components: {
        resultComp,
        mButton,
        mPage
    },
    mounted() {
        this.imgUrl = require('./img/freeze.png')
        this.getStatus()
    },
    methods: {
        goIm() {
            axdApp.send({
                module: 'tools',
                method: 'customerService',
                params: {
                    refMerchantId: '',
                    platform: 'app',
                    productId: ''
                }
            })
        },
        getStatus() {
            queryAccountStatus().then(({ success, result, resultDes = '' }) => {
                if (success) {
                    this.status = {
                        normal: 'normal',
                        locked: 'freeze',
                        inoperable: 'locked'
                    }[result.accountStatus]
                } else {
                    this.$_toast(resultDes)
                }
            })
        },
        checkFace() {
            if (this.status === 'locked') {
                this.goIm()
            } else {
                let type = this.status === 'normal' ? 'freeze' : 'unfreeze'
                const resultUrl = `${window.location.origin}/pages/account/result?type=${type}`
                AXD.util.goAuth({
                    backUrl: encodeURIComponent(resultUrl),
                    authItem: 2,
                    channel: 'ac_info'
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .mui-page {
    background-color: #fff;
}

::v-deep .result__image {
    width: px2rem(220);
    height: px2rem(220);
    margin-bottom: px2rem(64);
}
</style>
