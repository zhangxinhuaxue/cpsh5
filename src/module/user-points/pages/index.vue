<template>
  <div id="points"
    class="points">
    <axd-header v-if="!isH5"
      :topBar="topBar"
      :appVersion="appVersion"></axd-header>
    <!-- 头部 -->
    <points-header></points-header>
    <!-- 签到板 -->
    <points-sign @popup="showPopFn"
      @initTask="taskInit=true"></points-sign>
    <!-- 广告位 -->
    <points-ad></points-ad>
    <!-- 任务列表 -->
    <points-task v-if="showTask"
      @close="showTask=false"
      :taskInit="taskInit"></points-task>
    <!-- 日常积分 -->
    <points-common v-if="showTaskCommon"
      @close="showTaskCommon=false"></points-common>
    <!-- 积分赢大奖 -->
    <points-game v-if="showGame"
      @close="showGame=false"></points-game>
    <!-- 积分兑换奖品 -->
    <points-exchange v-if="showExchange"
      @close="showExchange=false"></points-exchange>
    <!-- 签到弹窗 -->
    <points-pop v-if="showPop"
      :data="popData"
      @close="switchPop"></points-pop>
  </div>
</template>
<script>
import axdHeader from 'components/header/index.vue'
import pointsHeader from '../components/header.vue'
import pointsSign from '../components/sign-panel.vue'
import pointsTask from '../components/task.vue'
import pointsCommon from '../components/task-common.vue'
import pointsGame from '../components/game.vue'
import pointsExchange from '../components/exchange.vue'
import pointsAd from '../components/advertising.vue'
import pointsPop from '../components/popup.vue'
export default {
    name: 'pointsIndex',
    data() {
        return {
            showPop: false, // 签到弹窗
            popData: {},
            showGame: true, // 是否展示游戏模块
            showTaskCommon: true, // 是否展示日常任务模块
            showTask: true, // 是否展示任务模块
            showExchange: true, // 是否展示兑换模块
            taskInit: false, // 是否可以初始化任务列表
            topBar: {
                barshow: 'true',
                title: '积分中心',
                backgroundColor: '%23ffffff',
                displaySharebutton: false
            },
            appVersion: window.aixuedai.appVersion + '', // window.aixuedai.appVersion
            isH5: aixuedai.isUavoApp === 'n'
        }
    },
    components: {
        axdHeader,
        pointsHeader,
        pointsSign,
        pointsTask,
        pointsCommon,
        pointsGame,
        pointsExchange,
        pointsAd,
        pointsPop
    },
    created() {
        window.onscroll = () => {}
    },
    methods: {
        showPopFn(data) {
            this.switchPop()
            this.popData = data
        },
        switchPop() {
            this.showPop = !this.showPop
        }
    }
}
</script>


