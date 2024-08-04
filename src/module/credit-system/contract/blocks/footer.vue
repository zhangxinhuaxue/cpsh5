<!--
 * @Author: sunxj
 * @Date: 2019-09-05 17:46:57
 * @LastEditTime: 2019-09-09 10:12:17
 * @LastEditors: sunxj
 * @Description: 
 -->
<template>
    <footer class="mui-fixedbottom footer_height120">
        <div class="checkbox">
            <label>
                <input class="checkbox__original" type="checkbox" v-model="checked" />
                <m-icon class="checkbox-icon" :type="iconClass"></m-icon>我已阅读并同意<span>《{{name}}》</span>
            </label>
        </div>
        <m-button :disabled="!disabled" @click="agreeContract">我已阅读并同意{{countdownText}}</m-button>
    </footer>
</template>

<script>
import { isSupportLocalStorage, setLocalStorage, getUA } from 'src/libs/util'
export default {
    name: 'contractFooter',
    props: {
        platform: String,
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            checked: true,
            currentTime: 0
        }
    },
    computed: {
        iconClass() {
            return this.checked ? 'checkbox_checked' : 'checkbox_unchecked'
        },
        disabled() {
            return !this.currentTime && this.checked
        },
        countdownText() {
            if (this.currentTime) {
                return `(${this.currentTime}s)`
            }
            return ''
        }
    },
    mounted() {
        this.countdown(3)
    },
    methods: {
        agreeContract() {
            if (isSupportLocalStorage) {
                let uid = getUA('uid')
                let data = localStorage.getItem('suningContractDisabled') || '[]'
                data = JSON.parse(data)
                data.push({uid})
                setLocalStorage('suningContractDisabled', JSON.stringify(data))
            }
            this.$router.replace({
                name: 'creditBasic',
                params: {
                    platform: this.platform
                },
                query: {
                    mark: this.$route.query.mark
                }
            })
        },
        countdown(totalTime) {
            this.currentTime = totalTime
            // return new Promise((resolve, reject) => {
            let timer = setInterval(() => {
                this.currentTime -= 1
                if (this.currentTime <= 0) {
                    clearInterval(timer)
                    // resolve()
                }
            }, 1000)
            // })
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.footer_height120 {
    height: px2rem(120);
    padding-top: px2rem(12);
    // box-shadow: 0 -2px 3px #f0f0f0;
    &::before {
        content: none;
    }
    ::v-deep~.mui-content {
        padding-bottom: px2rem(100);
    }
}
.checkbox {
    padding: px2rem(10) px2rem(32);
    font-size: px2rem(24);
    color: #999;
    background-color: #fff;
    position: absolute;
    bottom: px2rem(120);
    width: 100%;
    span {
        color: #007FFF;
    }
}
.checkbox-icon {
    color: #FFE550;
    font-size: px2rem(28);
    margin-right: px2rem(6);
}
.checkbox__original {
    display: none;
}
</style>