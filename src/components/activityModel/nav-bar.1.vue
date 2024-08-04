<!--
    created: mahui, on 05/17/2018
    desc:
    1. 新版楼层导航
    2. 添加了滑动楼层水平导航条的滑动惯性，使滑动更加流畅，滑动惯性只捕捉用户操作后300ms内的滑动状态
    3. 相比于老版本的楼层，去除了点击tab后的页面滑动效果，并兼容了在不同浏览器下楼层的动态效果
    4. 去除了楼层下拉后的mask层，在楼层处于下拉状态的时候也兼容

    edited: daly, on 11/30/2018
    desc:
    1.事件更换，点击tab覆盖scroll时间
    2.解决最后一个tab选不中的情况
    3.解决模拟器功能不能正常使用的bug
-->
<template>
    <div type="nav-bar" id="nav-bar" :style="boxStyle">
        <div :class="['nav-bar', {'unfold': unfoldNav,'fixed': isFixed,'fitwidth': fitWidth}]" :style="fixStyle">
            <div v-show="unfoldNav" class="nav-bar__header">切换楼层</div>
            <ul @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="touchStyle" ref="navUl">
                <template  v-for="(item, index) in config.nameList">
                    <li :class="{'active': index === activeIndex}" :style="chooseLiStyle(index)" @click="changeTabs(index,item)" :key="index">{{item.title}}</li>
                </template>
            </ul>
            <!-- 切换下拉按钮 -->
            <span v-if="showPullDown" @click="toggleFold" :class="['nav-bar__toggleBtn', {'unfold': unfoldNav}]"></span>
        </div>
    </div>
</template>
<script>
import hub from 'assets/js/hub'
import throttle from 'lodash/throttle'
import { setSessionStorage } from 'libs/util'
export default {
    name: 'navbar',
    props: {
        config: Object,
        cmsData: Object
    },
    data() {
        return {
            activeIndex: 0, // 选中tab的index值
            boxWidth: 0, // 楼层最外层父盒子宽度
            btnWidth: 0,
            showPullDown: false, // 是否需要显示下拉框，高于三个tabs才会显示
            unfoldNav: false, // 是否展开导航
            moveDistanceX: 0,
            lastMoveDistanceX: 0,
            startX: 0,
            moveDuration: '0s',
            limitWidth: 0, // 导航条水平滑动的最大距离
            stopInertiaMove: false, // 是否停止滑动惯性
            inertiaStartTime: 0,
            timer: null,
            isFixed: false, // 导航是否固定
            navHeight: 0, // 导航自身的高度
            fixedTop: 0, // 导航fixed后距顶高度
            eleArray: null, // 楼层可以定位到的所有dom元素集合
            eleLiArray: null,
            fitWidth: false,
            offset: 0,
            baseArr: [],
            scrollDistance: 0
        }
    },
    computed: {
        touchStyle() {
            if (!this.unfoldNav) {
                return {
                    'transform': 'translate(' + this.moveDistanceX + 'px, 0px)',
                    'transition-timing-function': 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                    'transition-duration': this.moveDuration
                }
            }
        },
        boxStyle() {
            return {
                backgroundColor: '#' + this.config.bgColor
            }
        },
        liStyle() {
            return {
                color: '#' + this.config.fontColor
            }
        },
        activeLiStyle() {
            return {
                backgroundColor: '#' + this.config.bgSelectedColor,
                color: '#' + this.config.bgSelectedTextColor,
                borderBottomColor: this.config.bgSelectedTextColor
            }
        },
        fixStyle() {
            return {
                top: (this.isFixed ? this.fixedTop + 'px' : '0px'),
                width: this.boxWidth + 'px'
            }
        }
    },
    watch: {
        activeIndex(newVal) {
            setSessionStorage(`aym-navIndex_${window.aixuedai.alias}`, newVal)
            // 监听activeIndex的变化，让选中的tab尽量居中处理
            this.$nextTick(() => {
                this.tabsHander()
            })
        }
    },
    mounted() {
        this.init()
        this.navHeight = this.$el.offsetHeight

        // 处理外部影响数据，下载条&&回到顶部
        this.handleOutside()

        // 初始化加入楼层定位的dom数组
        this.eleLiArray = document.querySelectorAll('#nav-bar li')

        // 监听window的滚动事件
        window.onscroll = throttle(this.scrollHander, 50)
    },
    methods: {
        chooseLiStyle(i) {
            return (i === this.activeIndex) ? this.activeLiStyle : this.liStyle
        },
        handleOutside() {
            hub.$on('updateNavData', this.checkAll)
            hub.$on('scrollDistance', this.toScrollDistance)
            hub.$on('changeNavIndex', this.changeTabs)
            // 监听下载条的变化
            hub.$on('downloadClosed', () => {
                this.fixedTop = 0
            })
            hub.$on('downloadLoaded', () => {
                this.fixedTop = document.querySelector('#downloadBox').offsetHeight
            })
            // 监听totop回到顶部的变化
            hub.$on('toTop', () => {
                this.activeIndex = 0
            })
        },
        init() {
            this.boxWidth = this.$el.offsetWidth

            // 获取ul的宽度
            let ulWidth = this.$refs.navUl.offsetWidth

            if (ulWidth < this.boxWidth) {
                this.fitWidth = true
                ulWidth = this.boxWidth
            }

            if (this.config.nameList.length > 4) {
                this.showPullDown = true

                this.$nextTick(() => {
                    // 获取切换下拉按钮的宽度以及滑动的最大宽度
                    this.btnWidth = document.querySelector('.nav-bar__toggleBtn').offsetWidth
                    this.limitWidth = ulWidth - this.boxWidth + this.btnWidth
                })
            }
        },
        changeTabs(i) {
            this.activeIndex = i
            window.onscroll = null
            this.baseArr = []
            let data = this.getNowLength()
            if (data.length) {
                hub.$emit('chooseFloor', i)
            } else {
                this.toSpecifiedPosition()
            }
        },
        checkAll(i) {
            this.baseArr.push(i)
            // console.log(this.config.nameList)
            let data = this.getNowLength()
            if (this.baseArr.length == data.length) {
                setTimeout(() => {
                    this.toSpecifiedPosition()
                }, 100)
            }
        },
        getNowLength() {
            let data = this.config.nameList.filter((item, index) => item.blockType == 'product_zone' && index <= this.activeIndex)
            return data
        },
        toSpecifiedPosition() {
            // 位置fix
            this.isFixed = true
            // 收起展开框
            this.unfoldNav = false
            if (this.scrollDistance) {
                window.scrollTo(0, this.scrollDistance)
                // document.documentElement.scrollTop = offset
                // window.pageYOffset = offset
                // document.body.scrollTop = offset
                this.scrollDistance = 0
                // 重新监听scroll
                setTimeout(() => {
                    window.onscroll = throttle(this.scrollHander, 50)
                }, 20)
                return
            }
            // 点击之后会滚动到指定位置，此时不需要监听scroll
            this.eleArray = document.querySelectorAll('.' + this.config.listClass)
            // console.log(document.querySelectorAll('.' + this.config.listClass, '===query'))
            if (!this.eleArray.length) {
                return
            }
            // // 跳转到指定内容
            let eleTarget = this.eleArray[this.activeIndex]
            let offset = this.getTop(eleTarget) - this.navHeight - this.fixedTop
            // console.log(this.getTop(eleTarget), '===eleTarget')
            window.scrollTo(0, offset)
            // document.documentElement.scrollTop = offset
            // window.pageYOffset = offset
            // document.body.scrollTop = offset

            // 重新监听scroll
            setTimeout(() => {
                window.onscroll = throttle(this.scrollHander, 50)
            }, 20)
        },
        toScrollDistance(data) {
            this.scrollDistance = data
        },
        toggleNavFixed() {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop

            // 初始化导航距顶部距离以及导航自身高度
            let navTop = this.getTop(this.$el)
            // console.log('navTop=' + navTop)
            // 控制导航是否固定在顶部
            if (scrollTop >= navTop - this.fixedTop) {
                this.isFixed = true
            } else {
                this.isFixed = false
            }
        },
        // 获取元素的距顶高度
        getTop(ele) {
            let offset = ele.offsetTop
            if (ele.offsetParent) {
                offset += this.getTop(ele.offsetParent)
            }
            // console.log(offset)
            return offset
        },
        tabsHander() {
            // 容错处理，新增
            if (this.activeIndex >= this.eleLiArray.length) return

            let eleActiveLi = this.eleLiArray[this.activeIndex]
            let distance = -eleActiveLi.offsetLeft + this.boxWidth / 2 - eleActiveLi.offsetWidth / 2
            this.moveDuration = '0.5s'

            // 如果tabs的位置大于1/2处屏幕宽度，则选中的tabs自动移到1/2处屏幕的地方
            if (distance < 0 && distance > -this.limitWidth) {
                this.moveDistanceX = distance
            } else if (distance <= -this.limitWidth) {
                this.moveDistanceX = -this.limitWidth
            } else if (distance >= 0) {
                this.moveDistanceX = 0
            }

            this.lastMoveDistanceX = this.moveDistanceX

            setTimeout(() => {
                this.moveDuration = '0s'
            }, 0)
        },
        scrollHander() {
            this.eleArray = document.querySelectorAll('.' + this.config.listClass)
            if (!this.eleArray.length) {
                return
            }
            // 设置导航是否fixed
            this.toggleNavFixed()

            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            let eleMax = this.eleArray[this.eleArray.length - 1]
            let eleMin = this.eleArray[0]
            let pageOffsetHeight = Number(scrollTop) + Number(screen.height)
            let top = scrollTop + this.navHeight + this.fixedTop
            let eleMaxPosition = this.getTop(eleMax) + eleMax.offsetHeight

            // console.log(eleMaxPosition, pageOffsetHeight, '====')
            if (eleMaxPosition <= pageOffsetHeight) {
                this.activeIndex = this.eleArray.length - 1
            } else if (top <= this.getTop(eleMin)) {
                this.activeIndex = 0
            } else {
                Array.prototype.forEach.call(this.eleArray, (el, i) => {
                    if ((top >= this.getTop(el)) && (top < this.getTop(el) + el.offsetHeight)) {
                        this.activeIndex = i
                    }
                })
            }
        },
        toggleFold() {
            this.unfoldNav = !this.unfoldNav
        },
        touchStart(e) {
            if (this.unfoldNav) return

            let touch = e.touches[0]
            this.startX = touch.pageX

            this.inertiaStartTime = new Date().getTime()
            this.inertiaStartX = this.lastMoveDistanceX
        },
        touchMove(e) {
            if (this.unfoldNav) return

            // 当用户滑动操作时，禁止惯性
            this.stopInertiaMove = true

            let moveX = e.touches[0].pageX - this.startX + this.lastMoveDistanceX

            // 判断边界条件
            if (moveX > 0) {
                this.moveDistanceX = 0
            } else if (moveX < -this.limitWidth) {
                this.moveDistanceX = -this.limitWidth
            } else {
                this.moveDistanceX = moveX
            }

            // 只捕捉用户最后300毫秒内的惯性
            let time = new Date().getTime()
            if (time - this.inertiaStartTime > 300) {
                this.inertiaStartTime = time
                this.inertiaStartX = this.moveDistanceX
            }
        },
        touchEnd(e) {
            if (this.unfoldNav) return

            this.lastMoveDistanceX = this.moveDistanceX
            // console.log('this.lastMoveDistanceX=' + this.lastMoveDistanceX)
            // console.log('this.inertiaStartX=' + this.inertiaStartX)

            // 添加滑动惯性
            let time = new Date().getTime()
            let v = (this.lastMoveDistanceX - this.inertiaStartX) / (time - this.inertiaStartTime)

            this.stopInertiaMove = false
            this.inertiaMoveFunc(v, time)
        },
        inertiaMoveFunc(v, startTime) {
            if (!v) return
            let dir = v > 0 ? -1 : 1 // 加速度方向
            let deceleration = dir * 0.008 // 加速度
            let duration = v / deceleration // 速度消减至0所需时间

            let inertiaMove = () => {
                let nowTime = new Date().getTime()
                let t = nowTime - startTime
                let nowV = v + t * deceleration

                // 用户开始触摸操作，或速度减为0
                if (this.stopInertiaMove || (dir * nowV >= 0)) {
                    return
                }

                let moveX = (v + nowV) / 2 * t + this.lastMoveDistanceX
                if (moveX > 0) {
                    this.moveDistanceX = 0
                    this.lastMoveDistanceX = this.moveDistanceX
                    return
                } else if (moveX < -this.limitWidth) {
                    this.moveDistanceX = -this.limitWidth
                    this.lastMoveDistanceX = this.moveDistanceX
                    return
                } else {
                    this.moveDistanceX = moveX
                    this.lastMoveDistanceX = this.moveDistanceX
                }

                this.moveDistanceX = moveX
                this.lastMoveDistanceX = this.moveDistanceX
                this.timer = setTimeout(inertiaMove, 10)
            }

            inertiaMove()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';
$designWidth: 750;

#nav-bar {
    width: 100%;
    height: px2rem(80);
}

#nav-bar * {
    background-color: inherit;
}

.nav-bar {
    z-index: 9;
    position: relative;
    width: 100%;
    height: px2rem(80);
    overflow: hidden;

    &__header {
        height: 100%;
        line-height: px2rem(80);
        padding-left: px2rem(50);
        font-size: px2rem(24);
        color: #999;
    }

    ul {
        position: absolute;
        top: 0;
        left: 0;

        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;

        height: px2rem(80);
        font-size: initial; // 这行很重要，不加ul中的li上面会有空隙
        white-space: nowrap;
        opacity: 0.9;

        li {
            position: relative;
            top: px2rem(-2);
            flex: 1;
            -webkit-flex: 1;
            -moz-flex: 1;
            -ms-flex: 1;
            display: inline-block;
            text-align: center;
            height: px2rem(82);
            line-height: px2rem(82);
            padding: px2rem(0) px2rem(20);
            font-size: px2rem(28);
        }

        li.active {
            border-bottom-style: solid;
            border-bottom-width: px2rem(2);
        }
    }

    &__toggleBtn {
        z-index: 99;
        position: absolute;
        top: 0;
        right: 0;

        display: block;
        width: px2rem(70);
        height: px2rem(79);
        text-align: center;

        &:before {
            content:'';
            display: inline-block;
            width: px2rem(14);
            height: px2rem(24);
            background: url('../../assets/images/array.png') center center no-repeat;
            background-size: 100% 100%;
            transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
        }
    }

    &__toggleBtn.unfold:before {
        transform: rotate(270deg);
        -webkit-transform: rotate(270deg);
    }
}

.nav-bar.fitwidth {
    ul {
        width: 100%;
    }
}

.nav-bar.unfold {
    overflow: visible;

    ul {
        display: block;
        z-index: 9;
        position: absolute;
        top: px2rem(79);
        left: 0;
        width: 100%;
        height: auto;
        white-space: normal;

        li {
            position: static;
            float: left;
            width: 33%;
            height: px2rem(80);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}

.nav-bar.fixed {
    position: fixed;
    top: 0;
    left: 50%;
    -ms-transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
}
</style>
