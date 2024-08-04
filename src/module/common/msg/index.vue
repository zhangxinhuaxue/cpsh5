<template>
    <div class="aui-msg">
        <div class="aui-msg__icon-area">
            <span v-if="config.type=='wait'" class="icon msg__ico_wait"></span>
            <span v-if="config.type=='writing'" class="icon msg__ico_write"></span>
            <span v-if="config.type=='success'" class="icon icon-success"></span>
            <span v-if="config.type=='fail'" class="icon icon-fail"></span>
        </div>
        <div class="aui-msg__text-area">
            <h2 v-if="config.title" class="aui-msg__title" v-html="config.title"></h2>
            <p v-if="config.desc" class="aui-msg__desc" v-html="config.desc"></p>
        </div>
        <slot name="btns"></slot>
        <!-- <div class="aui-msg__opr-area" v-if="config.btns">
            <p class="aui-btn__area-1" v-if="config.btns.subBtn"><a href="javascript:;" class="aui-btn aui-btn_weaken" @click="subClick(config.btns.subData)">{{config.btns.subBtn}}</a></p>
            <p class="aui-btn__area-1" v-if="config.btns.mainBtn"><a href="javascript:;" class="aui-btn aui-btn_primary" @click="mainClick(config.btns.mainData)">{{config.btns.mainBtn}}</a></p>
        </div> -->
    </div>
</template>
<script>
export default {
    name: 'aui-msg',
    props: ['config'],
    methods: {
        // subClick(data) {
        //     this.$emit('subClick', data)
        // },
        // mainClick(data) {
        //     this.$emit('mainClick', data)
        // }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
$designWidth: 750;
.icon-normal:before {
    content: "\e939";
    color: #e4e4e4;
}

.aui-msg {
    text-align: center;
    position: relative;
    background: #fff;
    padding: px2rem(36) px2rem(55);
    .aui-msg__icon-area {
        margin: px2rem(20) auto 0;
        .icon:before {
            font-size: px2rem(120);
        }
    }
    .msg__ico_write {
        width: px2rem(120);
        height: px2rem(120);
        @include img2x( './img/icon_write');
        display: inline-block;
        background-repeat: no-repeat;
        background-size: auto 100%;
        background-position: top center;
    }
    .msg__ico_wait {
        width: px2rem(250);
        height: px2rem(372);
        background: url('./img/icon_wait.gif') no-repeat top center;
        display: inline-block;
        // background-repeat: no-repeat;
        background-size: auto 100%;
        // background-position: top center;
    }

    /*.aui-msg__icon-area.success{
            background-image: url(./icon-success.png);
        }
        .aui-msg__icon-area.danger{
            background-image: url(./icon-danger.png);
        }
        .aui-msg__icon-area.fail{
            background-image: url(./fail@2x.png);
        }*/
    .aui-msg__title {
        padding: px2rem(30) 0 0;
        font-size: $auiFontSizeLevel2;
        font-weight: normal;
    }
    .aui-msg__desc {
        color: $auiTextColorAssistant;
        font-size: $auiFontSizeLevel5;
        padding: 0 px2rem(10);
    }
    .aui-msg__opr-area {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin-top: px2rem(50);
        .aui-btn {
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        @for $i from 1 to 12 {
            .aui-btn__area-#{$i} {
                -webkit-box-flex: $i;
                -webkit-flex: $i;
                flex: $i;
                padding: 0 px2rem(10);
                overflow: hidden;
            }
        }
    }
}
</style>
