/**
 *
 * @author:      hity
 * @dateTime:    2017-06-30
 * @description: 封装一个公用的mixin，处理模态窗口;默认执行自定义的scroll事件，如果有全局的touchmoveFunc传入，则这行全局函数。
 */
var modalPopup = {
    data() {
        return {
            scrollData: {
                startPos: 0, // touchstart的位置
                pElem: null, // 允许滚动的容器
                movePosList: [] // 存储每次touchmove的位置
            }
        }
    },
    methods: {
        stopScroll(event) {
            event.preventDefault()
            if (window.touchmoveFunc) {
                window.touchmoveFunc(event)
            } else {
                // 对弹窗区域允许滚动，并自定义滚动方式
                this.scrollData.pElem = this.isInnerParents(event.target, 'aui-popup__bd')
                if (this.scrollData.pElem) {
                    this.scrollData.movePosList.push(this.scrollData.startPos - event.touches[0].pageY)
                    let len = this.scrollData.movePosList.length
                    this.scrollData.pElem.scrollTop += this.scrollData.movePosList[len - 1] - this.scrollData.movePosList[len - 2]
                }
            }
        },
        getStartPos(event) {
            if (window.touchmoveFunc) {
                return
            }
            this.scrollData.startPos = event.touches[0].pageY
            this.scrollData.movePosList = [0]
        },
        // 判断当前的target是否在弹窗的滚动区域，如果是则返回该滚动区域元素，否则返回false
        isInnerParents(target, pClass) {
            let targetElem = target
            try{   
                while (true) {
                    if (!targetElem) {
                        return false
                    } 
                    if (targetElem.className  && typeof  targetElem.className.toLowerCase === 'function' && targetElem.className.toLowerCase().indexOf(pClass) != -1) {
                        return targetElem
                    } else if (targetElem.tagName.toLowerCase() == 'body') {
                        return false
                    } else {
                        targetElem = targetElem.parentNode
                    }
                }
            }catch(e){   
                const  str = `${typeof targetElem && targetElem.className},className: ${targetElem && targetElem.className}`
                window.Sentry && window.Sentry.captureErr({ type: 'DIY', title: str  + e })
                return false
            }
        }
    }
}

export { modalPopup }
