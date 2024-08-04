<template>
    <m-page>
        <result-comp
            v-if="result"
            v-bind="activeObj"
            :btnText="isSuccess?'回到首页':'回到我的客服'"
            @click="goPage"
        />
    </m-page>
</template>
<script>
import { toggleUserAccount } from 'src/store/modules/user/account'
import resultComp from './comp.vue'
import { Page as mPage } from '@fe/buss-ui'
import { AXD } from 'libs/util'

const freeze = {
    success: {
        imgUrl: require('./img/success.png'),
        title: '冻结成功',
        subTitle: '',
        desc:
            '您的信用账户已冻结，账户冻结期间，无法使用信用分期/借款服务，可正常登陆和还款，添加/删除银行卡，修改登陆/交易密码。如需解冻请联系我的客服!'
    },
    fail: {
        imgUrl: require('./img/fail.png'),
        title: '处理失败',
        subTitle: '',
        desc: '操作失败了，请联系人工客服处理。'
    }
}
const unfreeze = {
    success: {
        imgUrl: require('./img/success.png'),
        title: '解冻成功',
        subTitle: '',
        desc: '您的信用账户已解冻，可正常使用信用分期服务啦!'
    },
    fail: {
        imgUrl: require('./img/fail.png'),
        title: '处理失败',
        subTitle: '',
        desc: '操作失败了，请联系人工客服处理。'
    }
}

export default {
    name: 'account-result',

    data() {
        return {
            result: '',
            type: this.$route.query.type
        }
    },
    computed: {
        obj() {
            return {
                freeze,
                unfreeze
            }
        },
        activeObj() {
            // let str = `${this.type}${this.result}`
            return this.obj[this.type][this.result]
        },
        isSuccess() {
            return this.result === 'success'
        }
    },
    components: {
        resultComp,
        mPage
    },
    created() {
        let { type: operateType, authOrderId } = this.$route.query
        if (!authOrderId) {
            this.result = 'fail'
            return
        }
        toggleUserAccount({
            authOrderId,
            operateType
        }).then(({ success, result }) => {
            if (!success) {
                this.result = 'fail'
                return
            }
            this.result = result.code
        })
    },
    methods: {
        goPage() {
            // 回到首页或客服
            if (this.isSuccess) {
                this.goHome()
            } else {
                this.goIm()
            }
        },
        goHome() {
            axdApp.send({
                module: 'navigation',
                method: 'goPage',
                params: {
                    page: 'root', // 原生页面标识
                    loginFirst: false, // 是否需要先登录再跳转
                    closeToRoot: true, // 返回（或者关闭）至首页
                    rootPage: 0, // 当需要返回至首页时标识具体的首页页面 0:商城首页 1:专题 3:取现 4:我的
                    rootPageTab: 0 // 当rootPage=0时可指定rootPageTab，使跳转顶部某个tab页
                }
            })
        },
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
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .mui-page {
    background-color: #fff;
}

::v-deep .result__image {
    width: px2rem(140);
    height: px2rem(140);
    margin-bottom: px2rem(24);
}
</style>
