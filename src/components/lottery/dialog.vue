<template>
    <div class="popup-container" :class="dialogObj.containClass">
        <div class="popup-content">
            <button @click="close" class="btn-close"></button>
            <div>
                <!-- 图片作为背景展示还是作为img标签展示 当dialogObj.containClass为diy时，作为img展示，其他情况是写死的作为背景展示 -->
                <p class="imgtip" v-if="dialogObj.containClass !== 'diy'"></p>
                <p v-else>
                    <img :src="dialogObj.diyImg">
                </p>
                <p class="title">{{dialogObj.title}}</p>
                <p class="desc" v-html="dialogObj.desc"></p>
            </div>
            <div class="btnGroup">
                <span class="popup-btn" v-bind:style="{borderWidth: borderWidth}" v-for="(item, i) in dialogObj.btn" :key="i" v-on:click="item.func">{{item.title}}</span>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            newDesignWidth: 750
        }
    },
    props: ['dialogObj'],
    computed: {
        borderWidth: function() {
            let borderWidth = parseFloat(this._px2rem(2))
            let value = document.getElementsByTagName('html')[0].getAttribute('style').match(/(\d*\.)?\d+/ig, '')
            let fontSize = parseFloat(value[0])
            let resultPx

            if (borderWidth * fontSize < 1) {
                resultPx = '1px'
            } else {
                resultPx = borderWidth + 'rem'
            }

            return resultPx
        }
    },
    methods: {
        // 非转盘内size换算
        _px2rem: function(px) {
            return (px * 320 / this.newDesignWidth / 20) + 'rem'
        },
        // 关闭弹窗
        close() {
            this.$emit('onClose')
        }
    }
}
</script>
<style  lang="scss">
    @import 'src/assets/styles/rem.scss';
    $designWidth: 750;
    @mixin flex(){ 
        display: flex; 
    }
    @mixin flexHori(){
        box-pack: center;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-justify-content: center;
    }
    @mixin flexVert(){
        box-align: center;
        -webkit-box-align: center;
        align-items: center;
        -webkit-align-items: center;
    }

    .popup-container{
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.7);
        @include flex();
        @include flexHori();
        @include flexVert();
    }
    .btn-close {
        width: px2rem(64);
        height: px2rem(64);
        border: none;
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/23182504161.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        margin-left: px2rem(-32) !important;
        bottom: px2rem(-150);
        z-index: 30;
    }
    .popup-content{
        position:relative;
        width: px2rem(574);
        // height: px2rem(600);
        background-repeat: no-repeat;
        background-position: center top;
        background-size: 100% auto;
        border-radius: px2rem(12);
        background: #fff;
        // overflow: hidden;
        .title{
            text-align: center;
            font-size: px2rem(44);
            font-weight: 500;
            color: #333;
            display: block;
            width: 100%;
            margin-top: px2rem(5);
        }
        .desc{
            // position: relative;
            color: #333;
            // left: px2rem(190);
            margin-top: px2rem(25);
            font-size: px2rem(30);
            text-align: center;
            padding: 0 px2rem(20);
        }
        em{
            font-size: px2rem(36);
            color: #ff5237;
            line-height: 133%;
            font-style: normal;
        }
        .fz {
            font-size: px2rem(28);
        }
        .btnGroup{
            margin: px2rem(30) 0;
            text-align: center;
            span{
                display: inline-block;
                width: px2rem(206);
                height: px2rem(66);
                margin-right: px2rem(20);
                border: px2rem(2) solid #4286ff;
                font-size: px2rem(30);
                line-height: px2rem(66);
                text-align: center;
                border-radius: px2rem(4);
                &:first-child {
                    color: #4286ff;
                    background-color: #fff;
                    margin-left: px2rem(20);
                }
                &:last-child{
                    color: #fff;
                    background-color: #4286ff
                }
            }
        }
    }
    .pointsFirst .popup-content .imgtip{
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/24101444343.png') no-repeat center center;
        background-size: px2rem(440) px2rem(116);
        height: px2rem(116) !important;
    }
    .prize .popup-content .imgtip{
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/26102608499.png') no-repeat center center;
        background-size: px2rem(280) px2rem(280);
    }
    .no-prize .popup-content .imgtip{
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/26102610688.png') no-repeat center center;
        background-size: px2rem(280) px2rem(280);
    }
    .points-success .popup-content .imgtip{
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/24103925545.png') no-repeat center center;
        background-size: px2rem(280) px2rem(280);
    }
    .points-fail .popup-content .imgtip{
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/26102609652.png') no-repeat center center;
        background-size: px2rem(280) px2rem(280);
    }
    .popup-content .imgtip {
        height: px2rem(280);
    }
    .prizeBox {
        width: px2rem(518);
        height: px2rem(160);
        background: #f8f8f8;
        border-radius: px2rem(4);
        margin: px2rem(40) px2rem(28) px2rem(40) px2rem(28);
        dt {
            width: px2rem(160);
            height: px2rem(160);
            background: #adccd8;
            border-radius: px2rem(4);
            float: left;
            img {
                display: inline-block;
                text-align: center;
            }
        }
        dd {
            float: left;
            padding-left: px2rem(16);
            .title {
                font-size: px2rem(28);
                font-weight: 400;
                text-align: left;
                color: #666666;
                width: px2rem(342);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                padding: px2rem(5) 0 px2rem(20) 0;
            }
            .price {
                font-size: px2rem(24);
                font-weight: 400;
                text-align: left;
                color: #999999;
                line-height: px2rem(33);
                padding: px2rem(5) 0 0 0;
            }
            .points {
                font-size: px2rem(24);
                font-weight: 400;
                text-align: left;
                color: #666666;
                line-height: px2rem(33);
                padding: 0;
                em {
                    font-size: px2rem(38);
                    font-style: normal;
                    font-weight: 600;
                    text-align: left;
                    color: #ff3e00;
                    line-height: px2rem(53);
                }
            }
        }
    }
</style>
