<template>
<div :data-name="config.title" :class="classObj" v-if='all_show'>
    <img :src="config.img" v-if="config.img"/>
    <div :class="{ 'tab-container': tab_show }">
        <div class="tab-btn" v-if="tab_show">
            <span v-on:click="chooseFn" :class="[selected? 'selected':'']" :style="style4span">{{tabList[0].tabText}}</span>
            <span v-on:click="chooseFn_1" :class="[!selected? 'selected':'']" :style="style4span_1">{{tabList[1].tabText}}</span>
        </div>
        <ul :class="{ 'tab-box': tab_show }" v-show="selected" v-if="tab_0_show" :style="{backgroundColor: '#' + config.bgSelectedColor}">
            <li v-if="pro.status=='y'" v-for="pro in tabList[0].productList">
                <axd-seckillpro :pro="pro" :tabInfo="tabList[0]" :sysTime="systemTime" v-if="sys"></axd-seckillpro>
            </li>
        </ul>
        <ul :class="{ 'tab-box': tab_show }" v-show='!selected' v-if="tab_1_show" :style="{backgroundColor: '#' + config.bgSelectedColor}">
            <li v-if="pro.status=='y'" v-for="pro in tomorrowTab.productList">
                <axd-tomorrow :pro="pro" :tabInfo="tomorrowTab"></axd-tomorrow>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
    import tomorrow from './tomorrow.vue'
    import seckillpro from './seckillPro.vue'
    import {formatColor} from 'src/libs/util'
    import { _get, formatRet } from 'src/store/base'
    export default {
        data() {
            return {
                sysTimeUrl: (window.aixuedai.isUavoApp === 'y') ? '/app/common/getNow' : '/common/getNow',
                systemTime: '',
                sys: false,
                all_show: true,
                tab_show: false,
                tab_0_show: false,
                tab_1_show: false,
                selected: true,
                selected_1: false,
                style4span: {},
                style4span_1: {},
                tomorrowTab: {},
                no1: false,
                no2: false
            }
        },
        props: {
            config: Object,
            tabList: Array
        },
        computed: {
            classObj() {
                return {
                    'seckill': true,
                    'floor': this.config.floorShow && this.config.floorShow === 'y'
                }
            }
        },
        components: {
            'axd-seckillpro': seckillpro,
            'axd-tomorrow': tomorrow
        },
        mounted: function() {
            _get(this.sysTimeUrl, {}, (data) => {
                data = formatRet(data, this.sysTimeUrl)
                if (data.success && data.result && data.result !== '') {
                    this.systemTime = data.result
                    // console.log(this.systemTime);
                    this.sys = true
                } else {
                    this.all_show = false
                }
            })
            if (this.tabList.length === 2) {
                if (this.tabList[0].showtab === 'y' && this.tabList[0].productList && this.tabList[0].productList.length > 0) {
                    this.no1 = true
                }
                if (this.tabList[0].showtab === 'y' && this.tabList[0].productList && this.tabList[0].productList.length === 0) {
                    this.no1 = false
                }
                if (this.tabList[0].showtab === 'n') {
                    this.no1 = false
                }
                if (this.tabList[1].showtab === 'y' && this.tabList[1].productList && this.tabList[1].productList.length > 0) {
                    this.no2 = true
                }
                if (this.tabList[1].showtab === 'y' && this.tabList[1].productList && this.tabList[1].productList.length === 0) {
                    this.no2 = false
                }
                if (this.tabList[1].showtab === 'n') {
                    this.no2 = false
                }
                this.tomorrowTab = this.tabList[1]
                this.style4span_1 = {
                    'background-color': formatColor(this.config.bgColor),
                    'color': formatColor(this.tabList[1].tabTextColor)
                }
                this.style4span = {
                    'background-color': formatColor(this.config.bgSelectedColor),
                    'color': formatColor(this.tabList[0].tabTextColor)
                }
                // 信息全部正确
                if (this.no1 && this.no2) {
                    this.tab_show = true
                    this.tab_1_show = true
                    this.tab_0_show = true
                }
                // 第一个显示，第二个不显示
                if (this.no1 && this.no2 === false) {
                    this.tab_0_show = true
                    this.selected = true
                }
                // 第一个不显示，第二个显示
                if (this.no1 === false && this.no2) {
                    this.tab_1_show = true
                    this.selected = false
                }
                // 全部不展示
                if (this.no1 === false && this.no2 === false) {
                    this.all_show = false
                }
            } else if (this.tabList.length === 1) {
                if (this.tabList[0].tabId === '1') {
                    this.tab_0_show = true
                    this.tab_1_show = false
                } else {
                    this.tomorrowTab = this.tabList[0]
                    this.tab_0_show = false
                    this.tab_1_show = true
                    this.selected = false
                }
            } else if (this.tabList.length === 0) {
                this.all_show = false
            }
        },
        methods: {
            chooseFn() {
                this.selected = true
                this.selected_1 = false
                this.style4span = {
                    'background-color': formatColor(this.config.bgSelectedColor),
                    'color': formatColor(this.tabList[0].tabTextColor)
                }
                this.style4span_1 = {
                    'background-color': formatColor(this.config.bgColor),
                    'color': formatColor(this.tabList[0].tabTextColor)
                }
            },
            chooseFn_1() {
                this.selected = false
                this.selected_1 = true
                this.style4span = {
                    'background-color': formatColor(this.config.bgColor),
                    'color': formatColor(this.tabList[0].tabTextColor)
                }
                this.style4span_1 = {
                    'background-color': formatColor(this.config.bgSelectedColor),
                    'color': formatColor(this.tabList[1].tabTextColor)
                }
            }
        }
    }
</script>

<style lang="scss">
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
.seckill {
    * {
        font-size: px2rem(24);
    }
    &>div.tab-container{
        position:relative;
        z-index: 2;
        margin-top: px2rem(-14);
    }
    ul {
        padding: px2rem(10);
        li {
            position: relative;
            background-color: #fff;
            height: px2rem(320);
            padding: px2rem(64) px2rem(5) px2rem(5);
            overflow: hidden;
            box-shadow: 0 0 px2rem(3) rgba(0, 0, 0, .5);
            margin-bottom: px2rem(10);
            background-color: #fff;
            &:last-child{
                margin-bottom: 0;
            }
            .time-tip {
                position: absolute;
                top: px2rem(-40);
                left: 0;
                right: 0;
                margin: 0 auto;
                width: px2rem(346);
                height: px2rem(80);
                padding-top: px2rem(40);
                line-height: px2rem(40);
                text-align: center;
                border-radius: px2rem(40);
                i {
                    font-style: normal;
                }
            }
            .content {
                overflow: hidden;
                .img-wid {
                    position: relative;
                    float: left;
                    width: px2rem(250);
                    height: px2rem(250);
                    overflow: hidden;
                    img {
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        margin: auto;
                        width: 100%;
                    }
                }
                .infos {
                    float: left;
                    width: px2rem(360);
                    padding: px2rem(5) px2rem(10);
                    h3 {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        height: px2rem(60);
                        line-height: px2rem(30);
                        color: #222;
                    }
                    .price {
                        height: px2rem(66);
                        margin-top: px2rem(10);
                        overflow: hidden;
                        span {
                            float: left;
                            margin-left: px2rem(5);
                        }
                        .s1 {
                            margin-top: px2rem(12);
                            line-height: px2rem(32);
                            width: px2rem(78);
                            border: 1px solid #222;
                            border-radius: 5px;
                            text-align: center;
                            font-size: px2rem(20);
                        }
                        .s2 {
                            i {
                                font-size: px2rem(22);
                                font-style: normal;
                            }
                            font-size: px2rem(36);
                            line-height: px2rem(66);
                        }
                        .s3 {
                            i {
                                font-size: px2rem(20);
                                font-style: normal;
                            }
                            font-size: px2rem(20);
                            line-height: px2rem(66);
                        }
                    }
                    .origin-price {
                        line-height: px2rem(50);
                    }
                    .buy-btn {
                        width: px2rem(200);
                        line-height: px2rem(50);
                        text-align: center;
                        border-radius: 2px;
                        background-color: #ccc;
                        margin: 0 auto;
                    }
                }
            }
        }
    }
    .tab-container {
        .tab-btn {
            display: -webkit-box;
            -webkit-box-align: end;
            overflow: hidden;
            span {
                display: block;
                -webkit-box-flex:1;
                text-align: center;
                height: px2rem(62);
                line-height: px2rem(62);
                &.selected {
                    height: px2rem(74);
                    line-height: px2rem(74);
                    font-size: px2rem(30);
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                }
            }
        }
    }
}
</style>
