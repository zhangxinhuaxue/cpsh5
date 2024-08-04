<template>
    <div class="aui-cell aui-cell__pwd">
        <div class="aui-cell__bd">
            <slot v-if="pwdStatus" name='inputClear'></slot>
            <slot v-else name='inputCipher'></slot>
        </div>
        <div class="aui-cell__ft">
            <img v-show="pwdStatus" :src="clear" alt="" @click="pwdStatusChange()" class="cell-ft__pwd">
            <img v-show="!pwdStatus" :src="cipher" alt="" @click="pwdStatusChange()" class="cell-ft__pwd">
        </div>
    </div>
</template>
<script>
export default {
    name: 'pwd',
    data() {
        return {
            pwdStatus: false,
            clear: require('../img/clear.png'),
            cipher: require('../img/cipher.png')
        }
    },
    methods: {
        pwdStatusChange() {
            this.pwdStatus = !this.pwdStatus
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
$designWidth: 1080;
.aui-cell__pwd {
    padding: 0 px2rem(45);
    .cell-ft__pwd {
        width: px2rem(66);
        height: px2rem(66);
    }
}
</style>
