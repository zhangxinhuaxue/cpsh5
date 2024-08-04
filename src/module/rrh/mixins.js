import { isNeedTel } from 'store/modules/rrh'
export default {
    methods: {
        isNeedTeled() {
            isNeedTel().then((res) => {
                if (res.success && res.result) {
                    this.$router.push({
                        path: '/pages/rrh/relogin',
                        query: {
                            backUrl: window.location.href
                        }
                    })
                }
            })
        }
    }
}
