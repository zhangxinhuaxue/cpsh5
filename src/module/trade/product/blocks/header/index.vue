<!--
    Created by hity on 05/15/17
-->
<template>
    <hybrid-header :config="barConfig"></hybrid-header>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('trade/product')

export default {
    name: 'product-header',
    data() {
        return {
            barConfig: {
                action: 'switchDialog', // 右侧按钮点击事件， 必须是window变量
                leftAction: 'goBackShengtian',
                h5: {
                    title: '商品详情', // title
                    rightBtnShow: true, // 是否显示右侧按钮
                    icon: '' // 按钮显示ICON，一定要早AUI iconfont里面选  外面的不支持
                },
                app: {
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'IMAGE', // TEXT:文字 IMAGE:图片
                        imageUrl: '' // 图⽚地址
                    }
                },
                imgUrls: [
                    'https://img.aiyoumi.com/null/2017622/175902174/20170622175902_66x66.png?height=66&width=66',
                    'https://img.aiyoumi.com/null/2017622/175946850/20170622175946_66x66.png?height=66&width=66'
                ]
            }
        }
    },
    created() {
        let me = this
        window.switchDialog = function() {
            me.$router.push({
                path: '/pages/cart/list',
                query: me.$route.query
            })
        }
        window.goBackShengtian = function() {
            if (location.search.indexOf('_auth_') !== -1) {
                window.location.replace('http://mall.jiezhansifang.com/index.do')
            } else {
                history.back()
            }
        }
        this.setCartCount(this.cartCount)
    },
    components: {
        hybridHeader
    },
    watch: {
        cartCount(newValue, oldValue) {
            this.setCartCount(newValue)
        }
    },
    computed: {
        ...mapState({
            cartCount: state => state.initData.trade.cartCount,
            trade: state => state.initData.trade,
            defaultData: state => state.defaultData,
            desc: state => state.initData.desc,
            instalment: state => state.initData.instalment,
            firstScreenDone: state => state.interactData.firstScreenDone,
            tradeInteractObj: state => state.interactData.trade,
            productId: state => state.initData.desc.productId
        }),
        cartMoreImg() {
            return 'https://img.aiyoumi.com/null/2017622/175946850/20170622175946_66x66.png?height=66&width=66'
        },
        cartImg() {
            return 'https://img.aiyoumi.com/null/2017622/175902174/20170622175902_66x66.png?height=66&width=66'
        }
    },
    methods: {
        setCartCount(count) {
            if (count > 0) {
                this.barConfig.h5.icon = this.cartMoreImg
                this.barConfig.app.rightBtnInfo.imageUrl = this.cartMoreImg
            } else {
                this.barConfig.h5.icon = this.cartImg
                this.barConfig.app.rightBtnInfo.imageUrl = this.cartImg
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-navbar {
    z-index: 100;

    .icon-shop {
        position: relative;

        .red-dot {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            background-color: #f75257;
            width: px2rem(12);
            height: px2rem(12);
            line-height: 0;
            border-radius: 100%;
            text-align: center;
            font-size: 0;
        }
    }
}
</style>
