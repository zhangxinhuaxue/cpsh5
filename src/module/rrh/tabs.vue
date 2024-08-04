<template>
    <!-- 爱又米和召集令tab切换 -->
    <div v-if="show" class="tabs">
        <ul>
            <li><span href="javascript:;" class="on">招集令</span><span @click="goAym">抱米花</span></li>
        </ul>
    </div>
</template>
<script>
import { getTabStatus } from 'store/modules/rrh'
import { isAym } from 'src/libs/util'
const aymDomain = aixuedai.applyTabUrl || 'https://app.aiyoumi.com'
export default {
    name: 'tabs',
    data() {
        return {
            show: false
        }
    },
    created() {
        if(isAym) {
            getTabStatus().then(res => {
                this.show = res.success && res.message === 'y'
            })
        }
    },
    methods: {
        goAym() {
            window.location.href = aymDomain + '/pages/rrh/index'
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.tabs {
    ul {
        margin: 0;
        padding: 0;
        li {
            border-bottom: px2rem(4) solid rgba(255,226,77,1);
            span {
                display: inline-block;
                text-align: center;
                width: px2rem(375);
                height: px2rem(84);
                line-height: px2rem(84);
                background: rgba(248,248,248,1);
                border-radius: px2rem(20) px2rem(20) 0 0;
                font-size: px2rem(32);
                font-family: PingFangSC-Regular,PingFang SC;
                font-weight: 400;
                color:rgba(51,51,51,1);
            }
            span.on {
                background:rgba(255,226,77,1);
            }
        }
    }
}
</style>
