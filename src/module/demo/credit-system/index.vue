<template>
    <div>
        <div @click="goCredit('weidai')" style="margin-bottom:20px">card式授信</div>
        <div @click="goCredit('aiyoumi')">flow式授信</div>
    </div>
</template>
<script>
export default {
    name: 'demoCredit',
    methods: {
        goCredit(platform, creditItem = '1') {
            let backUrl = encodeURIComponent(window.location.href)
            let url = `${window.aixuedai.h5WebUrl}/pages/credit-system/amount?creditBackUrl=${backUrl}&platform=${platform}&creditItem=${creditItem}`
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url,
                        isOutSiteUrl: false
                    },
                    callback: function(ret) {}
                })
            } else {
                window.location.href = url
            }
        }
    }
}
</script>
