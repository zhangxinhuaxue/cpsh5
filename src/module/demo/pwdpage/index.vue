<template>
    <div class="aui-page">
        <div class="aui-content">
            <div @click="setpwd">设置密码</div>
            <div @click="forgetpwd">忘记密码</div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('password')
export default {
    name: 'setpwd',
    methods: {
        ...mapMutations([
            'saveTel'
        ]),
        setpwd() {
            this.$router.push({
                name: 'paySetPwd',
                params: {
                    type: 'new'
                }
            })
        },
        forgetpwd() {
            // this.saveTel('132****6868')
            this.$router.push({
                name: 'payForgetPwd'
            })
        }
    }
}
</script>
