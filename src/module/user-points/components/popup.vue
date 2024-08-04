<template>
    <!-- 签到积分弹窗模块 -->
    <section class="pointsPop">
        <div>
            <p>已连续签到{{ data.days }}天</p>
            <p>
                <span>+</span>
                {{ data.score }}
            </p>
            <p>积分</p>
            <div @click="close()">去收积分</div>
            <span @click="close()">
                <m-icon type="close1"></m-icon>
            </span>
        </div>
    </section>
</template>
<script>
import { Icon } from '@fe/buss-ui'
export default {
    components: {
        mIcon: Icon
    },
    props: {
        data: Object
    },
    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss" scoped>
.pointsPop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
    & > div {
        position: fixed;
        top: px2rem(322);
        left: 50%;
        transform: translateX(-50%);
        width: px2rem(530);
        height: px2rem(600);
        background-image: url(../images/pop-bg.png);
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100%;
        color: #fff;
        text-align: center;
        padding-top: px2rem(118);
        p:first-child {
            font-size: px2rem(28);
            line-height: px2rem(36);
            margin-bottom: px2rem(98);
        }
        p:nth-child(2) {
            color: #d87d00;
            font-size: px2rem(72);
            line-height: 1;
            font-family: SUB;
            span {
                position: relative;
                top: px2rem(-10);
                font-size: px2rem(48);
                margin-right: px2rem(4);
            }
        }
        p:last-of-type {
            color: #d87d00;
            font-size: px2rem(24);
            line-height: px2rem(32);
            margin-bottom: px2rem(84);
        }
        div {
            color: #d80202;
            font-size: px2rem(36);
            width: px2rem(296);
            height: px2rem(91);
            background-image: url(../images/pop-btn.png);
            background-repeat: no-repeat;
            background-position: 0 0;
            background-size: 100%;
            line-height: px2rem(94);
            margin: 0 auto;
        }
        & > span {
            position: absolute;
            bottom: px2rem(-106);
            left: 50%;
            transform: translateX(-50%);
            width: px2rem(68);
            height: px2rem(68);
            border: 1px solid #fff;
            border-radius: 50%;
            font-size: px2rem(24);
            line-height: px2rem(80);
        }
    }
}
</style>
