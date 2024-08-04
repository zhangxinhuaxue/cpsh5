<!--
 * @Author: wzy
 * @Description: 授信关闭引导页
 * @Date: 2021-03-23
 -->
<template>
    <m-page>
        <SyhResult positionCode="creditFail" :title="resultTitle"  subTitle="推荐您尝试以下借款产品" />
    </m-page>
</template>
<script>
import { renderData } from 'src/store/api'
import { setHeader } from '../common/setHeader'
import SyhResult from '@/module/syh/common/result.vue'
import { getLocalStorage,removeLocalStorage}  from 'src/libs/util'

window.amountGoBack = () => {
    axdApp.send({
        module: 'webview',
        method: 'close'
    })
}

export default {
    name: 'closeguide',
    components: {
        SyhResult
    },
    data() {
        return {
            guideList: [],
            moreUrl: '',
            resultTitle:'暂时不符合条件'
        }
    },
    mounted() {
        // this.init()
        this.setBack()
        this.setResultTitle()
    },
    methods: {
        setBack() {
            if (this.isApp) {
                // 设置提额页回退，跳转creditBackUrl 或 关闭当前webview
                setHeader({
                    leftbuttonAction: 'amountGoBack'
                })
            }
        },
        setResultTitle(){
            let info = getLocalStorage('creditStatus')
            info = info?JSON.parse(info):{}
            if(!info.tmp){
                return
            }else if(Date.now() - parseInt(info.tmp) > 24*3600*1000){
                removeLocalStorage('creditStatus')
                return
            }else{
                switch(info.item){
                    case 'close':
                        this.resultTitle = info.msg || '暂时不符合条件'
                        break
                    default:
                        break
                }
            }

        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.guide-bg {
    background: url('../assets/images/close-bg.png') no-repeat 0 0 #F8F8F8;
    background-size: contain;
}
.guide-top {
    text-align: center;
    padding: px2rem(50) 0;
    .top1 {
        font-size: px2rem(34);
        color: #333;
        font-weight: bold;
        margin-bottom: px2rem(8);
    }
    .top2 {
        font-size: px2rem(28);
        color: #666;
    }
}
.guide-cont {
    margin: 0 px2rem(32);
    border-radius: px2rem(10);
    overflow: hidden;
    background-color: #fff;
    .guide-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 px2rem(32);
        height: px2rem(100);
        .guide-tl {
            font-size: px2rem(32);
            color: #333;
            font-weight: bold;
        }
        .guide-tr {
            height: px2rem(100);
            line-height: px2rem(100);
            font-size: px2rem(24);
            color: #999;
        }
    }
    a { display: block;}
    img { width: 100%; }
}
</style>
