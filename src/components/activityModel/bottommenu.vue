<!--
    created: mahui, on 2018/10/13
    desc: 1. 底部导航模块，其中一个tab点击展开分会场菜单按钮，其余全跳转到指定配置链接
          2. tab数量可配置，每个tab分为两种状态，选中和未选中，分别对应一张图片
          3. 选中状态图片是必填，未选中状态图片是可选
-->
<template>
    <div type="bottomnav" class="bottomnav">
        <!-- 底部tab -->
        <ul class="bottomnav__tabs">
            <li v-for="(item, index) in navList" :key="index" :data-index="index" :style="{'background-image': ((index == checkedIndex) || !item.uncheckedImgUrl) ? 'url(' + item.checkedImgUrl + ')' : 'url(' + item.uncheckedImgUrl + ')'}"  @click="goNav(item)">
            </li>
        </ul>
        <!-- 分会场菜单选项 -->
        <div class="bottomnav__mask" v-show="showBranchMenu">
            <div class="bottomnav__menu">
                <span class="bottomnav__menu__btn" @click="showBranchMenu=false"></span>
                <ul :style="{'background-color': '#' + branchMeet.bgColor}">
                    <li v-for="(item,index) in branchMeet.imgList" :key="index">
                        <a :href="item.jumpUrl">
                            <axd-image :src="item.imgUrl"></axd-image>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'bottomnav',
    props: {
        config: Object
    },
    components: {
        axdImage
    },
    data() {
        return {
            checkedIndex: 0, // 选中导航tab的下标值
            showBranchMenu: false,
            navList: [],
            branchMeet: []
        }
    },
    created() {
        this.navList = this.config.objExtJson.navList

        if (this.config.objExtJson.branchMeet) {
            this.branchMeet = this.config.objExtJson.branchMeet
        }
    },
    methods: {
        goNav(nav) {
            // this.checkedIndex = e.target.dataset.index
            // let nav = this.navList[this.checkedIndex]
            if (nav.isBranchMeet) {
                // 如果是分会场则展开分会场
                this.showBranchMenu = true
            } else {
                // 跳转到对应链接
                window.location.href = nav.jumpUrl 
            }
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/style.scss';
#pageContent {
    padding-bottom: px2rem(100);
}
.bottomnav {
    &__tabs {
        z-index: 9;
        position: fixed;
        width: 100%;
        height: px2rem(100);
        left: 0;
        bottom: 0;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        li {
            flex: 1;
            height: 100%;
            background-position: center center;
            background-size: 100% 100%;
        }
    }
    &__menu {
        z-index: 9;
        position: fixed;
        left: 0;
        bottom: px2rem(100);
        width: 100%;

        &__btn {
            position: absolute;
            right: px2rem(10);
            top: px2rem(-75);
            width: px2rem(58);
            height: px2rem(58);
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA5CAMAAAC/M6OKAAAAnFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+TINBkAAAAM3RSTlMABAgMrPGIWfrqkIt/FeGwJRvStNbNo3kt3MO8t5VWMBDzp4RqyJpyZElu99icXUBVQ89namd3AAACiklEQVRIx6VX63qqMBDcgEARqHKp1l5Ee9FqW20P7/9uZ8DGFLIhfHX+SLIZSXZ2NwvxSINokoVe5YXZJApSGozSX1RtLPxyCFEENxWHm0DYqMF1s9LL42WZuOQm5TLOvWbuOuhl3t5VwHq2E+297Gbr2nB3a6a+vGNBOF8xptU8hO39xcB0RrBe+a7B7PpXsI8czrZ6rT0yJTOmtRdfmV0lBQxjh/rgjLGmSLS3ZtjvG9mwr9/sdlS9B/WL7Ahw6Pu2Cj7+T/MhrwVWxr8njpiIaBgi7PCohs4HdBcDuQLx86F8OkcQ/uTKmzdyePE96ckUITo/y4PB9ucZEj44DPUB2svBFmErhYohmjjPgyy0fYJabc+j4uwuB5F6IIlnrMpFh5pj8lmND4h69yQZ0ktQizwRLeqkTSWBRD0lZI4ddLUeiQ7VlyN5yrzJD0TKtK1giyxGuvhTaFxveldVGbUxlmRJHVMHiP5ds0WYGPKTaKhPHJWi0ymQBUviyUYqLZER+IHPmDL0CM5MiBl+HrnCBm2gLqwOGcgGqmSl0Jk4bKoGG2KBeEprdy9482dN/SQeCwhb7zz7AzeDl7T3snvm36udl/UVf17Oz3aNJKvW1xIbvL4yrliqOZzpC3HFx3PUzYWIi2c2j+w5SP+QRyp/+cKhcp/NX8pVybTWHFWUc6ZexaZaF3P1yg3lE7A319j97+wNXa0+W2q7Vp8pWcvCbb1T1L2g30d2qPvo8nuQjkpBK/z6/r3g3r+437i8z1H9leh3E99fgdx0bb19XdP5JZzJHdRPun/uY/fW/nnz3emfvzd8/2zv2yd6385DHLKKQ3YYFLRlpH2nRGUfQf8+Kprvo8L8ffQfNHiCDVCPe0gAAAAASUVORK5CYII=) 0 center no-repeat;
            background-size: 100%;
        }
        ul {
            background-color: #ffffff;
            border-bottom: px2rem(1) solid #EEEEEE;

            display: flex;
            display: -webkit-flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            padding: px2rem(25) px2rem(25) px2rem(15);
            li {
                width: px2rem(347);
                height: px2rem(154);
                margin-bottom: px2rem(6);
            }
        }
    }
    .bottomnav__mask {
        z-index: 8;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
    }
}
</style>
