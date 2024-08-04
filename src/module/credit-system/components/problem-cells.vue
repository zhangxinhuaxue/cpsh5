<template>
    <m-cell-group class="mt0">
        <template v-for="(item, index) in data">
        <m-cell
        is-link
        :key="'problem' + index"
        @click.native="goUrl(item.url)">
            <template slot="title">
                <h4 :class="['problem-title', {'problem-title_important': item.important}]">{{item.title}}</h4>
                <p class="problem-sub-title">{{item.subTitle}}</p>
            </template>
        </m-cell>
        </template>
    </m-cell-group>
</template>
<script>
export default {
    name: 'problemCells',
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    methods: {
        goUrl(url) {
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url,
                        closeToRoot: false
                    },
                    callback() {}
                })
            } else {
                window.location.href = url
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt0 {
    margin-top: 0;
}
.mui-cell:before {
    right: px2rem(32);
}
.problem-title {
    display: inline-block;
    font-size: $auiFontSizeLevel5;
    font-weight: 500;
    width: px2rem(170);
    height: px2rem(32);
    &::before {
        content: "";
        display: inline-block;
        width: px2rem(6);
        height: px2rem(24);
        border-radius: px2rem(3);
        background-color: #FF3E00;
        margin-right: px2rem(8);
        position: relative;
        top: px2rem(3);
    }
}
.problem-title_important:before {
    content: "荐";
    display: inline-block;
    width: px2rem(30);
    height: px2rem(32);
    line-height: px2rem(32);
    text-align: center;
    background-color: #FF3E00;
    color: #fff;
    font-size: px2rem(22);
}
.problem-title_important~.problem-sub-title {
    color: #FF3E00;
    font-weight: 500;
}
.problem-sub-title {
    display: inline-block;
    font-size: $auiFontSizeLevel6;
    color: #666;
}
.credit-tips {
    text-align: center;
    margin: px2rem(76) 0;
    color: $auiTextColorLight;
    font-size: $auiFontSizeLevel7;
}
</style>


