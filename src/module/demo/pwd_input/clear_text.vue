<template>
    <div class="aui-page">
        <div class="aui-content">
            <inputUi @complete="inputComplete" type="visible" :tips="errorinfo">
            </inputUi>
            <!-- <inputUi @complete="inputComplete"></inputUi> -->
        </div>
    </div>
</template>
<script>
import inputUi from 'components/input_ui/aym_input.vue'
export default {

    name: 'pwd_input',

    data() {
        return {
            errorinfo: ''
        }
    },
    components: {
        inputUi
    },
    methods: {
        inputComplete(code) {
            console.log(code)
            this.errorinfo = ''
            setTimeout(() => {
                this.errorinfo = 'after 500ms '
            }, 500)
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

.error__tips {
    min-height: px2rem(30);
    text-align: center;
    margin-top: px2rem(50);
    font-size: px2rem(28);
    color: #FF3D43;
}

</style>
