/**
 *
 * @author:      zhaozhisheng
 * @dateTime:    2017-06-12
 * @description: 封装一个公用的mixin，处理隐藏底部fixedbottom按钮功能
 */
var hideBottomMixin = {
    data() {
        return {
            randomClass: Math.random().toString(36).substr(2)
        }
    },
    computed: {
        isiOS() {
            let u = navigator.userAgent
            let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            return isiOS
        },
        hideObjs() {
            let pages = document.querySelectorAll('.aui-page')
            let fixedbottom
            let content
            let i = 0
            let _this = this
            for (; i < pages.length; i++) {
                if (pages[i].getElementsByClassName(_this.randomClass).length) {
                    fixedbottom = pages[i].getElementsByClassName('aui-fixedbottom')[0]
                    content = pages[i].getElementsByClassName('aui-content')[0]
                }
            }
            return {
                fixedbottom: fixedbottom,
                content: content
            }
        }
    },
    methods: {
        hideFixedBar() {
            if (this.isiOS) {
                let content = this.hideObjs.content
                let fixedbottom = this.hideObjs.fixedbottom
                let isfixed = Boolean(fixedbottom)
                if (isfixed) {
                    fixedbottom.style.visibility = 'hidden'
                    content.style.bottom = '0'
                }
            }
        },
        showFixedBar() {
            if (this.isiOS) {
                let content = this.hideObjs.content
                let fixedbottom = this.hideObjs.fixedbottom
                let isfixed = Boolean(fixedbottom)
                if (isfixed) {
                    fixedbottom.style.visibility = 'visible'
                    setTimeout(() => {
                        // 关闭动画之行完后
                        content.style.bottom = fixedbottom.clientHeight + 'px'
                    }, 300)
                }
            }
        }
    }
}

export { hideBottomMixin }
