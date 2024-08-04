<template>
    <div class="aui-page">
        <password @complete="orderSubmit" @error="goPre"></password>
    </div>
</template>
<script>
import password from 'components/password/index.vue'
import {
    byjReqConfirm, // 嗨花
    qdhReqConfirm, // 借你花
    studentReqConfirm, // 助学金贷款
    miniReqConfirm, // 短贷
    haihuaReqConfirm, // 嗨花 
    primeReqConfirm, // 优资贷
    succReqConfirm // 成功花 优资贷三期
} from 'src/store/modules/loan'

import { rrhReqConfirm } from 'store/modules/rrh' 

import {
    parseQuery
} from 'libs/util'
/* globals location */
export default {
    name: 'pwdpage',
    data() {
        return {
            urlQuery: this.$route.query
        }
    },
    methods: {
        resultPages(res, Routername, sourceObj = '') {
            if (res.success) {
                this.$router.replace({
                    name: Routername,
                    query: { source: sourceObj }
                })
            } else {
                let code = res.code
                if (code === '4109') {
                    window.location.href = res.result
                } else {
                    this.$_toast(res.resultDes)
                }
            }
        },
        goPre() {
            this.$router.go(-1)
        },
        orderSubmit(encryPwd) {
            let params = {
                id: this.urlQuery.id,
                password: encryPwd
            }
            let source = this.urlQuery.source
            // console.log(source)
            typeof this[source + 'Confirm'] === 'function' && this[source + 'Confirm'](params)
        },
        studentConfirm(params) {
            studentReqConfirm({
                orderId: params.id,
                optType: 'confirm'
            }, res => {
                this.resultPages(res, 'studentloan_result', '')
                // if (res.success) {
                //     this.$router.push({ name: 'studentloan_result' })
                // } else {
                //     let code = res.code
                //     if (code === '4109') {
                //         window.location.href = res.result
                //     } else {
                //         this.$_toast(res.resultDes)
                //     }
                // }
            })
        },
        jnhConfirm(params) {
            qdhReqConfirm({
                loanId: params.id,
                password: params.password
            }).then(res => {
                if (res.success) {
                    this.$router.replace({
                        name: 'loanResult',
                        params: {
                            tradeId: params.id
                        }
                    })
                } else {
                    let code = res.code
                    if (code === '4109') {
                        window.location.href = res.result
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        },
        byjConfirm(params) {
            byjReqConfirm({
                loanId: params.id,
                payPassWd: params.password
            }).then(res => {
                if (res.success) {
                    window.location.href = '/app/graLoan/result.html'
                } else {
                    let code = res.code
                    if (code === '4209' || code === '4208') {
                        window.location.href = res.result
                        return
                    }
                    if (code === '20703' || code === '1061') {
                        window.location.href = '/app/graLoan/result.html'
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        miniloanConfirm(params) {
            miniReqConfirm({
                loanId: params.id,
                payPassWd: params.password
            }).then(res => {
                if (res.success) {
                    this.resultPages(res, 'miniloan_result', 'miniloan')
                } else {
                    let code = res.code
                    if (code === '4209' || code === '4208') {
                        window.location.href = res.result
                        return
                    }
                    if (code === '20703' || code === '1061') {
                        this.resultPages(res, 'miniloan_result', 'miniloan')
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        haihuaConfirm(params) {
            haihuaReqConfirm({
                loanId: params.id,
                password: params.password
            }).then(res => {
                if (res.success) {
                    this.resultPages(res, 'Haihua-result', 'haihua')
                } else {
                    // debugger
                    let code = res.code
                    if (code === '4209') {
                        window.location.href = res.result
                        return
                    }
                    if (code === '20703' || code === '1061' || code === '4208') {
                        this.resultPages({success: true}, 'Haihua-result', 'haihua')
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        rrhConfirm(params) {
            rrhReqConfirm({
                loanId: params.id,
                password: params.password
            }).then(res => {
                if (res.success) {
                    if (res.result.isCycle) {
                        this.$router.replace(`/pages/rrh/authone?cycleId=${res.result.cycleId}&type=first`)
                    } else {
                        this.$router.replace({
                            name: 'rrhResult',
                            query: {
                                loanId: params.id,
                                type: 'default'
                            }
                        })
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        primeConfirm(params) {
            primeReqConfirm({
                loanId: params.id,
                password: params.password
            }).then(res => {
                if (res.success) {
                    this.resultPages(res, 'prime-result', 'prime-activity')
                } else {
                    // debugger
                    let code = res.code
                    if (code === '4209') {
                        window.location.href = res.result
                        return
                    }
                    if (code === '20703' || code === '1061' || code === '4208') {
                        this.resultPages({success: true}, 'prime-result', 'prime-activity')
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        succConfirm(params) {
            succReqConfirm({
                loanId: params.id,
                password: params.password
            }).then(res => {
                if (res.success) {
                    this.resultPages(res, 'succ-result', 'succ-activity')
                } else {
                    // debugger
                    let code = res.code
                    if (code === '4209') {
                        window.location.href = res.result
                        return
                    }
                    if (code === '20703' || code === '1061' || code === '4208') {
                        this.resultPages({success: true}, 'succ-result', 'succ-activity')
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        }
    },
    components: {
        password
    }
}
</script>
<style lang="scss">
body {
    background: #f3f3f3;
    width: 16rem;
    margin: 0 auto;
}
</style>
