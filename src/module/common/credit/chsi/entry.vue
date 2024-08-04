<template>
    <div class="aui-page">
        <div class="aui-content">
            <axd-loading :show="showLoading" :message="message"></axd-loading>
        </div>
    </div>
</template>
<script type="text/javascript">
import {
    getChsiEntry
} from 'src/store/modules/common/credit'
import axdLoading from 'components/loading/index.vue'
import { AXD } from 'libs/util'
export default {
    name: 'chsiResult',
    data() {
        return {
            showLoading: true,
            message: '加载中...'
        }
    },
    components: {
        axdLoading
    },
    beforeRouteLeave(to, from, next) {
        clearTimeout(this.loopDelay)
        next()
    },
    mounted() {
        if (window.sessionStorage.getItem('goChsi') && this.$route.query.way !== '302') {
            window.sessionStorage.removeItem('goChsi')
            setTimeout(() => {
                window.history.back()
            }, 0)
            return
        }
        this.count()
    },
    methods: {
        init() {
            getChsiEntry({
                callbackUrl: this.$route.query.backUrl,
                source: aixuedai.isUavoApp === 'y' ? 'app' : 'h5'
            }).then((res) => {
                if (res.success) {
                    clearTimeout(this.loopDelay)
                    window.sessionStorage.setItem('goChsi', true)
                    this.$nextTick(() => {
                        window.location.href = res.result.url
                    })
                } else {
                    if (res.code === '100201') {
                        this.message = '学信网正在验证中'
                        return
                    }
                    clearTimeout(this.loopDelay)
                    if (res.code === '103') {
                        window.sessionStorage.removeItem('goChsi')
                        AXD.util.login()
                        return
                    }
                    if (res.code === '100202') {
                        this.message = '您已认证学信网'
                        window.location.replace(res.result.url)
                        return
                    }
                    if (res.code === '100203') {
                        this.message = '申请人数过多，请稍后再试'
                        this.$router.replace({
                            name: 'chsiError'
                        })
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        count() {
            this.init()
            this.loopDelay = setTimeout(this.count, 5000)
        }
    }
}
</script>
