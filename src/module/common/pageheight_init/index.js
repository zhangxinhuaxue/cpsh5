/**
 * created by zhaozhisheng 2017/12/08
 * -------auiPageHeightInit-Mixin---------
 * aui-page默认高度是自适应的100%，安卓下唤醒键盘的时候，高度收缩，
 * 底部absolute或者fixed定位的元素会浮上来，盖住顶部元素，这个mixin就是用来解决这个得。
 *
 * 用法：
 * aui-page dom上绑定heigh=fixedPageHeight的styel，如下
 * eg: <div class="aui-page" :style="{'height': fixedPageHeight+'px'}">
 */
const initHeightMixin = {
    name: 'initHeightMixin',
    data() {
        return {
            fixedPageHeight: 0,
            initialBodyHeight: 0
        }
    },
    mounted() {
        this.initPageHeight()
    },
    methods: {
        initPageHeight() {
            let pHeight = document.body.clientHeight ? document.body.clientHeight : 0

            if (!pHeight) {
                setTimeout(this.initPageHeight, 100)
            } else {
                let me = this
                me.fixedPageHeight = pHeight
                me.initialBodyHeight = pHeight

                // 处理H5浏览器下向上滚动 浏览器头部会自动收起 导致页面高度变化 底部按钮悬空的问题
                window.onresize = () => {
                    return (() => {
                        let bodyHeight = document.body.clientHeight
                        if (bodyHeight >= me.initialBodyHeight) {
                            me.fixedPageHeight = bodyHeight
                        }
                    })()
                }
            }
        }
    }
}

export {
    initHeightMixin
}
