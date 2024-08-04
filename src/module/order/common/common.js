export const filterStatus = (code, trade, extType) => {
    if (code === 'WAIT_BUYER_PAY' && trade.bizType === 'ENDPAY') {
        code = 'WAIT_BUYER_PAY_END'
    }
    if (code === 'WAIT_SELLER_SEND_GOODS' && extType === 'MOVIE') {
        code = 'WAIT_FOR_TICKET'
    }
    if (trade.audit == 'audit') {
        code = 'ORDER_REVIEW'
    }

    return {
        WAIT_PAY_RETURN: '订单待提交',
        WAIT_BUYER_PAY: '订单待付款',
        WAIT_SELLER_SEND_GOODS: '订单待发货',
        TRADE_BUYER_SIGNED: '订单交易成功',
        WAIT_BUYER_CONFIRM_GOODS: '订单待收货',
        TRADE_CLOSED: '交易关闭',
        TRADE_CLOSED_BY_USER: '交易关闭',
        TRADE_REFUND: '付款后关闭',
        WAIT_TEAM_BUY: '拼团中',
        WAIT_FOR_TICKET: '等待出票',
        WAIT_BUYER_PAY_END: '订单待付尾款',
        ORDER_REVIEW: '订单审核中',
        PART_OF_THE_SHIPMENT: '订单部分发货'
    }[code]
}
