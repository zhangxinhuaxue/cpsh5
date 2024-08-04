<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <hybrid-header :config="barConfig"></hybrid-header>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import hybridHeader from 'components/header/hybridheader.vue'
const { mapState } = createNamespacedHelpers('shop')
export default {
    name: 'shopHeader',
    // props: {
    //     barReset: {
    //         type: String,
    //         default: ''
    //     }
    // },
    data() {
        return {
            barReset: ''
        }
    },
    activated() {
        this.barReset += '1'
        let shopName = this.shopName || ''
        // let len = 8
        // if (shopName.length > len) {
        //     shopName = shopName.substr(0, len) + '...'
        // }
        shopName = this.limitString(shopName, 16)
        document.title = shopName
    },
    computed: {
        ...mapState({
            shopName: state => state.initShopData.shopName
        }),
        barConfig() {
            let obj = {
                reset: this.barReset,
                action: 'goCart', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    rightBtnShow: true, // 是否显示右侧按钮
                    icon: 'https://img.aiyoumi.com/null/2017622/175902174/20170622175902_66x66.png?height=66&width=66' // 按钮显示ICON，一定要早AUI iconfont里面选  外面的不支持
                },
                app: {
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'IMAGE', // TEXT:文字 IMAGE:图片
                        imageUrl: 'https://img.aiyoumi.com/null/2017622/175902174/20170622175902_66x66.png?height=66&width=66' // 图⽚地址
                    }
                }
            }
            return obj
        }
    },
    created() {
        let me = this
        window.goCart = function() {
            me.$router.push('/pages/cart/list')
        }
    },
    components: {
        hybridHeader
    }
}
</script>
