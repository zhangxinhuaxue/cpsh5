<template>
    <div>
        <div class="hb-dialog2" v-show="config.show">
            <div class="hb-box" :class="{ 'hb-box-show': config.show }">
                <span class="hb-close" @click="closeDialog"></span>
                <!-- 红包盖 -->
                <div class="hb-top"></div>
                <!-- 红包底 -->
                <div class="hb-bg"></div>
                <!-- 领取红包状态 -->
                <div class="hb-status">
                    <p v-text="config.tips"></p>
                </div>
                <img src="//img.aiyoumi.com/null/201601121/115828894/20161121115828.png" class="money1">
                <img src="//img.aiyoumi.com/null/201601121/115944171/20161121115944.png" class="money2">
                <img src="//img.aiyoumi.com/null/201601121/115828894/20161121115828.png" class="money3">
                <img src="//img.aiyoumi.com/null/201601121/115828894/20161121115828.png" class="money4">
                <img src="//img.aiyoumi.com/null/201601121/115944171/20161121115944.png" class="money5">
                <img src="//img.aiyoumi.com/null/201601121/120017440/20161121120017.png" class="colour-bar1">
                <img src="//img.aiyoumi.com/null/201601121/120017440/20161121120017.png" class="colour-bar2">
                <!-- 红包壳 -->
                <div class="hd-shell">
                    <div :class="{'hd-shell__txt':!config.showBtn}">
                        <p v-html="config.prizeTitle"></p>
                    </div>
                    <div class="hb-close-btn" v-if="config.showBtn" @click="handle" v-text="config.btnTxt"></div>
                </div>
            </div>
        </div>
        <div class="hb-mask" v-show="config.show"></div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'coupon-dialog',
    props: {
        config: {
            type: Object,
            required: true,
            default: () => {
                return {
                    show: false,
                    tips: '',
                    prizeTitle: '',
                    prizeUrl: '',
                    btnTxt: '立即使用',
                    showBtn: true
                }
            }
        }
    },
    methods: {
        closeDialog() {
            this.config.show = false
        },
        handle() {
            this.config.show = false
            if (this.config.prizeUrl != '') {
                window.location.href = this.config.prizeUrl
            }
        }
    }
}
</script>
<style lang="scss" scope>
@import './style';
.hb-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
}

$designWidth: 1080;
.hb-dialog2 {
    width: px2rem(614);
    height: px2rem(946);
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: - px2rem(307);
    margin-top: - px2rem(473);
    border-radius: px2rem(10);
    z-index: 9999;
}

.hb-box {
    position: relative;
    width: 100%;
    height: 100%;
    visibility: hidden;
    transition: all .4s linear 1s;
    -webkit-transition: all .4s linear 1s;
    -moz-transition: all .4s linear 1s;
    -webkit-transform: scale(.01, .01);
    -moz-transform: scale(.01, .01);
    .hb-close {
        position: absolute;
        top: px2rem(144);
        right: - px2rem(110);
        display: inline-block;
        width: px2rem(100);
        height: px2rem(100);
        border-radius: 50%;
        background: #fe2d4b url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAtCAYAAADRLVmZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoRJREFUeNrM2r9OGzEcB/ALmVgAqY/QqQ+Qbn0IVJGQQIIKhL+laqWQhpCELm2AlMIToIoRBhbYI3XrkLGPUalioBJJjp8ln2SinO9rn33mJ31Z4j+fO4zBd6R83/eo0pQs5Q3lH+Wa8tt7HvWaMkuZpvyiXFIGHsHTlBv/aQ0oH9lFOc4nbhGLWdPsw0U/vCoO0RWJq8ganPvyqjwzNKvzCVovdxFrrEPZTXBNV/mcsrpjV5eh9P3oqiZwp6uAg1kzQYf3lKFj/Gdg/iG3emLHDyC+ZgFdA9E7QZ/RAXYc4GsqdzoMrrJs9gyg6zroMDjLNoivJ4DeGtdfNvCWRfx+HHQUXAXfUEA3QPSmbBxkok2DeBS9ETUWepc2QHxTMkbTFFoFzrIO4ltj+rZA9DrqUf2hWgPxB0KfAxC9pmLR2cZQ/BceBF1WdejuwWUQj6BXdQxxfuutxsRro+PCWVY08UPe13MFZ1lWxA94H881PMCjtWxizglDx62XltqGl4Gr/6qxxr+5XirtGLtK2xW8bWAfbycNPwRP48jTg8Ok4EcgukRZAvFHtuEouij0KYL4Y1vwjgZaFd8xDUfRC5IxFk3iEfR3A+ggCyD+JC78BEQXFJacEbwJdF5jZyqA+B+q8FOL6CB5EH+KwFMK6JyBv3PmFfCpMHjS6CA5EH8m4sUBzkB01sJjZhX8E3gORM9ZfLCfBfHzIvw2ovGDZXSQOT6XrG7EE9CU5KzRpxQoVwm8uLric/UlbWbYlwDeDWn0QMknhBbxeQm+Kx7dpii9kW/Jf8pbhy9o2dz3I6Yet3op/i6f1SSlRMlQ/lJ+Uv44fo//ivKO8oL/b8EF5Z598CjAAFKty7T0dBnEAAAAAElFTkSuQmCC) no-repeat px2rem(27) px2rem(27);
        background-size: px2rem(46) px2rem(46);
    }
}

.hb-box-show {
    visibility: visible;
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    .hb-status {
        animation: movetop .5s cubic-bezier(0, 0, 0.22, 1.1) .3s forwards;
        -webkit-animation: movetop .5s cubic-bezier(0, 0, 0.22, 1.1) .3s forwards;
        -moz-animation: movetop .5s cubic-bezier(0, 0, 0.22, 1.1) .3s forwards;
        -o-animation: movetop .5s cubic-bezier(0, 0, 0.22, 1.1) .3s forwards;
    }
    .hd-shell {
        p {
            padding: 0 px2rem(50);
            color: rgba(255, 255, 255, 1);
            font-size: px2rem(42)
        }
    }
}

.hb-top {
    background-color: #e8203d;
    height: px2rem(304);
    width: 100%;
    border-top-left-radius: 50% 90%;
    border-top-right-radius: 50% 90%;
    position: absolute;
    top: 0;
    left: 0;
}

.hb-bg {
    background-color: #e8203d;
    width: 100%;
    height: px2rem(646);
    position: absolute;
    bottom: 0;
    left: 0;
}

.hd-shell {
    width: 100%;
    height: px2rem(649);
    background: url(//img.aiyoumi.com/null/201601121/115332620/20161121115332.png) no-repeat 0 0;
    background-size: cover;
    padding-top: px2rem(210);
    position: absolute;
    bottom: 0;
    left: 0;
    p {
        text-align: center;
        color: rgba(255, 255, 255, 0.1);
        font-size: px2rem(46);
        transition: all 1s linear .3s;
        -webkit-transition: all 1s linear .3s;
        -moz-transition: all 1s linear .3s;
        -o-transition: all 1s linear .3s;
    }
    .hb-close-btn {
        margin: 0 auto;
        margin-top: px2rem(47);
        width: px2rem(400);
        height: px2rem(101);
        text-align: center;
        line-height: px2rem(101);
        color: #eb3a54;
        background-color: #ffd34d;
        border-radius: px2rem(55);
        font-size: px2rem(48);
    }
}

.hd-shell__txt {
    padding-top: px2rem(100);
}

.hb-status {
    width: px2rem(384);
    height: px2rem(312);
    background-color: #fff;
    padding: px2rem(15);
    position: absolute;
    top: px2rem(400);
    left: px2rem(116);
    border-radius: px2rem(40);
    -webkit-border-radius: px2rem(40);
    p {
        border-radius: px2rem(40);
        -webkit-border-radius: px2rem(40);
        text-align: center;
        font-size: px2rem(90);
        color: #dea767;
        border: px2rem(2) solid #dea767;
        line-height: px2rem(230);
    }
}

.money1 {
    width: px2rem(78);
    height: px2rem(72);
    position: absolute;
    top: px2rem(395);
    left: - px2rem(95);
    transform: rotateZ(60deg);
    -webkit-transform: rotateZ(60deg);
    -moz-transform: rotateZ(60deg);
}

.money2 {
    width: px2rem(110);
    height: px2rem(114);
    position: absolute;
    top: px2rem(160);
    left: - px2rem(15);
}

.money3 {
    width: px2rem(172);
    height: px2rem(148);
    position: absolute;
    top: px2rem(20);
    left: px2rem(420);
}

.money4 {
    width: px2rem(60);
    height: px2rem(56);
    position: absolute;
    top: - px2rem(12);
    right: - px2rem(88);
    transform: rotateZ(140deg);
    -webkit-transform: rotateZ(140deg);
    -moz-transform: rotateZ(140deg);
}

.money5 {
    width: px2rem(40);
    height: px2rem(40);
    position: absolute;
    top: px2rem(520);
    right: - px2rem(70);
}

.colour-bar1 {
    width: px2rem(145);
    height: px2rem(92);
    position: absolute;
    top: px2rem(86);
    left: - px2rem(180);
}

.colour-bar2 {
    width: px2rem(110);
    height: px2rem(70);
    position: absolute;
    top: px2rem(330);
    right: - px2rem(140);
}

@keyframes movetop {
    from {
        top: px2rem(360);
    }
    to {
        top: px2rem(180);
    }
}

@-webkit-keyframes movetop {
    from {
        top: px2rem(360);
    }
    to {
        top: px2rem(180);
    }
}

@-moz-keyframes movetop {
    from {
        top: px2rem(360);
    }
    to {
        top: px2rem(180);
    }
}

@-o-keyframes movetop {
    from {
        top: px2rem(360);
    }
    to {
        top: px2rem(180);
    }
}
</style>
