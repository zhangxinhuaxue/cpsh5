<template>
    <header-cart :config="headerConfig"></header-cart>
</template>
<script>
import headerCart from 'src/components/header/hybridheader.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    name: 'cart',
    data() {
        return {
            headerConfig: {
                action: 'switchEdit', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    title: '购物车', // title
                    rightBtnShow: true, // 是否显示右侧按钮
                    icon: '',
                    text: '编辑' // 按钮显示文案
                },
                app: {
                    leftbuttonVisible: this.$route.query.back === '0' ? false : true,
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#333333', // #ff00000颜色 showType=TEXT
                        text: '编辑' // 展示文字内容 showType=TEXT
                    },
                    rightBtnShow: true
                }
            }
        }
    },
    components: {
        headerCart
    },
    computed: {
        ...mapState({
            isLogin: state => state.isLogin,
            cartCount: state => state.cartCount,
            cartStatus: state => state.cartStatus,
            nullShow: state => state.nullShow,
            canSwitch: state => state.canSwitch,
            switchTip: state => state.switchTip
        })
    },
    watch: {
        cartCount(newVal) {
            if (newVal == 0) {
                this.headerConfig.h5.title = '购物车'
                document.title = '购物车'
            } else {
                this.headerConfig.h5.title = '购物车(' + newVal + ')'
                document.title = '购物车(' + newVal + ')'
            }
        },
        nullShow(newVal) {
            if (newVal) {
                this.headerConfig.h5.rightBtnShow = false
                this.headerConfig.app.rightBtnShow = false
            } else {
                this.headerConfig.h5.rightBtnShow = true
                this.headerConfig.app.rightBtnShow = true
            }
        }
    },
    mounted() {
        // 两种情况 normal：正常展示 edit 编辑状态
        window.switchEdit = () => { // 常规模块&&编辑模块切换
            if (this.cartStatus) {
                this.headerConfig.h5.text = '完成'
                this.headerConfig.app.rightBtnInfo.text = '完成'
                this.cartInit({ cartStatus: false })
            } else {
                if (!this.canSwitch) {
                    this.$_toast(this.switchTip)
                    return
                }
                this.headerConfig.h5.text = '编辑'
                this.headerConfig.app.rightBtnInfo.text = '编辑'
                this.cartInit({
                    cartStatus: true,
                    skuPop: false,
                    footerShow: true
                })
            }
        }
    },
    methods: {
        ...mapMutations(['cartInit'])
    }
}
</script>
