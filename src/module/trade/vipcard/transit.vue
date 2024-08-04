<template>
  <div></div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('trade/virtual')

export default {
    created() {
        this.saveVirtualData({
            source: 'vipcard',
            activityIds: [],
            isRefresh: 'n', // 确认页刷新isRefresh值丢失返回上一页
            skuId: this.$route.query.skuId,
            confirm: {
                num: 1
            },
            skus: {
                id: this.$route.query.skuId
            },
            goodstype: 'vipcard',
            rechargeTitle: '招财金卡'
        })
        this.$router.replace({
            name: 'virtualConfirm'
        })
    },
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ])
    }
}
</script>

<style>

</style>