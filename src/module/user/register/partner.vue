<template>
    <div class="page-ft">
        <div class="page-ft__title">
            -战略合作伙伴-
        </div>
        <div>
            <i class="bank-2"></i>中国银行 &nbsp;
            <i class="bank-0"></i>招商银行 &nbsp;
            <i class="bank-1"></i>平安银行 &nbsp;
        </div>
    </div>
</template>
<script>
import axdImage from 'components/image/index.vue'
// const axdImage = resolve => require(['components/image/index.vue'], resolve)
export default {

    name: 'partner',

    data() {
        return {

        }
    },
    components: {
        axdImage

    }
}
</script>
<style lang="scss" scoped>
@import '../var.scss';
.page-ft {
    text-align: center;
    font-size: px2rem(38);
    color: #999;
    position: absolute;
    bottom: px2rem(60);
    width: 100%;
}

.inline-img {
    display: inline-block;
}

.page-ft__title {
    margin-bottom: px2rem(30);
}

.bank-0 {
    @include icon(52, 56, '../img/bank-0.png');
}

.bank-1 {
    @include icon(81, 43, '../img/bank-1.png');
}

.bank-2 {
    @include icon(63, 63, '../img/bank-2.png');
}

i {
    margin-right: px2rem(15);
}
</style>
