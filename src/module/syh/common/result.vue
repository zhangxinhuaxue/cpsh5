<template>
    <div class="result__content" v-if="initDone">
        <div class="top">
            <div class="top__title">
                {{title}}
            </div>
            <div class="top__subtitle">
                {{subTitle}}
            </div>
        </div>
        <div class="list__box">
            <div class="list__title">
                快速放款通道
            </div>
            <SyhList type="result" :list="list" :positionCode="positionCode"/>
            <div class="list__bottom">
                <m-button
                    slot="value"
                    :round="false"
                    type="border"
                    size="xsmall"
                    @click="handleGoMore"
                    >查看更多 <m-icon type="back1" class="arrow__right"></m-icon
                ></m-button>
            </div>
        </div>
    </div>
</template>
<script>
import SyhList from '@/module/syh/common/list.vue'
import { getTrafficList } from '@/store/modules/syh'

export default {
    name: 'SyhListIndex',
    props:{
        positionCode:{
            //  products:产品列表页  creditFail:授信失败  auto:auto页面
            type: String,
            default:''
        },
        title:{
            type: String,
            default:''
        },
        subTitle:{
            type: String,
            default:''
        }
    },
    components: {
        SyhList
    },
    data() {
        return {
            filterIndex: -1,
            list:[],
            initDone: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            getTrafficList({
                positionCode: this.positionCode 
            }).then(res => {
                this.initDone = true
                if (res.success) {
                    this.list = res.result || []
                    this.$emit('update:isShowSyh',true) 
                    return
                }
                this.log({ type: 'logic', name:`loan_syh_${res.code}`, desc: '获取随意花产品列表失败' })
                this.$emit('update:isShowSyh',false)
                this.$emit('update:errorCode', res.code)
                this.list = []
            })
        },
        handleGoMore(){ 
            const logName = {
                // products:产品列表页  creditFail:授信失败  auto:auto页面
                products: 'productlist-button-seemore',
                auto: 'autopage-button-seemore',
                creditFail: 'creditfailure-button-seemore'
            }[this.positionCode]
            this.log({ type: 'button-link', name:logName, desc: '查看更多按钮' })

            this.$router.push({
                name: 'syhList'
            })
        }

    }
}
</script>
<style lang="scss" scoped>
.arrow__right{
    transform: rotate(180deg);
    font-size: px2rem(24);
    margin-top: px2rem(-4);
    margin-left: px2rem(-8);
}
.result__content {
    background: url('../assets/bg.png') no-repeat 0 0 #F8F8F8;
    background-size: contain; 
    padding-bottom: px2rem(120);
    .h180 {
        height: px2rem(180);
    }
    .top {
        text-align: center;
        padding: px2rem(40) px2rem(32);
        // background: linear-gradient(180deg, #e3edff, #e5f4ff 100%);
        .top__title {
            font-size: px2rem(34);
            font-weight: 600;
            color: #333333;
        }
        .top__subtitle {
            font-size: px2rem(24);
            font-family: PingFangSC, PingFangSC-Regular;
            color: #666666;
            margin-top: px2rem(8);
        }
    }
    .list__box {
        width: px2rem(686);
        margin: 0 auto;
        background: #fff;
        border-radius: px2rem(12);
        .list__title {
            font-size: px2rem(32);
            color: #333333;
            padding: px2rem(24) px2rem(24) px2rem(12);
        }
        .list__bottom {
            text-align: center;
            padding: px2rem(32) 0;
            position: relative;
        }
    }
    .list__bottom ::v-deep .mui-btn_border {
        color: var(--auiColorPrimary);
        border-color: var(--auiColorPrimary);
        padding: 0 px2rem(48);
    }
}
</style>
