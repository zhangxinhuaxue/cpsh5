<template>
    <!-- 首页任务模块 -->
    <section class="pointsTask points__block">
        <h4>
            做任务赚积分
            <!-- <span @click="toHistory">历史任务</span> -->
        </h4>
        <ul>
            <li :class="{'pointsTask-picked': !!item.expire}" v-for="item in list" :key="item.taskId">
                <axd-image :src="item.icon" :class="'points__icon'" :lazy="false"></axd-image>
                <div class="pointsTask__infos">
                    <h4>{{item.name}}<span v-if="item.taskType === 'adv' && item.taskExt" class="advProccess">(进度{{item.taskExt.current}}/{{item.taskExt.total}})</span></h4>
                    <p v-if="item.taskType === 'adv'">随机奖励积分、优惠券、现金红包</p>
                    <p v-else>奖励<span>{{item.score}}</span>积分</p>
                    <span v-if="!!item.expire && item.taskType !== 'adv'">{{item.expire}}到期</span>
                </div>
                <!-- 1、点击领任务判断是爱又米APP环境，提示下载召集令、2、当时浏览视频任务adv时，添加文案和进度 -->
                <div v-if="item.taskType === 'adv' && item.status === 1">
                    <div class="pointsTask__btn points__btn btnauto" @click="doTask(item)">{{item.taskExt.current>0 ? '继续观看' : '点击观看'}}</div>
                </div>
                <div v-else class="pointsTask__btn points__btn" @click="doTask(item)">{{statusFn(item)}}</div>
            </li>
        </ul>
        <p :class="['pointsTask__more', {'less': showMore}]" @click="felxFn" v-if="more5">
            {{!showMore?'更多任务':'点击收起'}}
            <m-icon type="back1"></m-icon>
        </p>
    </section>
</template>

<script>
import { accessLog } from 'src/libs/accessLog'
import axdImage from 'components/image/index.vue'
import { Icon } from '@fe/buss-ui'
import { taskList, taskCheck, taskReceive, advComplete } from 'store/modules/user-points'
import { AXD, isZjl, isIOS} from 'src/libs/util'
export default {
    props: {
        taskInit: Boolean
    },
    data() {
        return {
            currentTaskId: '',
            appParam: {},
            list: [], // 输出列表
            listAll: [], // 全部列表
            listOnly5: [], // 限制5个列表
            showMore: false, // 是否展示全部
            more5: false // 是否多余5个任务
        }
    },
    components: {
        axdImage,
        mIcon: Icon
    },
    watch: {
        taskInit(newVal) {
            if (newVal) {
                this.init()
            }
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init() {
            // 获取数据
            taskList({
                queryType: 1
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    // 无列表数据，隐藏模块
                    if (!result.list || !result.list.length) {
                        this.$emit('close')
                        return
                    }
                    if (result.list.length > 5) {
                        this.listAll = result.list
                        this.listOnly5 = result.list.slice(0, 5)
                        this.more5 = true
                        this.list = this.showMore ? this.listAll : this.listOnly5
                    } else {
                        this.list = result.list
                    }
                } else {
                    // 获取失败隐藏列表
                    this.$emit('close')
                    if (code == 10001 || code == 10002) {
                        //     AXD.util.smsLogin()
                        return
                    }

                    // this.$_alert('服务器累了，请稍后重试')
                    this.$_toast(resultDes)
                }
            })
        },
        doAdv() {
            // 视频任务去调原生协议和埋点
            accessLog({type: 'button', name: 'jfxz-button-watc', desc: '立即观看'})
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
                            accessLog({type: 'button-logic-link', name: 'jfxz-button-watc', desc: '下载召集令APP', extendData: url})
                            window.location.href = url
                        }
                    }).show()
                }
            } else {
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
            }
        },
        checkTask(item) {
            // 检验任务是否可做
            let { taskId, jumpUrl, taskType, taskExt = {} } = item
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
                            // 首次需要弹出授权提示
                            const isFirst = taskExt.current === 0
                            if(isFirst){
                                this.$_confirm({
                                    type: 'confirm',
                                    title: '是否授权',
                                    content: '只是将您的位置信息传给<b>趣变</b> <br>  <span  style="color:#666;font-size:12px;">*招集令承诺不会将您的信息外泄</span>',
                                    confirmBtn: '授权',
                                    cancelBtn: '再考虑下',
                                    onConfirm: () => {
                                        this.log({ type: 'button-logic', name:'user_point_button_auth', desc: '确定授权' }) 
                                        this.doAdv(this.appParam)
                                    }
                                })
                                return
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
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        toHistory() {
            this.$router.push({ name: 'taskHistory' })
        },
        felxFn() {
            // 展开全部或者收缩
            this.showMore = !this.showMore
            this.list = this.showMore ? this.listAll : this.listOnly5
        },
        statusFn({ status }) {
            if (status == 0) return '领任务'
            if (status == 1) return '做任务'
            // 如果状态下发错误，默认为待领任务
            return '领任务'
        }
    }
}
</script>
<style lang="scss" scoped>
.advProccess {
    font-size: px2rem(24);
}
.btnauto {
    top: 0;
}
</style>
