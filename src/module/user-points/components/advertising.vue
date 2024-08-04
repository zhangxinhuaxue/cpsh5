<template>
    <!-- 首页广告位 -->
    <section>
        <full-column :config="item" v-for="(item,index) in list" v-if="list.length" :key="index"></full-column>
    </section>
</template>

<script>
import Vue from 'vue'
import { renderDataCms } from 'src/store/api'
import { AXD } from 'src/libs/util'
import fullColumn from 'src/components/activityModel/fullcolumn.vue'
// 通栏图片组件使用
import lazyload from 'src/libs/lazyload'
Vue.use(lazyload, { transpDefaultImg: true })
export default {
    data() {
        return {
            list: []
        }
    },
    components: {
        fullColumn
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            renderDataCms({
                // alias: window.aixuedai.alias || 'userpoints',
                alias: 'userpoints',
                type: '/cms'
            }).then(({success, result, resultDes}) => {
                if (success && result && result.blocks && result.blocks.length) {
                    this.list = result.blocks
                        .filter(({blockType}) => blockType === 'full_column')
                        .map((item) => {
                            item.objList = JSON.parse(item.objList)
                            item.floorShow = 'n'
                            return item
                        })
                } else {
                    // resultDes && this.$_toast(resultDes)
                }
            })
        }
    }
}
</script>

<style>

</style>
