<!--
@author wusong
@createTime 2018-12-26
@param ctype: 列表类型
@param dt: 列表数据
@param isCustomGo: 点击商品是否自定义跳转
-->
<template>
    <div class="product-wrap">
        <div class="product-list" :class="ctype">
            <ul>
                <li v-for="(item,index) in dt" :key="index">
                    <product :ctype="ctype" :pdata="item" :isCustomGo="isCustomGo" @customGo="customGo"></product>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import product from './coms/product.vue'
export default {
    props: {
        ctype: {
            type: String,
            default: 'c2'
        },
        dt: Array,
        isCustomGo: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        customGo(url) {
            this.$emit('fnCustom', url)
        }
    },
    components: {
        product
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
//一排一个样式
.product-list.c1 {
    padding: 0 px2rem(24);
    background-color: #fff;
    ::v-deep ul {
        li{
            height: px2rem(305);
            padding: px2rem(32) 0;
            border-bottom: px2rem(1) solid #ECECEC;
            a{
                display: flex;
                width: 100%;
            }
        }
        .product-img{
            width: px2rem(240);
            height: px2rem(240);
        }
        .product-info{
            width: px2rem(462);
            padding-left: px2rem(24);
            .product-info__top{
                height: px2rem(164);
            }
            .desc{
                max-height: px2rem(72);
                line-height: px2rem(36);
                font-size: px2rem(28);
            }
            .stage{
                height: px2rem(40);
                line-height: px2rem(40);
                font-size: px2rem(24);
                span{
                    em{
                        font-size: px2rem(32);
                    }
                }
            }
            .discount{
                height: px2rem(64);
                line-height: px2rem(64);
                .discount-tag1{
                    height: px2rem(32);
                }
                .discount-tag{
                    height: px2rem(32);
                    line-height: px2rem(32);
                }
            }
            .price{
                height: px2rem(28);
                line-height: px2rem(28);
                margin-top: px2rem(8);
            }
        }
    }  
}
//一排两个样式
.product-list.c2{
    padding: 0 px2rem(24);
    ::v-deep ul {
        display: flex;
        flex-wrap:wrap;
        justify-content:space-between;
        li{
            width: px2rem(343);
            // height: px2rem(563);
            margin-top: px2rem(16);
            background-color: #fff;
            border-radius: px2rem(4);
        }
        .product-img{
            width: 100%;
            height: px2rem(343);
        }
        .product-info{
            padding: px2rem(16);
            overflow: hidden;
            .product-info__top{
                height: px2rem(114);
            }
            .desc{
                max-height: px2rem(64);
                line-height: px2rem(32);
                font-size: px2rem(24);
            }
            .stage,.price{
                height: px2rem(36);
                line-height: px2rem(36);
            }
            .stage{
                font-size: px2rem(22);
                span{
                    em{
                        font-size: px2rem(28);
                    }
                }
            }
            .price{
                p:last-child{
                    font-size: px2rem(20);
                    color: #A1A1A1;
                }
            }
        }
    }
}
//一排三个样式
.product-list.c3{
    ::v-deep ul {
        width: px2rem(717);
        display: flex;
        flex-wrap:wrap;
        margin: 0 auto;
        li{
            width: px2rem(223);
            height: px2rem(396);
            margin: px2rem(16) px2rem(8) 0;
            background-color: #fff;
        }
        .product-img{
            width: 100%;
            height: px2rem(223);
        }
        .product-info{
            padding: px2rem(16);
            overflow: hidden;
            .product-info__top{
                height: px2rem(78);
            }
            .desc{
                height: px2rem(32);
                line-height: px2rem(32);
                font-size: px2rem(24);
                color: #424243;
                overflow: hidden;
            }
            .stage{
                height: px2rem(36);
                line-height: px2rem(36);
                font-size: px2rem(22);
                span{
                    em{
                        font-size: px2rem(28);
                    }
                }
            }
            .price{
                height: px2rem(26);
                line-height: px2rem(26);
                p:last-child{
                    font-size: px2rem(20);
                }
            }
        }
    }
}
</style>


