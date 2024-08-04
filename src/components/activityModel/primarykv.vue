<!--
    modified: mahui, on 2018/10/19,
    desc: 1. 在原有主KV基础上增加了展示泡泡组件的功能，泡泡以跑马灯的形式往上跑
          2. 有两种样式，支持只传图片的样式和传了文案的样式
          3. 该组件兼容了泡泡背景图片宽不固定的情况
-->
<template>
    <div :data-name="config.title" type="kv" :class="[isFloor, 'kv']" :style="kvStyle">
        <axd-image :src="imgUrl"></axd-image>
        <slot></slot>
        <!-- 跑马灯气泡 -->
        <template v-if="objExtJson && objExtJson.isBubble">
            <div :class="['kv__bubble', {'fixHeight': bubbleList.length > 3}]" :style="{'bottom': bottomDist + 'rem', 'left': leftDist + 'rem'}">
                <ul ref="firstUl" :style="{'transition-timing-function': 'linear', 'transition-duration': moveDuration, 'transform': 'translate(0px, ' + moveDistance + 'px) translateZ(0px)'}">
                    <li v-for="(item,index) in bubbleList" :key="index">
                        <a :href="item.url">
                            <axd-image :src="item.imgUrl"></axd-image>
                            <div class="kv__bubble__text">
                                <p v-if="item.text" :style="{'color': '#' + item.textColor}">{{item.text}}</p>
                                <p v-if="item.subText" :style="{'color': '#' + item.subTextColor}">{{item.subText}}</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </template>
    </div>
</template>
<script>
import marquee from 'src/components/marquee/marquee.vue'
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'kv',
    props: {
        config: Object
    },
    data() {
        return {
            bubbleList: [],
            step: 0,
            liHeight: 0,
            moveDistance: 0,
            moveDuration: '0.5s'
        }
    },
    computed: {
        // 如需要把标题添加到楼层里，则类名为floor
        isFloor() {
            return this.config.floorShow && this.config.floorShow === 'y' ? 'floor' : null
        },
        imgUrl: function() {
            return this.config.img
        },
        kvStyle() {
            return {
                backgroundColor: '#' + this.config.bgColor
            }
        },
        objExtJson() {
            return this.config.objExtJson
        },
        bottomDist() {
            // 计算距离底部的距离，转化为rem
            if (this.objExtJson && this.objExtJson.bottomDist) {
                return window.hotcss.px2rem(this.objExtJson.bottomDist, 750)
            }
        },
        leftDist() {
            // 计算距离左侧的距离，转化为rem
            if (this.objExtJson && this.objExtJson.leftDist) {
                return window.hotcss.px2rem(this.objExtJson.leftDist, 750)
            }
        }
    },
    components: {
        axdImage,
        marquee
    },
    created() {
        // 气泡列表初始化，大于3个做动画，尾部补3个
        if (this.objExtJson && this.objExtJson.isBubble) {
            let bubbleList = this.objExtJson.bubbleList

            if (bubbleList.length > 3) {
                bubbleList.push(...(bubbleList.slice(0, 3)))
            }

            this.bubbleList = bubbleList
        }
    },
    mounted() {
        this.$nextTick(() => {
            let kvs = document.querySelectorAll('div[type="kv"]')
            kvs.length && Array.prototype.map.call(kvs, (kv) => {
                // kv.querySelector('img').onclick = () => false
            })
        })

        // 计算li的高度
        this.init()

        // 给气泡添加往上冒泡跑马灯动效
        if (this.bubbleList.length > 3) {
            this.run()
        }
    },
    methods: {
        init() {
            // 计算每个li高度
            if (document.querySelector('.kv__bubble li')) {
                this.liHeight = document.querySelector('.kv__bubble ul li').offsetHeight
            }
        },
        run() {
            // 泡泡往上移动
            setTimeout(() => {
                this.moveDuration = '0.5s'
                this.moveDistance -= this.liHeight

                if (this.moveDistance <= -(this.bubbleList.length - 3) * this.liHeight) {
                    // 重置
                    setTimeout(() => {
                        this.moveDistance = 0
                        this.moveDuration = '0s'
                    }, 500)
                }

                this.run()
            }, 1500)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';
.kv {
    position: relative;
    &__bubble {
        position: absolute;
        overflow: hidden;
        ul {
            margin-top: px2rem(-10);
        }
        li {
            padding-top: px2rem(10);
            height: px2rem(78);
        }
        a {
            position: relative;
            display: inline-block;
        }
        &__text {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: px2rem(10) 0 px2rem(10) px2rem(17);
            p {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:first-child {
                    height: px2rem(24);
                    line-height: px2rem(24);
                    font-size: px2rem(24);
                    margin-bottom: px2rem(4);
                    font-weight: bold;
                }
                &:last-child {
                    height: px2rem(22);
                    line-height: px2rem(22);
                    font-size: px2rem(16);
                }
            }
        }
    }
    .fixHeight {
        height: px2rem(227);
    }
}
</style>
