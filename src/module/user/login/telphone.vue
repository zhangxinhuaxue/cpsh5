<!--
    Created by Doris on 04/2017
-->
<template>
    <div class="aui-cell">
        <div class="aui-cell__bd">
            <input ref="telInput" type="tel" placeholder="请输入手机号" class="aui-input" v-model.trim="username" maxlength="11">
        </div>
        <div v-if="delBtn" class="aui-cell__ft aui-cell__close" @click="clean">
            <axd-image :src="closeBtn" :lazy="false"></axd-image>
        </div>
    </div>
</template>
<script>
import axdImage from 'components/image/index.vue'
import { getCookie, getDecryptedPsw } from 'libs/util'

export default {
    name: 'username',
    data() {
        return {
            username: '',
            closeBtn: require('../img/close.png'),
            delBtn: true
        }
    },
    mounted() {
        setTimeout(() => {
            this.setUserName()
        }, 0)
    },
    components: {
        axdImage
    },
    watch: {
        username(value) {
            this.$emit('getUserName', this.username)
        }
    },
    methods: {
        clean() {
            this.username = ''
            this.focusOn()
        },
        focusOn() {
            this.$refs.telInput.focus()
        },
        usernameValue(value) {
            this.$emit('getUserName', this.username)
        },
        setUserName() {
            let cookieStr = getCookie('partnerAuth')
            if (cookieStr) {
                let partnerAuth = JSON.parse(getDecryptedPsw(cookieStr))
                if (partnerAuth.partnerInfo && partnerAuth.channel == 'pu') {
                    this.username = partnerAuth.partnerInfo
                    this.delBtn = false
                    this.$refs.telInput.readOnly = true
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../var.scss';
.aui-cell {
    padding: 0 px2rem(21) 0 px2rem(10);
    &:before {
        left: 0;
    }
}

.aui-cell__close {
    width: px2rem(43);
}
</style>
