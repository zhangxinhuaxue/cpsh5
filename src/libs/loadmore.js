/**
 *
 * @author:      sunxj
 * @dateTime:    2017-11-01 15:12:50
 * @description: 滚动加载更多...
 */
export default (Vue, Options = {}) => {
    let currentEle = ''
    let diff = 50
    let oldScrollHeight = 0

    let loadMore = (el, binding) => {
        el.addEventListener('touchstart', () => {
            if (!currentEle) {
                currentEle = getScrollEventTarget(el)
            }
            handleScroll(currentEle, binding)
        })
    }
    // 获取滚动元素
    let getScrollEventTarget = (el) => {
        let currentNode = el
        while (currentNode && currentNode.tagName !== 'HTML' &&
            currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
            let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY
            if (overflowY === 'scroll' || overflowY === 'auto') {
                return currentNode
            }
            currentNode = currentNode.parentNode
        }
        return document.body
    }

    let handleScroll = (ele, binding) => {
        ele.addEventListener('scroll', (event) => {
            let target = event.target
            let clientHeight = target.clientHeight
            let scrollHeight = target.scrollHeight

            let scrollTop = target.scrollTop
            if ((clientHeight + scrollTop >= scrollHeight - diff) && scrollHeight != oldScrollHeight) {
                oldScrollHeight = scrollHeight
                binding.value()
            }
        })
    }

    Vue.directive('load-more', {
        bind: loadMore
    })
}
