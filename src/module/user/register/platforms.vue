<template>
    <div style="position:relative" :style="{ backgroundColor:boxBgColor}">
        <axd-image v-if="imgSrc" :src="imgSrc" :lazy="false"></axd-image>
        <a class="platforms__link" :href="ruleUrl" :style="{color:ruleColor}">
            活动规则>
        </a>
    </div>
</template>
<script>
import axdImage from 'components/image/index.vue'

import {
    renderData
} from 'src/store/api'
export default {
    name: 'platforms',
    // props: ['configData'],
    computed: {

    },
    data() {
        return {
            routeQuery: this.$route.query,
            boxBgColor: '#fff',
            imgSrc: null,
            ruleUrl: null,
            ruleColor: '#222'
        }
    },
    components: {
        axdImage
    },
    created() {
        this.initPlatforms()
    },
    methods: {
        initPlatforms() {
            renderData({
                alias: 'register_h5_' + this.routeQuery.platforms
            }, res => {
                if (res.success) {
                    for (let item of res.result.blocks) {
                        if (item.blockType === 'primary_kv') {
                            this.imgSrc = item.img
                            this.boxBgColor = '#' + item.bgColor
                        } else if (item.blockType === 'activity_rule') {
                            this.ruleUrl = item.contentTxt
                            this.ruleColor = '#' + item.nameColor
                        }
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.platforms__link {
    font-size: .5rem;
    position: absolute;
    right: .8rem;
    bottom: .7rem;
    text-decoration: underline;
}
</style>
