<!--
 * @Author: sunxj
 * @Date: 2019-11-27 15:43:54
 * @LastEditTime: 2019-12-18 10:50:14
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 -->
<template>
    <div>
        <template v-for="item in resourceList">
        <group-shadow v-if="item.doShow"
            :key="item.channel"
            class="mt36"
            @click.native="goUrl(item.channel)">
            <p class="channel-title"><span class="channel-title_rec"><i>推荐</i></span><span class="channel-title_text">任性贷取现专享额度</span></p>
            <m-cell-group class="mt0">
                <m-cell autoHeight>
                    <template slot="title">
                        <p class="channel-desc">最高可借额度</p>
                        <p class="channel-amount">50,000</p>
                        <p class="channel-desc">额度大！通过率高！</p>
                    </template>
                    <m-button slot="value" size="xsmall">一键申请</m-button>
                </m-cell>
            </m-cell-group>
        </group-shadow>
        </template>
    </div>
</template>
<script>
import groupShadow from '../../components/group-shadow.vue'
export default {
    name: 'creditResource',
    props: {
        resourceList: Array
    },
    data() {
        let origin = this.isApp ? aixuedai.appUrl : aixuedai.h5WebUrl
        return {
            urlObj: {
                // weidai: `${window.location.origin}/pages/rrh/apply?oidBiz=205001&name=多米贷&mark=te&`
                suning: `${origin}/pages/rrh/apply?oidBiz=205002&name=任性贷&mark=creditbanner`
            }
        }
    },
    components: {
        groupShadow
    },
    methods: {
        goUrl(type) {
            let url = this.urlObj[type]
            window.location.href = url
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt36 {
    margin-top: px2rem(36);
}
.mt0 {
    margin-top: 0;
}
// ::v-deep.mui-btn_primary.mui-btn_small {
//     padding: 0 px2rem(20);
//     width: auto;
// }
.channel-title {
    padding: px2rem(32) px2rem(25) 0;
    font-size: 0;
}
.channel-title_rec {
    display: inline-block;
    width: px2rem(82);
    height: px2rem(30);
    background-color: #FF3E00;
    line-height: px2rem(30);
    font-size: px2rem(22);
    color: #fff;
    text-align: center;
    box-shadow: px2rem(6) px2rem(-6) 0 #ffbaa5;
    transform: skewX(-20deg);
    i {
        display: inline-block;
        font-style: normal;
        transform: skewX(20deg);
    }
}
.channel-title_text {
    font-size: $auiFontSizeLevel2;
    margin-left: px2rem(20);
}
.channel-desc {
    font-size: $auiFontSizeLevel7;
    color: #A1A1A1;
}
.channel-amount{
    font-family: DINAlternate-Bold;
    font-size: px2rem(56);
    font-weight: 700;
}
</style>