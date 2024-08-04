<template>
    <div class="info">
        <div v-if="isLogin" class="info_login">
            <div class="info_user">
                <img :src="head" alt="" class="info_head">
                <span @click="go('choose')">{{info.userName}}</span>
                <img v-if="info.authStatus" :src="certified" alt="" class="info_auth">
            </div>
            <div class="info_quota">
                <div class="info_num">
                    <span>可用</span>
                    <span>{{info.creditMoney}}</span>
                    <a :href="jumpUrl" class="info_btn">{{info.btnText}}</a>
                </div>
                <div class="info_sub">当月买下月还</div>
            </div>
            <div class="aui-cells" @click="go('noopen')">
                <a class="aui-cell aui-cell_access" href="javascript:;">
                    <div class="aui-cell__bd">
                        <p>本期账单</p>
                    </div>
                    <div class="aui-cell__ft">
                    </div>
                </a>
            </div>
        </div>
        <div v-else class="info_nologin">
            <div>
                <h1 class="info_h1">登录享新人大礼</h1>
                <a href="javascript:;" class="aui-btn aui-btn_primary" @click="login">登录</a>
            </div>
            <div class="info_right">
                <img :src="bg" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import {
    myAll
} from 'src/store/modules/user'
import { AXD } from 'src/libs/util'

export default {
    name: 'my',
    data() {
        return {
            isLogin: false,
            info: {
                userName: '',
                authStatus: '',
                creditMoney: 0,
                btnText: ''
            },
            jumpUrl: aixuedai.returnUrl,
            bg: require('./img/my-bg.gif'),
            head: require('./img/head.png'),
            certified: require('./img/certified.png')
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            myAll().then((res) => {
                if (res.success) {
                    if (res.result.loginStatus) {
                        this.isLogin = res.result.loginStatus
                        this.info = res.result
                        this.setJumpUrl(res.result.btnJump)
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
                this.$emit('initDone', this.isLogin)
            })
        },
        setJumpUrl(status) {
            this.jumpUrl = {
                authinfo: '/pages/auth/index',
                chsi_verify: `/pages/chsi/index?backUrl=${aixuedai.h5WebUrl}/pages/chsi/jump`
            }[status] || aixuedai.returnUrl
        },
        go(name) {
            this.$router.push({
                name: name
            })
        },
        login() {
            AXD.util.login()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.info_nologin {
    height: px2rem(285);
    background-color: #fff;
    padding: px2rem(65) px2rem(84) 0 px2rem(56);
    display: flex;
    justify-content: space-between;
    .info_h1 {
        margin-top: px2rem(35);
        font-size: px2rem(36);
        font-weight: normal;
        color: #222222;
        letter-spacing: 0;
        line-height: px2rem(36);
    }
    .info_right {
        width: px2rem(174);
    }
    .aui-btn_primary {
        width: px2rem(170);
        height: px2rem(50);
        line-height: px2rem(50);
        font-size: px2rem(30);
        margin: px2rem(30) 0 0;
    }
}

.info_user {
    height: px2rem(88);
    line-height: px2rem(88);
    font-size: $auiFontSizeLevel6;
    display: flex;
    align-items: center;
    padding: 0 px2rem(32);
    .info_head {
        width: px2rem(60);
        margin-right: px2rem(9);
    }
    .info_auth {
        width: px2rem(91.8);
        margin-left: px2rem(8);
    }
}

.info_quota {
    margin: px2rem(17) px2rem(32) 0;
    height: px2rem(250);
    background-image: linear-gradient(193deg, #FFD72D 0%, #FBC108 100%);
    border-top-left-radius: px2rem(12);
    border-top-right-radius: px2rem(12); // background: url(./img/bgc.png) no-repeat center;
    // background-size: 100%;
    padding: 0 px2rem(28);
    color: #fff;
    .info_num {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: px2rem(170);
        padding: px2rem(55) 0 px2rem(45);
        span {
            &:first-child {
                display: inline-block;
                width: $auiFontSizeLevel7;
                font-size: $auiFontSizeLevel7;
                line-height: px2rem(30);
            }
            &:nth-child(2) {
                font-size: px2rem(70);
                line-height: px2rem(70);
                flex-grow: 1;
                margin-left: px2rem(15);
            }
        }
        .info_btn {
            color: $auiTipsColor;
            font-size: $auiFontSizeLevel6;
            height: px2rem(50);
            width: px2rem(160);
            text-align: center;
            line-height: px2rem(50);
            border-radius: px2rem(25);
            background-color: #fff;
            border: 0;
        }
        @include hairline(bottom);
    }
    .info_sub {
        line-height: px2rem(80);
        font-size: $auiFontSizeLevel6;
    }
}

.aui-cells {
    margin-top: 0;
}
</style>
