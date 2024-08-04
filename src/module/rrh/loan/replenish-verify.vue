<template>
    <div class="">
    </div>
</template>

<script>
import { isZjl } from 'src/libs/util'
import loanProductsHandler from '../common/loanProductsHandler'
export default {
    name: 'rrhReplenishVerify',
    mixins: [loanProductsHandler],
    data() {
        const { oidBiz, loanId, bankCardId } = this.$route.query
        return {
            loanId,
            oidBiz,
            bankCardId
        }
    },
    created() {
        // localReplenish引用自mixins['loanProductsHandler'],先判断区域补录，再判断签约
        this.localReplenish({
            oidBiz: this.oidBiz,
            loanId: this.loanId,
            bankCardId: this.bankCardId,
            succCallback: () => {
                this.toPassword()
            }
        }, 'password', 'rrhIndex')
    },
    methods: {
        toPassword() {
            // 召集令取现外放用验证码，召集令APP内部调用用密码
            if (isZjl) {
                this.$router.replace({
                    name: 'commonPwdpage',
                    query: { source: 'rrh', id: this.loanId }
                })
            } else {
                this.$router.replace({
                    name: 'rrhVfCode',
                    query: {
                        key: 'wf',
                        id: this.loanId
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
