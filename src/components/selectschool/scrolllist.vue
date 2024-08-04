<template>
    <div class="scroll-list">
        <div class="list-wrap scroll-wrapper" ref="wrapper">
            <div class="scroll-content">
                <ul ref="groups">
                    <li v-for="group in list" ref="listGroup">
                        <h3 class="aui-cells__title">{{group.name}}</h3>
                        <ul class="aui-cells">
                            <li class="aui-cell" v-for="item in group.items" @click="selectItem(item)">
                                <div class="aui-cell__bd">
                                    <p>{{item.schoolName}}</p>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="scroll-list-nav" ref="nav" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item, index) in shortcutList" :data-index="index" :data-value="item" :class="{active: currentIndex === index}">{{item}}</li>
            </ul>
        </div>
        <div class="scroll-list-fixed" v-show="fixedTitle">{{fixedTitle}}</div>
    </div>
</template>
<script type="text/javascript">
import { getData, storageTest } from './common'
import { schoolsNew, schoolsNewApp } from './api'

const TITLE_HEIGHT = 0
/* global localStorage */
export default {
    name: 'scrolllist',
    data() {
        return {
            list: [],
            scrollY: 0,
            currentIndex: 0
        }
    },
    created() {
        this.listHeight = []
        this.touch = {}
        // 获取学校列表,  先从本地缓存拿，没有再请求数据
        let schoolList = []
        if (storageTest(localStorage)) {
            schoolList = localStorage.getItem('schoolList')
            if (schoolList) {
                schoolList = JSON.parse(schoolList)
            }
        }
        if (schoolList && schoolList.length > 0) {
            this.list = schoolList
        } else {
            this.getSchoolList().then((data) => {
                if (data.success) {
                    if (data.result && data.result.length > 0) {
                        this.list = data.result
                        // 本地存储学校列表
                        if (storageTest(localStorage)) {
                            localStorage.setItem('schoolList', JSON.stringify(data.result))
                        }
                    }
                } else {
                    this.$_toast(data.resultDes)
                }
            })
        }
    },
    watch: {
        scrollY(newY) {
            const listHeight = this.listHeight
            // top
            if (newY > -TITLE_HEIGHT) {
                this.currentIndex = 0
                return
            }
            // midd
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (-newY >= height1 && -newY < height2) {
                    this.currentIndex = i
                    this.diff = height2 + newY
                    return
                }
            }
            // bottom
            this.currentIndex = listHeight.length - 2
        }
    },
    computed: {
        fixedTitle() {
            if (this.scrollY > -TITLE_HEIGHT) {
                return ''
            }
            return this.list[this.currentIndex] ? this.list[this.currentIndex].name : ''
        },
        shortcutList() {
            return this.list.map((group) => {
                return group.name.substr(0, 1)
            })
        },
        navLiHeight() {
            return this.$refs.nav.querySelector('li').clientHeight
        }
    },
    beforeMount() {},
    mounted() {
        setTimeout(() => {
            this.initScroll()
            this._calculateHeight()
        }, 20)
    },
    methods: {
        initScroll() {
            let options = {
                probeType: 3,
                click: true,
                scrollY: true
            }

            this.scroll = new BScroll(this.$refs.wrapper, options)
            this.scroll.on('scroll', (pos) => {
                this.scrollY = pos.y
            })
        },
        onShortcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
        },
        onShortcutTouchMove(e) {
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY
            let delta = (this.touch.y2 - this.touch.y1) / this.navLiHeight | 0
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta

            this._scrollTo(anchorIndex)
        },
        _calculateHeight() {
            const list = this.$refs.listGroup
            if (!list) {
                return
            }
            this.listHeight = []
            let height = TITLE_HEIGHT
            this.listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                let item = list[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        },
        _scrollTo(index) {
            if (index < 0) {
                index = 0
            } else if (index > this.listHeight.length - 2) {
                index = this.listHeight.length - 2
            }
            this.scroll.scrollToElement(this.$refs.listGroup[index], 0)
            this.scrollY = this.scroll.y
        },
        selectItem(item) {
            this.$emit('scrollSelect', item)
        },
        getSchoolList() {
            if (this.isApp) {
                return schoolsNewApp()
            } else {
                return schoolsNew()
            }
        }
    },
    components: {}
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/rem.scss';
@import 'src/assets/styles/mixins.scss';
$designWidth: 750;
.aui-cells__title {
    height: px2rem(70);
    font-weight: normal;
    padding-top: px2rem(30);
    padding-bottom: px2rem(8);
}

.scroll-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

.scroll-wrapper {
    width: 100%;
    height: 100%;
}

.scroll-list-nav {
    width: px2rem(41);
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    ul {
        li {
            line-height: px2rem(36);
            color: #999;
            font-size: px2rem(22);
            padding: 0 px2rem(10);
        }
        li.active {
            color: #FFB626;
            position: relative;
            &::before{
                position: absolute;
                content: " " attr(data-value) "";
                font-size: px2rem(40);
                width: px2rem(113);
                padding-left: px2rem(30);
                box-sizing: border-box;
                height: px2rem(84);
                line-height: px2rem(80);
                color:#ffffff;
                left: px2rem(-115);
                top: px2rem(-25);
                @include img2x('./imgs/qipao');
                background-size: 100% 100%;
            }
        }
        li[data-value='J']{
            &::before{
                padding-left: px2rem(35);
            }
        }
        li[data-value='W'], li[data-value='M'] {
            &::before{
                padding-left: px2rem(22);
            }
        }
        li[data-value='Q'], li[data-value='N'], li[data-value='H'], li[data-value='G'] {
            &::before{
                padding-left: px2rem(25);
            }
        }
    }
}

.scroll-list-fixed {
    height: px2rem(70);
    line-height: 1.53em;
    padding: px2rem(30) .68267rem px2rem(8);
    color: #999;
    font-size: .512rem;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #f7f7f7;
}
</style>
