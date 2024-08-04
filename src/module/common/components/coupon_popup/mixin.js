import couponPop from './index'

var couponMixin = {
    data() {
        return {
            couponList: [],
            couponItem: {},
            isPop: false,
            code: '',
            useEffect: '',
            couponPopData: {
                title: '红包'
            }
        }
    },
    computed: {
        notHasCoupon() {
            return this.couponList.length === 0
        },
        couponText() {
            return this.notHasCoupon ? '无可用券' : this.couponItem.name
        }
    },
    methods: {
        setCoupon() {
            if (!this.couponList.length) {
                return
            }
            this.couponItem = this.couponList[0]
            this.couponPopData = {
                title: '优惠券',
                list: this.couponList,
                activeIndex: 0,
                notUseText: '不使用优惠券'
            }
        },
        popSelect(data) {
            this.couponItem = data
            this.couponPopData.activeIndex = data.index
            this.popDone()
        },
        popCancel() {
            this.isPop = false
        },
        popDone() {
            this.isPop = false
        },
        showCouponPop() {
            if (!this.notHasCoupon) {
                this.isPop = true
            }
        }
    },
    components: {
        couponPop
    }
}
export { couponMixin }
