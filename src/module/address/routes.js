const { routesProduct } = require('./routes-product')
const addressRouter = routesProduct('/pages/address', 'address')
const confirmAddress = routesProduct('/pages/trade/confirm/address', 'confirm')

export {
    confirmAddress,
    addressRouter
}
