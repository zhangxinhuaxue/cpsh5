// 在打包的时候已经全局打入
import { getUA } from 'src/libs/util'
import 'src/libs/axdApp'
import sensors, { setProps, initEvent } from '@ac/sensors'

const isProd = /(m|app).zhaojiling.com/.test(window.location.hostname)
// 添加默认属性格式如下
setProps({ id4: getUA('id4') })
sensors.init({
    server_url: `https://risk-collect-ex.zhaojiling.com/sa?project=${isProd ? 'production' : 'default'}`,
    // heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.9.1 及以上版本，这个参数必须配置，低于此版本不需要配置。
    heatmap_url: '',
    // web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
    web_url: '',
    // app中是否走app发送数据
    use_app_track: true,
    // 是否开启单页应用模式 开启会在监控到hash变化后 产生一个pageview事件的请求
    is_track_single_page: true,
    is_track_device_id: true,
    is_debug: { apph5: true },
    heatmap: {
        // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
        // 需要 JSSDK 版本号大于 1.7
        clickmap: 'default',
        // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
        // 需要 JSSDK 版本号大于 1.9.1
        scroll_notice_map: 'default'
    }
})
initEvent()
sensors.quick('autoTrack')

export var businessCode = 'aym'

export function log(codeName, property, description) {
    // const eventName = {
    //     'resume': '$PageView',
    //     'click': '$WebClick'
    // }
    // const name = codeName.match(/.*_([^_].*)+$/)
    // const event = name ? (eventName[name[1]] ? eventName[name[1]] : name[1]) : 'unknow'
    // track(event, {
    //     // ...property,
    //     eventname: codeName,
    //     eventcode: description
    // })
    // 自己的老的埋点后端服务已停了
    // analytic.log(codeName, property, description)
}
