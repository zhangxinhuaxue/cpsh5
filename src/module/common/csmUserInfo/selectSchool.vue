<template>
    <div class="aui-page" style="z-index: 100;">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <select-school @complete="complete"></select-school>
        </div>
    </div>
</template>
<script>
import selectSchool from 'components/selectschool/index.vue'
export default {
    data() {
        return {
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                h5: {},
                app: {
                    rightBtnShow: true,
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#000000', // #ff00000颜色 showType=TEXT
                        text: '' // 展示文字内容 showType=TEXT
                    }
                }
            }
        }
    },
    components: {
        selectSchool
    },
    methods: {
        complete(data) {
            this.$emit('complete', data.schoolName)
            this.$router.back()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
</style>
