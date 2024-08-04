<template>
    <a v-if="barImg" :href="barUrl" style="display: block;">
        <axd-image :src="barImg" lazy="'false'"></axd-image>
    </a>
</template>
<script>
import { renderDataForBlockType } from 'src/store/api'
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'virBanner',
    data() {
        return {
            barImg: '',
            barUrl: '',
            config: true
        }
    },
    beforeMount() {
        this.getBanner()
    },
    methods: {
        getBanner() {
            let param = {
                alias: 'virtual_list_banner',
                blockType: 'full_column',
                blockName: 'banner',
                renderPlatform: this.App ? 'app' : 'h5',
                type: '/cms'
            }

            renderDataForBlockType(param, (res) => {
                if (res.success && res.result && res.result.objListArray) {
                    let banList = res.result.objListArray
                    this.barImg = banList[0].img
                    this.barUrl = banList[0].url
                }
            })
        }
    },
    components: {
        axdImage
    }
}
</script>
