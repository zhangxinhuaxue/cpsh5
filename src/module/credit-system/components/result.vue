<!--
    Created dongyusi on 07/2018
-->
<template>
    <div class="res">
        <div class="res-img" :class="config.type"></div>
        <p class="res-title">{{config.msg}}</p>
        <div v-if="config.btnTexts" class="res-btns">
            <m-button v-for="(item, index) in config.btnTexts"
                :type="item.type"
                :key="index"
                class="res-btn"
                @click="goLink(item.link)">{{item.btnText}}
            </m-button>
        </div>
        <m-button v-if="config.btnText" class="res-btn" @click="goLink(config.link)">{{config.btnText}}</m-button>
    </div>
</template>
<script>
import { appDownloadUrl } from 'libs/util'
export default {
    name: 'credit-common-result',
    props: {
        config: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
        }
    },
    methods: {
        goLink(linkUrl) {
            let link = linkUrl || appDownloadUrl
            if (this.isApp && link === appDownloadUrl) {
                axdApp.send({
                    module: 'webview',
                    method: 'close'
                })
                return
            }
            window.location.href = link
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.res {
    text-align: center;
    padding: px2rem(30) 0 px2rem(40);
    background-color: #fff;
    .res-title {
        width: px2rem(600);
        margin: px2rem(20) auto px2rem(48);
        font-size: $auiFontSizeLevel4;
        height: px2rem(72)
    }
}

.res-img {
    width: px2rem(140);
    height: px2rem(140);
    margin: 0 auto;
}

.res-btns {
    display: flex;
    .res-btn {
        margin-top: 0;
        width: px2rem(300);
    }
}

.res-btn {
    width: px2rem(600);
}

.type-pass {
    background: url('../assets/images/pass.png') no-repeat center;
    background-size: 100%;
}
.type-authing {
    background: url('../assets/images/authing.png') no-repeat center;
    background-size: 100%;
}
.type-reject {
    background: url('../assets/images/reject.png') no-repeat center;
    background-size: 100%;
}
.type-close {
    background: url('../assets/images/close.png') no-repeat center;
    background-size: 100%;
}
</style>
