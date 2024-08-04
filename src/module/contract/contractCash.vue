<template>
    <div class="page_contract__cash">
        <p class="title">{{title}}</p>
        <div class="aui-cells" v-for="(item, index) in contractGroups" :key="index" :group="item">
            <template v-for="(contract, idx) in contractList[item]">
                <a class="aui-cell aui-cell_access" :key="idx" :href="formateUrl(contract)" >
                    <div class="aui-cell__bd">
                        <p>{{contract.title}}</p>
                    </div>
                    <div class="aui-cell__ft">
                    </div>
                </a>
            </template>
        </div>
    </div>
</template>
<script>
// renderDataForBlockType
import { renderData } from 'src/store/modules/loan'
export default {
    name: 'cashContract',
    data() {
        return {
            title: '',
            contractList: {},
            isAppDomain: location.hostname.indexOf('app') > -1
        }
    },
    computed: {
        contractGroups() {
            return Object.keys(this.contractList || {}).sort()
        },
        relativePath() {
            return this.isAppDomain ? '/app/user/contract/viewTemplate/' : '/h5/user/contract/viewTemplate/'
        }
    },
    components: {

    },
    created() {
        this.init()
    },
    methods: {
        init() {
            let alias = this.$route.query.alias || 'default'
            alias = alias === 'default' ? 'config_cashcontract' : alias

            let params = {
                alias,
                // blockType: 'extend',
                // blockName: 'datalist',
                renderPlatform: this.isApp ? 'app' : 'h5',
                type: '/cms'
            }
            // renderDataForBlockType()
            renderData(params).then(({ success, resultDes, result = {} }) => {
                if (success) {
                    let { blocks = [], template = {} } = result
                    if (blocks.length && blocks[0].title === 'datalist') {
                        let resJson = JSON.parse(blocks[0].objList)
                        this.contractList = resJson.contractList
                        this.title = resJson.title
                        document.title = template.title
                    }
                } else {
                    this.$_toast({
                        txt: resultDes,
                        callback: () => {
                            window.history.go(-1)
                        }
                    })
                }
            })
        },
        formateUrl(item) {
            if (item.isOutLink) {
                return item.url
            } else {
                return this.relativePath + item.url
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.page_contract__cash {
    background-color: #f7f7f7;

    .title {
        font-size: px2rem(24);
        color: #999999;
        padding: px2rem(30) px2rem(32) 0;
    }
}
</style>
