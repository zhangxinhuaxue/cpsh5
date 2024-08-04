<template>
    <div class="config">
        <div class="aui-cells">
            <a v-for="item in list" class="aui-cell aui-cell_access" href="javascript:;" @click="go(item)">
                <div class="aui-cell__bd">
                    <p>{{item.name}}</p>
                </div>
                <div class="aui-cell__ft">
                </div>
            </a>
        </div>
    </div>
</template>
<script>
import { AXD } from 'src/libs/util'
export default {
    name: 'my',
    props: {
        isLogin: false
    },
    data() {
        return {
            list: [{
                name: '帮助中心',
                linkName: 'help',
                needLogin: false
            }, {
                name: '账户管理',
                linkName: 'choose',
                needLogin: true
            }]
        }
    },
    methods: {
        go(item) {
            if (item.needLogin && !this.isLogin) {
                AXD.util.login()
                return
            }
            if (item.linkName) {
                this.$router.push({
                    name: item.linkName
                })
                return
            }
            if (item.linkUrl) {
                window.location.href = item.linkUrl
            }
        }
    }
}
</script>
