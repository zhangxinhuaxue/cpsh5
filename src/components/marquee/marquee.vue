<!--
    Created by wusong on 28/07/18
-->
<template>
    <div class="marquee" :style="{height:boxHeight +'px'}">
        <ul :style="ulStyle">
            <slot>
                <li class="marquee-item" v-for="item in listData">
                    <p>{{item}}</p>
                </li>
            </slot>
        </ul>
    </div>
</template>
<script>
import Vue from 'vue'
/*
    @param list          {Array}  滚动列表数据
    @param showItemCount {Number} 显示条数
    @param step          {Number} 每次滚动条数
    @param delay         {Number} 滚动间隔时间, 毫秒数
    @param during        {Number} 动画时间, 毫秒数
*/
export default {
    props: {
        list: {
            type: Array,
            default: []
        },
        showItemCount: {
            type: Number,
            default: 1
        },
        step: {
            type: Number,
            default: 1
        },
        delay: {
            type: Number,
            default: 2000
        },
        during: {
            type: Number,
            default: 1000
        }
    },
    watch: {},
    data() {
        return {
            listData: this.list,
            ulStyle: { transform: 'translate(0, 0)' },
            boxHeight: ''
        }
    },
    created() {
        this.$nextTick(() => {
            // 当总条数大于显示的条数, 并且间隔时间要大于动画时间,才动画
            if (this.list.length > this.showItemCount && this.delay > this.during) {
                this.run()
            }
        })
    },
    mounted() {
        this.itemHeight = this._getItemHeight()
        this.boxHeight = this.itemHeight * this.showItemCount
    },
    methods: {
        run() {
            let me = this
            clearTimeout(me.timer)
            me.timer = setTimeout(() => {
                me.ulStyle = {
                    transform: 'translate(0, -' + me.itemHeight * me.step + 'px)',
                    transition: 'transform ' + Number(me.during / 1000) + 's'
                }
                setTimeout(() => {
                    me.ulStyle = { transform: 'translate(0, 0)' }
                    let temp = me.listData.splice(0, me.step)
                    for (let i of temp) {
                        me.listData.push(i)
                    }
                }, me.during)
                me.run()
            }, me.delay)
        },
        _getItemHeight() {
            let liEle = document.querySelector('.marquee li')
            if (liEle) {
                return liEle.offsetHeight
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';
.marquee {
    overflow: hidden;
    .marquee-item {
        p {
            width: 100%;
            padding: 0 px2rem(23);
            font-size: px2rem(26);
            line-height: px2rem(50);
            color: #fff;
            background-color: rgba(112, 0, 0, 0.6);
            border-radius: px2rem(25);
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
</style>
