<!--  created by zhouqing -->
<template>
    <div>
        <div v-for="(item,index) in list" class="product">
            <div class="product__hd">
                <axd-image :src="item.imgUrl" :lazy="false" imgClass="product-img" :resizeW="127"></axd-image>
            </div>
            <div class="product__bd">
                <p class="product__bd_name">{{item.productName}}</p>
                <p class="product__bd_skuname">{{item.skuName}}</p>
                <span class="presale-tag" v-if="item.storageMode==2">预售</span>
            </div>
            <div class="product__ft">
                <p>¥{{item.price|formatNum}}</p>
                <span>X{{item.num}}</span>
            </div>
        </div>
        <!--         <div class="aui-cell_auto product-info" v-for="(item,index) in list">
            <div class="aui-cell__hd">
                <axd-image :src="item.imgUrl" :lazy="false" imgClass="product-img"></axd-image>
            </div>
            <div class="aui-cell__bd">
                <p class="product-info__name">{{item.productName}} <span>¥{{item.price|formatNum}}</span></p>
                <p class="subhead">{{item.skuName}}<span>X{{item.num}}</span></p>
                <span class="presale-tag" v-if="item.storageMode==2">预售</span>
            </div>
        </div> -->
    </div>
</template>
<script>
/* 组件库 */
import axdImage from 'components/image/index.vue'
export default {
    name: 'product',
    props: {
        info: Object
    },
    computed: {
        list() {
            return this.info.carts
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.fr {
    float: right;
}

.presale-tag {
    display: inline-block;
    min-width: px2rem(56);
    text-align: center;
    padding: px2rem(1) px2rem(12) 0;
    margin-top: px2rem(4);
    font-size: px2rem(20);
    color: #fff;
    background: #8C50FF;
    border-radius: px2rem(16);
}

.product {
    display: flex;
    justify-content: space-between;
    padding: px2rem(30);
    color: #222;

    .product__hd {
        width: px2rem(127);
        height: px2rem(127);
        border: px2rem(1) solid $auiLineColorLight;
        overflow: hidden;

        div,
        img {
            width: 100%;
            height: 100%;
        }
    }

    .product__bd {
        flex: 1;
        padding: 0 px2rem(50) 0 px2rem(24);
        line-height: px2rem(32);

        .product__bd_name {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: px2rem(26);
            margin-bottom: px2rem(8);
        }

        .product__bd_skuname {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: px2rem(24);
            color: #999;
            margin-bottom: px2rem(8);
        }
    }

    .product__ft {
        p {
            margin-bottom: px2rem(40);
        }

        span {
            display: block;
            text-align: right;
        }
    }
}

// .product-info {
//     padding: px2rem(32);
//     -webkit-box-align: start;
//     -webkit-align-items: flex-start;
//     align-items: flex-start;
//     &:before {
//         width: px2rem(570);
//         left: auto;
//     }
//     .aui-cell__hd {
//         width: px2rem(127);
//         height: px2rem(127);
//         border: px2rem(1) solid $auiLineColorLight;
//         overflow: hidden;
//         div,
//         img {
//             width: 100%;
//             height: 100%;
//         }
//     }
//     .aui-cell__bd {
//         font-size: $auiFontSizeLevel7;
//         padding-left: px2rem(30);
//         padding-top: px2rem(6); // line-height: px2rem(29);
//     }
//     .product-info__name {
//         display: -webkit-box;
//         padding-right: px2rem(153); // height: px2rem(60);
//         -webkit-line-clamp: 2;
//         -webkit-box-orient: vertical;
//         overflow: hidden;
//         margin-bottom: px2rem(10);
//         font-size: px2rem(26);
//         line-height: 1.3;
//         position: relative;
//         span {
//             position: absolute;
//             top: px2rem(0);
//             right: px2rem(0);
//         }
//     }
//     .subhead {
//         display: -webkit-box;
//         padding-right: px2rem(153);
//         height: px2rem(60);
//         -webkit-line-clamp: 2;
//         -webkit-box-orient: vertical;
//         overflow: hidden;
//         font-size: px2rem(24);
//         position: relative;
//         margin: px2rem(10) auto;
//         color: $auiTextColorAssistant;
//         line-height: 1.3;
//         padding-top: px2rem(10);
//         span {
//             position: absolute;
//             top: px2rem(0);
//             right: px2rem(0);
//             color: $auiTextColorImportant;
//             font-size: px2rem(26);
//         }
//     }
// }
</style>
