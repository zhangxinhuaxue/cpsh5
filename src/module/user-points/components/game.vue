<template>
    <!-- 首页游戏模块 -->
    <section class="pointsGame points__block">
        <h4>积分赢大奖</h4>
        <ul>
            <!-- todo:没有跳转地址的隐藏 ，第一期后台没做配置功能，链接写死-->
            <template v-for="item in list">
                <li @click="toPlay(item)">
                    <axd-image :src="item.iconUrl" :class="'points__icon'" :lazy="false"></axd-image>
                    <h4>{{item.activeName}}</h4>
                    <div class="points__btn">去玩</div>
                </li>
            </template>
        </ul>
    </section>
</template>

<script>
import axdImage from 'components/image/index.vue'
import { gameList } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'

export default {
    data() {
        return {
            imgUrl: require('../images/sign.png'),
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
            gameList().then(({success, result, code, resultDes}) => {
                if (success) {
                    this.list = result.list || []
                    // 没有列表隐藏
                    if (!this.list.length) {
                        this.$emit('close')
                    }
                } else {
                    this.$emit('close')
                    if (code == 10001 || code == 10002) {
                        // AXD.util.smsLogin()
                        return
                    }
                    // 获取失败隐藏列表
                    this.$_toast(resultDes)
                }
            })
        },
        toPlay({activeId, entryUrl}) {
            let hasParam = entryUrl.indexOf('?')
            let punctuation = (hasParam === -1) ? '?' : '&'
            let url = entryUrl + punctuation + 'activeId=' + activeId
            window.location.href = url
        }
    }
}
</script>
<style lang="scss" scoped>
.pointsGame {
    li {
        h4 {
            width: px2rem(362);
            line-height: px2rem(84);
        }
    }
}
</style>
