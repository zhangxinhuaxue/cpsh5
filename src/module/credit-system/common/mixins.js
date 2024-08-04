/*
 * @Author: sunxj
 * @Date: 2019-07-15 09:59:18
 * @LastEditTime: 2019-12-05 11:28:40
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 */
import { getLocalUrl } from '../common/index'
import { authOrigin } from 'src/libs/domain'
import { resetHeader } from '../common/setHeader'
import { isSupportLocalStorage, getUA } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('credit')
export const amountMixin = {
    methods: {
        goJump(creditItem, authItem) {
            let jumpUrl = `${authOrigin}/views/entry?authItem=${authItem}&backUrl=${this.noticeUrl(creditItem)}&channel=aym_credit`
            resetHeader(() => {
                window.location.href = jumpUrl
            })
        },
        noticeUrl(creditItem) {
            return encodeURIComponent(`${window.location.origin}/pages/credit-system/notice?creditItem=${creditItem}&noticeBack=${getLocalUrl()}`)
        }
    }
}

export const basicCreditMixn = {
    data() {
        return {}
    },
    methods: {
        ...mapActions(['getSuningContractData']),
        goBasicCredit() {
            if (this.isDoContract()) {
                this.handleSuningContract()
                return
            }
            this.$router.replace({
                name: 'creditBasic',
                params: {
                    platform: this.platform
                },
                query: {
                    mark: this.mark
                }
            })
        },
        isDoContract() {
            if (!this.isSuning) {
                return false
            }
            if (!isSupportLocalStorage) {
                return true
            }
            let uid = getUA('uid')
            let data = JSON.parse(localStorage.getItem('suningContractDisabled')) || []
            return !data.some((item) => item.uid && item.uid === uid)
        },
        handleSuningContract() {
            this.getSuningContractData()
                .then((res) => {
                    let list = res.filter((item) => item.forceRead === '0')
                    let contractObj = list[0] || {}
                    this.$router.replace({
                        name: 'creditContract',
                        query: {
                            url: contractObj.viewUrl,
                            name: contractObj.tempName,
                            forceRead: contractObj.forceRead,
                            platform: this.platform,
                            mark: this.mark
                        }
                    })
                })
                .catch((res) => {
                    this.$_errpage({
                        type: 'nothing',
                        message: '数据加载异常，请刷新页面或<br/>退出重新进入',
                        btnText: '刷新',
                        clickFun: function() {
                            if (this.isApp) {
                                axdApp.refresh()
                            } else {
                                window.location.reload()
                            }
                        }
                    })
                })
        }
    }
}
