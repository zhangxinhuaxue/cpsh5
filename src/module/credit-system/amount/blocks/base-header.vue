<!--
 * @Author: sunxj
 * @Date: 2019-08-01 11:54:57
 * @LastEditTime: 2019-08-08 15:33:55
 * @LastEditors: sunxj
 * @Description: base header
 -->
<template>
    <div class="page-hd">
        <div class="limit-card">
            <p class="limit-title">可用额度</p>
            <p class="limit-money"><span>¥ </span>{{money}}</p>
            <div class="limit-ad" v-show="adList.length > 0">
                <m-tags type="primary"  class="limit-ad-label">{{adLabel}}</m-tags>
                <!-- <span class="limit-ad-label" v-show="adLabel">{{adLabel}}</span> -->
                <credit-marquee ref="marquee" @notice="watchAcroll" class="limit-ad-item">
                    <div v-for="(item, index) in adList"
                        class="limit-ad-marquee"
                        :key="index"
                        @click="onClick(item.url)">
                            {{item.title}}
                    </div>
                </credit-marquee>
                <span>{{adActive}}/{{adList.length}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import creditMarquee from '../../components/marquee.vue'
import { renderDataForBlockType } from 'src/store/api'
import { resetHeader } from '../../common/setHeader'
export default {
    name: 'baseHeader',
    props: {
        money: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            adLabel: '',
            adActive: 0,
            adList: []
        }
    },
    components: {
        creditMarquee
    },
    mounted() {
        this.getAdData()
    },
    methods: {
        getAdData() {
            let params = {
                alias: 'credit_amount',
                blockType: 'extend',
                blockName: 'credit_link',
                renderPlatform: aixuedai.isUavoApp == 'y' ? 'app' : 'h5',
                type: '/cms'
            }
            renderDataForBlockType(params, (data) => {
                if (data.success && data.result && data.result.objList) {
                    let objList = JSON.parse(data.result.objList)
                    // objList = {
                    //     adLabel: '活动',
                    //     adList: [{
                    //         url: 'www',
                    //         title: '开学季抢3期免息券，任意购，到账快巴拉巴拉京津冀'
                    //     }, {
                    //         url: 'www',
                    //         title: '开学季抢3期免息券，任意购，到账快巴拉巴拉京津冀'
                    //     }, {
                    //         url: 'www',
                    //         title: '开学季抢3期免息券，任意购，到账快巴拉巴拉京津冀'
                    //     }, {
                    //         url: 'www',
                    //         title: '开学季抢3期免息券，任意购，到账快巴拉巴拉京津冀'
                    //     }]
                    // }
                    this.adLabel = objList.adLabel
                    this.adList = objList.adList || []
                    if (this.adList.length > 0) {
                        this.$nextTick(() => {
                            this.$refs.marquee.init()
                            this.$refs.marquee.start()
                        })
                    }
                }
            })
        },
        watchAcroll(index) {
            this.adActive = index
        },
        onClick(url) {
            resetHeader(() => {
                window.location.href = url
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page-hd {
    position: relative;
    overflow: hidden;
    &::after {
        display: block;
        position: absolute;
        bottom: px2rem(-10);
        width: 100%;
        height: px2rem(10);
        content: '';
        box-shadow: -6px 0px 22px 2px rgba(199, 200, 221, 0.5);
    }
}
.limit-card {
    margin: px2rem(30) auto 0;
    padding: px2rem(40) px2rem(30) 0;
    width: px2rem(686);
    height: px2rem(298);
    background: url('../../assets/images/card.png') no-repeat center;
    background-size: 100%;
    color: #fff;
}
body.aym {
    .limit-card {
        background-image: url('../../assets/images_old/card.png')
    }
}
.limit-title {
    font-size: $auiFontSizeLevel5;
}
.limit-money {
    font-size: px2rem(64);
    span {
        font-size: px2rem(40);
    }
}
.limit-ad {
    margin-top: px2rem(60);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $auiFontSizeLevel7;
    bottom: 0;
    .limit-ad-label {
        // color: $auiTextColorImportant;
        font-size: px2rem(18);
        // display: inline-block;
        line-height: px2rem(30);
        height: px2rem(30);
        padding: 0 px2rem(10);
        // background-color: #FFE352;
        // border-radius: px2rem(3);
        margin-right: px2rem(10);
    }
    .limit-ad-item {
        flex: 1;
        height: px2rem(33);
        overflow: hidden;
    }
    .limit-ad-marquee {
        overflow: hidden;
        width: px2rem(450);
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>