// 获取缓存中的购物车的商品数量
export function getlocalCartNum() {
    let storageCartNum = 0
    let cartData = window.localStorage.cartsData ? JSON.parse(window.localStorage.cartsData) : ''
    if (cartData && cartData.mercharts) {
        let mercharts = cartData.mercharts
        mercharts.forEach(function(item, i) {
            let carts = item.carts
            storageCartNum += carts.length
        })
    }
    return storageCartNum
}
