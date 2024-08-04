<!--
 * @Author: sunxj
 * @Date: 2019-09-05 14:03:58
 * @LastEditTime: 2019-09-17 14:24:37
 * @LastEditors: sunxj
 * @Description: footer
 -->
<template>
    <div>
        <footer class="mui-fixedbottom footer_height120">
            <m-button :class="{'disabled': btnDisabld}" @click="submit">{{btnText}}</m-button>
        </footer>
        <creditcheck ref="creditcheck" :creditOrderId="creditOrderId"></creditcheck>
    </div>
</template>

<script>
import { submitBasic } from 'src/store/modules/credit-system'
import { AXD, setLocalStorage, getCookie } from 'src/libs/util'
import creditcheck from '../../common/credit-check.vue'
export default {
    name: 'basicCreditFooter',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        checked: {
            type: Boolean,
            default: false
        },
        cbBackUrl: {
            type: String,
            default: ''
        },
        platform: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            from: this.isApp ? (/android/gi.test(navigator.userAgent) ? 'android' : 'ios') : 'h5',
            isClick: false,
            creditOrderId: ''
        }
    },
    components: {
        creditcheck
    },
    computed: {
        btnDisabld() {
            return this.disabled || this.isClick
        },
        btnText() {
            return this.isClick ? '申请中' : '获得额度'
        }
    },
    methods: {
        submit() {
            if (!this.btnDisabld) {
                 this.log({ type: 'button-logic', name: 'creditSubmit', desc: '基础授信提交按钮' })
                this.isClick = true
                AXD.util.getLocationInfo('基础授信提交',()=>{
                    this.$refs.creditcheck.toStart() 
                }).finally((res) => {
                    this.basicFun(res)
                }) 
            } else if (!this.checked) {
                this.$_toast('请先阅读并同意协议')
            }
           
        },
        basicFun(baiduMac = '{}') {
            let submitData = {
                from: this.from,
                platform: this.platform,
                channel: getCookie('credit-channel'),
                baiduMac,
                mark: this.$route.query.mark
            }
            AXD.util.getPermission('checkContact', '授信判断通讯录权限')
            submitBasic(submitData).then(res => {
                this.isClick = false
                if (res.success) {
                    this.setStorage()
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
        },
        setStorage() {
            if (this.cbBackUrl) {
                setLocalStorage('amountUrl', this.cbBackUrl)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.footer_height120 {
    height: px2rem(120);
    padding-top: px2rem(12);
    box-shadow: 0 -2px 3px #f0f0f0;
    &:before {
        content: none;
    }
    ::v-deep {
        & ~ .mui-content {
            padding-bottom: px2rem(50);
        }
    }
    
}
</style>