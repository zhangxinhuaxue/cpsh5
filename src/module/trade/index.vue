<template>
    <div>
        <h1>Hello trade!</h1>
        <p>
            <router-link :to="{name:'confirm'}" append>确认订单</router-link>
            <router-link :to="{name:'product', params: { productId: 123 }}" append>实物</router-link>
            <router-link :to="{name:'productList'}" append>商品列表</router-link>
            <router-link :to="{name:'virtualDetail', params: {productId: 111}}" append>虚拟</router-link>
            <router-link :to="{name:'telrecharge', params: {productId: 9000993}}" append>话费</router-link>
            <router-link :to="{name:'movieConfirm', params: {orderId: 9000993}}" append>第三方电影订单</router-link>
        </p>
    </div>
</template>
<script>
export default {

    name: 'index',

    data() {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
a {
    display: block;
}
</style>
