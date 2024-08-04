<template>
<div class="month-picker">
    <div class="month-picker_mask" @click="hidePicker"></div>
    <div class="month-picker_content" :class="{'slideUp':slideUp}">
        <div class="month-picker_header">
            <div class="pointer prew" :class="{'disabled':year <= minYear}" @click="year--"><span class="icon-arrow2"></span></div>
            <span class="year">{{year}}</span>
            <div class="pointer next" :class="{'disabled':year >= maxYear}" @click="year++"><span class="icon-arrow2"></span></div>
        </div>
        <div class="month-picker_body">
            <div class="item" v-for='m in monthList' :key="m"><i :class="{'ac':(m===month && currentYear===year),'disabled':yearWidthMonth.indexOf(m)===-1}" @click="check(m)">{{m}}</i></div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: 'month-picker',
    props: ['config'],
    computed: {
        maxYear() {
            return this.config.rangeList.length > 0 ? ~~this.config.rangeList.slice(-1).toString().substr(0, 4) : new Date().getFullYear()
        },
        minYear() {
            return this.config.rangeList.length > 0 ? ~~this.config.rangeList[0].toString().substr(0, 4) : new Date().getFullYear()
        }
    },
    data() {
        return {
            slideUp: false,
            monthList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            year: ~~this.config.current.toString().substr(0, 4),
            month: this.config.current.toString().substr(-2),
            currentYear: 0,
            list: {},
            yearWidthMonth: []
        }
    },
    created() {

    },
    watch: {
        'year': function(v) {
            this.yearWidthMonth = this.list[v] || []
        },
        'config.current': function(v) {
            this.year = ~~this.config.current.toString().substr(0, 4)
            this.currentYear = this.year
            this.month = this.config.current.toString().substr(-2)
        },
        'config.rangeList': function(v) {
            let list = this.list
            this.config.rangeList.forEach(e => {
                let y = e.toString().substr(0, 4)
                let m = e.toString().substr(-2)
                if (list[y]) {
                    list[y].push(m)
                } else {
                    this.$set(list, y, [m])
                }
            })
            this.yearWidthMonth = list[this.year] || []
        }
    },
    methods: {
        check(m) {
            this.$emit('select', {
                year: this.year,
                month: m
            })
        //     this.month = m
        //     this.currentYear = this.year
        //     let period = this.year.toString() + m
        //     this.$parent[this.config.callBack](period)
        //     this.$parent[this.config.showController] = false
        },
        hidePicker() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/assets/styles/aui-vars.scss';
    @import 'src/assets/styles/rem.scss';
    $designWidth: 750;
    @keyframes pickerDown {
        from {
            top: px2rem(-320);
        }
        to {
            top: 0;
        }
    }

    @-webkit-keyframes pickerDown {
        from {
            top: px2rem(-320);
        }
        to {
            top: 0;
        }
    }

    .month-picker {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        .month-picker_mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(32, 32, 32, 0.6);
        }
        .month-picker_content {
            position: absolute;
            width: 100%;
            top: 0;
            height: px2rem(320);
            animation: pickerDown .5s;
            -webkit-animation: pickerDown .5s;
            background: #fff;
            .month-picker_header {
                height: px2rem(100);
                padding-top: px2rem(40);
                display: -webkit-flex;
                display: flex;
                -webkit-justify-content: center;
                -webkit-align-items: center;
                justify-content: center;
                align-items: center;
                .pointer {
                    width: px2rem(100);
                    height: px2rem(54);
                }
                .pointer span {
                    font-size: px2rem(22);
                    margin: px2rem(15) 0 0;
                    display: block;
                }
                .pointer span::before{
                    color: #666;
                }
                .pointer.next span {
                    float: left;
                }
                .pointer.prew span {
                    transform: rotate(180deg);
                    float: right;
                }
                .pointer.disabled {
                    pointer-events: none;
                }
                .pointer.disabled span::before{
                    color: #ccc;
                }
                .year {
                    width: px2rem(200);
                    text-align: center;
                    font-size: px2rem(36);
                }
            }
            .month-picker_body {
                width: 100%;
                overflow: hidden;
                padding: px2rem(10) px2rem(20) 0;
                .item {
                    width: 16.65%;
                    float: left;
                    text-align: center;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: center;
                    -webkit-align-items: center;
                    justify-content: center;
                    align-items: center;
                    height: px2rem(100);
                    i {
                        font-style: normal;
                        /*border: solid 1px #ccc;*/
                        border-radius: 50%;
                        display: block;
                        width: px2rem(60);
                        height: px2rem(60);
                        line-height: px2rem(60);
                        font-size: px2rem(32);
                    }
                    i.ac {
                        background-color: $auiColorPrimary;
                        color: #fff;
                    }
                    i.disabled {
                        color: $auiTextColorLight;
                        pointer-events: none;
                    }
                    i.ac.disabled {
                        background-color: #fff;
                    }
                }
            }
        }
    }
</style>
