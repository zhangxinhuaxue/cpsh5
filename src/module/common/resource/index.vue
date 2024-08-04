<template>
<div v-if="text" :class="{mt: !text}">
    <div class="source" flex @click="toNext">
        <img v-if="iconUrl" :src="iconUrl" class="icon" alt="" />
        <div class="text">{{text}}</div>
        <div v-if="link" class="next"></div>
    </div>
</div>
</template>
<script>
import { renderDataForBlockType } from 'src/store/api'
export default {
    name: 'resource',
    props: {
        product: {
            type: String,
            required: true,
            default: 'haihua'
        },
        oidBiz: {
            type: String
        }
    },
    data() {
        return {
            iconUrl: '',
            text: '',
            link: ''
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            renderDataForBlockType({
                alias: 'resource',
                blockType: 'extend',
                blockName: 'resourceConfig',
                renderPlatform: aixuedai.isUavoApp == 'y' ? 'app' : 'h5',
                type: '/cms'
            }, (data) => {
                if (data.success && data.result && data.result.objList) {
                    let dataJson = JSON.parse(data.result.objList)
                    dataJson = dataJson && (dataJson[this.oidBiz] || dataJson[this.product])
                    if (dataJson) {
                        this.iconUrl = dataJson.iconUrl
                        this.text = dataJson.text
                        this.link = dataJson.link
                    }
                }
            })
        },
        toNext() {
            if (this.link) {
                window.location.href = this.link
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
.mt{
    margin-top: px2rem(20);
}
.source{
    height: px2rem(74);
    line-height: px2rem(74);
    padding: 0 px2rem(30) 0 px2rem(32);
    font-size: px2rem(26);
    background-color: #FFFADF;
    .icon{
        width: px2rem(30);
        height: px2rem(30);
        background-size: 100% 100%;
        margin-right: px2rem(12);
        margin-top: px2rem(22);
    }
    .text{
        color: #F18800;
        flex: 1;
    }
    .next{
        width: px2rem(10);
        height: px2rem(20);
        @include img2x('./imgs/next');
        background-size: 100% 100%;
        margin-left: px2rem(12);
        margin-top: px2rem(28);
    }
}
</style>
