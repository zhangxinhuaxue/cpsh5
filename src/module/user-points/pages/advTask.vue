<template>
  <div>
        <!-- cms配置一个页面，但里面图片在此页面分三次使用 -->
        <smart-coms :cmsData="cmsData1"></smart-coms>
        <div>
            <ul v-if="list.length">
                <li v-for="item in list" :key="item.taskId">
                    <!-- 1、点击领任务判断是爱又米APP环境，提示下载召集令-->
                    <div class="btnContain" @click="doTask(item)">
                        <img :src="btnImg" alt="">
                        <span class="proccess" v-if="item.status === 1">任务进度({{item.taskExt.current}}/{{item.taskExt.total}})</span>
                    </div>
                </li>
            </ul>
            <div v-else><img :src="img3" alt=""></div>
        </div>
        <smart-coms :cmsData="cmsData2"></smart-coms>
  </div>
</template>
<script>
import Vue from 'vue'
import { AXD, isZjl, isIOS} from 'src/libs/util'
import { taskList, taskCheck, taskReceive, advComplete } from 'store/modules/user-points'
// cms组件
import smartComs from 'src/components/activityModel/smartComs.vue'
import { renderDataCms } from 'src/store/api'
import lazyload from 'src/libs/lazyload'
import { accessLog } from 'src/libs/accessLog'
Vue.use(lazyload, { transpDefaultImg: true })
export default {
    name: 'advTask',
    data() {
        return {
            btnImg: '',
            status: null,
            currentTaskId: '',
            appParam: {},
            list: [], // 输出列表
            cmsData1: null,
            cmsData2: null,
            showPop: false, // 签到弹窗
            popData: {},
            showGame: true, // 是否展示游戏模块
            showTaskCommon: true, // 是否展示日常任务模块
            showExchange: true, // 是否展示兑换模块
            img1: '', // 领任务按钮
            img2: '', // 观看视频按钮
            img3: '' // 任务完成按钮
        }
    },
    components: {
        smartComs
    },
    watch: {
        status (n, o) {
            if (n === 0) {
                this.btnImg = this.img1
            } else if (n === 1) {
                this.btnImg = this.img2
            }
        }
    },
    created() {
        this.initCms()
    },
    methods: {
        initCms() {
            let param = {
                alias: 'qubiantest',
                type: '/cms'
            }
            renderDataCms(param).then(({success, result}) => {
                if (success) {
                    this.cmsData1 = {
                        blocks: result.blocks.slice(0,1),
                        template: result.template
                    }
                    this.cmsData2 = {
                        blocks: result.blocks.slice(4),
                        template: result.template
                    }
                    result.blocks.forEach((item) => {
                        if (item.title === '领任务') {
                            this.img1 = item.img
                        }
                        if (item.title === '观看视频') {
                            this.img2 = item.img
                        }
                        if (item.title === '任务完成') {
                            this.img3 = item.img
                        }
                    })
                    this.init()
                }
            })
        },
        init() {
            // 获取数据
            taskList({
                queryType: 1
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.list = []
                    result.list.forEach((item) => {
                        if (item.taskType === 'adv') {
                            this.list.push(item)
                            this.status = item.status

                            if (item.status == 0) {
                                this.btnImg = this.img1
                            }
                            if (item.status == 1) {
                                this.btnImg = this.img2
                            }
                        }
                    })
                } else {
                    if (code === '10002') {
                        AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        doAdv() {
            // 视频任务去调原生协议和埋点
            accessLog({type: 'button', name: 'sphd-button-watch', desc: '立即观看'})
            axdApp.send({
                module: 'tools',
                params: this.appParam,
                method: 'showRewardVideo',
                callback: (ret) => {
                    if (ret.data.status === '100') {
                        let param = {
                            watchId: ret.data.watchId,
                            endTime: ret.data.endTime,
                            sign: ret.data.sign,
                            taskId: this.currentTaskId
                        }
                        // 视频完成观看上报数据
                        advComplete(param).then(({ success, result, code, resultDes }) => {
                            if (success) {
                                this.$_alert(result.rewardNotice || '恭喜您，已完成观看').then(() => {
                                    this.init()
                                })
                            } else {
                                this.$_alert(resultDes)
                            }
                        })
                    } else if (ret.data.status === '-100') {
                        this.$_alert('已取消观看')
                    } else {
                        this.$_alert('视频加载失败，请稍后再试')
                    }
                }
            })
        },
        doTask(item) {
            this.currentTaskId = item.taskId
            if (item.taskType === 'adv') { // 任务类型是adv视频时，判断非召集令APP环境领取任务，提示下载召集令APP
                if (isZjl) {
                    // 领取任务或者做任务
                    let { taskType, taskId, status } = item
                    if (!taskType || !taskId) {
                        this.$_toast('下发数据缺失~')
                        return
                    }
                    if (status == 1) {
                        this.checkTask(item)
                    } else {
                        this.recieveTask(taskId)
                    }
                } else {
                    // 提示下载召集令APP
                    this.$createDialog({
                        content: '这个任务只有在招集令APP中才可以进行哦~请点击按钮下载招集令APP',
                        confirmBtn: '立即下载',
                        onConfirm: () => {
                            let url = 'https://m.zhaojiling.com/activity/activity-download-main/index?appto=zjl%3A%2F%2F'
                            accessLog({type: 'button-link', name: 'sphd-button-watch', desc: '下载召集令APP', url})
                            window.location.href = url
                        }
                    }).show()
                }
            }
        },
        checkTask(item) {
            // 检验任务是否可做
            let { taskId, jumpUrl, taskType } = item
            taskCheck({ id: taskId }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    // 认证授信特殊处理
                    // certification 完成认证
                    // credit 完成授信
                    if (taskType === 'certification') {
                        AXD.util.goAuth({
                            backUrl: encodeURIComponent(window.location.href),
                            authItem: 1,
                            channel: 'score_task'
                        })
                    } else if (taskType === 'credit') {
                        AXD.util.goCredit({
                            creditBackUrl: encodeURIComponent(window.location.href),
                            creditItem: 1
                        })
                    } else {
                        if (taskType === 'adv') {
                            let positionId = isIOS ? result.iosAdvId : result.androidAdvId // 判断ios还是安卓 result.iosAdvId result.androidAvdId
                            this.appParam = {
                                watchId:  result.watchId, // 服务返回
                                startTime: result.startTime, // 服务返回
                                positionId: positionId,
                                channelNum: '',
                                channelVersion: ''
                            }
                            this.doAdv(this.appParam)
                        } else {
                            window.location.href = jumpUrl
                        }
                    }
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                    } else if (code == 2503) {
                        this.$_toast(resultDes)
                        this.init()
                    } else {
                        this.$_toast(resultDes)
                    }
                }
            })
        },
        recieveTask(id) {
            // 领取任务
            taskReceive({ id }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.$_toast('领取成功')
                    this.init()
                } else {
                    console.log(resultDes)
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        statusFn(status) {
            if (status == 0) return 'img1' // '领任务'
            if (status == 1) return 'img2' // '观看视频'
            // 如果状态下发错误，默认为待领任务
            return 'img3' // '任务完成'
        }
    }
}
</script>
<style lang="scss" scoped>
.btnContain {
    position: relative;
    .proccess {
        position: absolute;
        left: 40%;
        bottom: px2rem(20);
        font-size: px2rem(22);
        color: #ff8600;
    }
}
</style>

