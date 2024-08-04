<template>
    <!-- 首页长期在线任务列表模块 -->
    <section class="pointsCommon points__block">
        <h4>日常积分</h4>
        <ul>
            <li v-for="item in list">
                <axd-image :src="item.icon" :class="'points__icon'" :lazy="false"></axd-image>
                <h4>{{item.name}}</h4>
                <div class="pointsCommon__rule">
                    <span></span>
                    <!-- 没有base，只展示积分，有base，展示基准 -->
                    <template v-if="item.base">
                        <!-- {{item.score}}积分{{item.base?`/${item.base}元`: ''}} -->
                        {{item.base}}元/{{item.score==1?'':item.score}}积分
                    </template>
                    <template v-else>{{item.score}}积分</template>
                    <!-- 需求修改。变更为xxx元/积分 -->
                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import axdImage from 'components/image/index.vue'
import { taskList } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
import hub from 'assets/js/hub'
export default {
    data() {
        return {
            list: []
        }
    },
    components: {
        axdImage
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            // 获取列表，2代表日常任务
            taskList({
                queryType: 2
            }).then(({success, result, code, resultDes}) => {
                if (success) {
                    this.list = result.list
                    // 无列表数据，隐藏模块
                    if (!this.list.length) {
                        this.$emit('close')
                    }
                } else {
                    // 获取失败隐藏列表
                    this.$emit('close')
                    if (code == 10001 || code == 10002) {
                    //     AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        doTask({taskType, taskId, jumpUrl}) {
            if (!taskType || !jumpUrl || !taskId) {
                this.$_toast('配置链接为空，无法跳转~')
                return
            }
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
                window.location.href = jumpUrl
            }
        }
    }
}
</script>

<style lang="scss">
.pointsCommon {
    li {
        h4 {
            width: px2rem(310);
            line-height: px2rem(84);
        }
    }
    &__rule {
        width: px2rem(180);
        text-align: right;
        white-space: nowrap;
        // padding-left: px2rem(40);
        font-size: px2rem(28);
        line-height: px2rem(84);
        color: #717172;
        span {
            position: relative;
            top: px2rem(5);
            display: inline-block;
            width: px2rem(32);
            height: px2rem(32);
            background: url(../images/icon-common.png) no-repeat 0 center;
            background-size: 100% 100%;
        }
    }
}
</style>
