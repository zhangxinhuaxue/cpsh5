/**
 *
 * @author:      sunxj
 * @dateTime:    2017-12-06 14:16:31
 * @description:
 */

const pinyouMonitor = {
    /*
     * 创建script 插入header
     * key: Str 唯一标识
     */
    createScript(key = 'Xzs8T..hUyfasnkM_k7NAVRzdyqZX') {
        let [w, d, s, l, a] = [window, document, 'script', 'py', key]

        w._CommandName_ = l
        w[l] = w[l] || function() {
            (w[l].q = w[l].q || []).push(arguments)
            w[l].track = function() {
                (w[l].q[w[l].q.length - 1].t = []).push(arguments)
            }
            return w[l]
        }
        w[l].a = a
        w[l].l = 1 * new Date()

        var c = d.createElement(s)
        c.async = 1
        c.src = '//fm.ipinyou.com/j/a.js'
        var h = d.getElementsByTagName(s)[0]
        h.parentNode.insertBefore(c, h)
        this.executePy()
    },
    /*
     * 监听
     * p: Str 监听的位置
     * key: Str 唯一标识
     */
    executePy(p = 'viewPage', key) {
        if (key) {
           window.py('event', p, key)
        } else {
            window.py('event', p)
        }
    },
    /*
     * 提交数据
     * p: Str 监听的位置
     * data: Str 信息，JSON格式
     * key: Str 唯一标识
     */
    getData(p = '', data = {}, key = '') {
        window.py('event', p, data).track(key)
    }
}

export {
    pinyouMonitor
}
