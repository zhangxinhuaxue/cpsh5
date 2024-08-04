<template>
    <!-- 历史任务 包含已做、未做已过期 -->
    <section class="points__block exchangeList">
        <ul v-if="list.length">
            <li v-for="(item, i) in list" :key="i">
                <axd-image :src="item.icon" :class="'points__icon'" :lazy="false"></axd-image>
                <div class="pointsTask__infos">
                    <h4>{{item.name}}</h4>
                    <p><span>{{item.score}}</span>积分</p>
                </div>
                <!-- 不同的失效状态按钮 -->
                <div class="points__btn gray">{{statusFn(item.status)}}</div>
            </li>
        </ul>
        <!-- 空提示 -->
        <div class="points__none history" v-else>
            <p>当前暂无历史任务</p>
            <p>先去积分中心逛逛吧</p>
        </div>
    </section>
</template>

<script>
import axdImage from 'components/image/index.vue'
import { taskList } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
export default {
    name: 'pointsTaskHistory',
    data() {
        return {
            list: [],
            moreLoading: false, // 请求中
            noMore: false, // 是否还有数据
            start: 0 // 分页起始位置
        }
    },
    components: {
        axdImage
    },
    created() {
        window.onscroll = () => {}
        this.init()
    },
    methods: {
        init() {
            // 获取列表
            taskList({
                queryType: 3,
                size: 20,
                start: this.start
            }).then(({success, result, code, resultDes}) => {
                this.moreLoading = false
                if (success) {
                    this.list = [...this.list, ...result.list]

                    // 大于20再做监听
                    if (result.total > 20) {
                        this.scrollEvent()
                    }

                    // 下发全部
                    if (this.list.length >= result.total) {
                        this.noMore = true
                        return
                    }

                    this.start += 20
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    this.noMore = true
                }
            })
        },
        statusFn(status) {
            // 除了2、3，错误code码一律视为过期
            if (status == 2) {
                return '已完成'
            } else {
                return '已过期'
            }
        },
        scrollEvent() {
            window.onscroll = () => {
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100 && !this.moreLoading && !this.noMore) {
                    this.loadMore()
                }
            }
        },
        loadMore() {
            this.moreLoading = true
            this.init()
        }
    }
}
</script>


