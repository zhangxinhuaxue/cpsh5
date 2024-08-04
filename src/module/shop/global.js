// import { loadMore } from './common/assets/load-more'
import { formatLimitString } from 'src/libs/util'

const formatData = (arr) => {
    let list = []
    if (!(arr && arr instanceof Array)) {
        return list
    }

    arr.map((item) => {
        let obj = {
            id: item.id,
            goodCornerUrl: item.goodCorner ? item.goodCorner.url : '',
            imgUrl: item.imgThumb,
            tag: item.mark ? item.mark.name : '',
            isSeaAmoy: item.isSeaAmoy ? item.isSeaAmoy : '',
            name: item.name,
            price: item.minSkuPrice,
            saleImgUrl: item.saleImgUrl,
            showSumSale: item.showSumSale
        }
        list.push(obj)
    })
    return list
}

const install = (Vue, config = {}) => {
    Vue.prototype.limitString = formatLimitString
    Vue.filter('formatData', formatData)
    Vue.filter('limitString', formatLimitString)
    // Vue.directive('load-more', {
    //     bind: loadMore
    // })
}

export {
    install
}
