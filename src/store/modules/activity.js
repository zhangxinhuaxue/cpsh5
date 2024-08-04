import { _get, _post, _postPromise, _getPromise, formatRet } from '../base'

// 获取商品列表信息
export const getProdListByName = (param, callback) => {
    return _get('/plist/plistByIdOrName', param, (data) => {
        callback(formatRet(data))
    })
}

// promise获取商品列表信息
export const getPlistByIdOrName = (param) => {
    return _postPromise('/plist/plistByIdOrName', param, { showLoading: false })
}

// 领取红包
export const receiveCoupon = (param, callback) => {
    return _post('/coupon/receiveCoupon', param, (data) => {
        callback(formatRet(data, '/coupon/receiveCoupon'))
    })
}

// 领取浙江电信红包
export const receiveDXCoupon = (param, callback) => {
    return _post('/app/zjdx/receiveCoupon', param, (data) => {
        callback(formatRet(data))
    })
}

// 渠道下载APP激活统计
export const condiutDownloadCount = (param, callback) => {
    return _post('/app/sys/encodeChannel', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取抽奖次数
export const getlottoNum = (param, callback) => {
    return _post('/univeactive/lottoAjax', param, (data) => {
        callback(formatRet(data))
    })
}

// 抽奖
export const doAcitveLotto = (param, callback) => {
    return _post('/univeactive/doLotto', param, (data) => {
        callback(formatRet(data))
    })
}

// 超级比价日活动消费金额
export const leijiComsume = (callback) => {
    return _post('/univeactive/leijiComsume', null, (data) => {
        callback(formatRet(data))
    })
}

// 嗨花抽免息活动接口
export const doMianxiLottery = (callback) => {
    return _post('/graduate/active/getLottery', null, (data) => {
        callback(formatRet(data))
    })
}

// 拼团商品列表接口
export const getPintuanProdList = (param, callback) => {
    return _get('/mall/teambuy/getTeambuyList', param, (data) => {
        callback(formatRet(data))
    })
}

// 老虎机抽奖，签到抽奖接口
export const doSlotLotto = (param, callback) => {
    return _post('/slotMachine/doLotto', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取抽奖初始化信息
export const getLotteryInitInfo = (param, callback) => {
    return _get('/lottery/init', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取抽奖结果信息
export const getLotteryRun = (param, callback) => {
    return _get('/lottery/run', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取抽奖积分兑换结果
export const getLotteryExchangePoints = (param, callback) => {
    return _get('/lottery/exchange/points', param, (data) => {
        callback(formatRet(data, '/lottery/exchange/points'))
    })
}

// 获取抽奖分享增加抽奖
export const getLotteryShareAddChance = (param, callback) => {
    return _get('/lottery/share/addChance', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取美图美少女战士活动抽奖结果信息
export const getMeituLotteryRun = (param, callback) => {
    return _get('/meitu/run', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取爱豆赌博游戏下注接口
export const getGambleCompute = (param, callback, catchCallback) => {
    return _get('/gamble/compute', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback(data)
    })
}

// 游戏充值返利 获取充值金额以及领取状态接口
export const getRechargeState = (callback) => {
    return _post('/gamerecharge/getPaymentListByTime', null, (data) => {
        callback(formatRet(data))
    })
}

// 游戏充值返利 点击领取按钮接口
export const takeRebate = (param, callback) => {
    return _post('/gamerecharge/receiveCoupon', param, (data) => {
        callback(formatRet(data))
    })
}

// 主会场获取点赞数据
export const getProductPreheat = (param, callback, catchCallback) => {
    return _get('/productPreheat/query', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback(data)
    })
}

// 主会场用户点赞
export const submitProductPreheat = (param, callback, catchCallback) => {
    return _get('/productPreheat/submit', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback(data)
    })
}

// 锯开老虎机：分享完毕后，增加锯开机会
export const addSawChance = (param, callback, catchCallback) => {
    return _get('/slotMachineSaw/addChance', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 锯开老虎机：奖励选择
export const sawChooseAward = (param, callback, catchCallback) => {
    return _get('/slotMachineSaw/chooseAward', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 锯开老虎机：领取奖励
export const receiveAward = (param, callback, catchCallback) => {
    return _get('/slotMachineSaw/receiveAward', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 锯开老虎机：奖励机会查询
export const queryChance = (param, callback, catchCallback) => {
    return _get('/slotMachineSaw/queryChance', param, (data) => {
        callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 浙商米卡预约活动：获取预约人数
export const biubiubiuShow = (param, callback, catchCallback) => {
    return _post('/biubiubiu/show', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 浙商米卡预约活动：预约
export const biubiubiuYuyue = (param, callback, catchCallback) => {
    return _post('/biubiubiu/yuyue', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 邀请好友2.0我的资金明细页面：获取赚钱列表
export const getInviteFriendList = (param, callback, catchCallback) => {
    return _get('/invite/getInviteFriendList', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 邀请好友2.0我的资金明细页面：获取提现列表
export const getTransferList = (param, callback, catchCallback) => {
    return _get('/invite/getTransferList', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 开宝箱活动：初始化
export const kaibaoxiangInit = (param, callback, catchCallback) => {
    return _post('/lottery/initForBox', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 开宝箱活动：抽奖
export const kaibaoxiangRun = (param, callback, catchCallback) => {
    return _post('/lottery/runForBox', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 九月取点花全民提额活动
export const sepIncrease = (callback, catchCallback) => {
    return _post('/carry/credit/raise', null, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 装备记忆大师，领取红包，并返回红包信息
export const receiveCouponRtnCoupon = (param, callback, catchCallback) => {
    return _post('/coupon/receiveCouponRtnCoupon', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 装备记忆大师，查询用户所有红包信息
export const memroyGetCouponList = (param, callback, catchCallback) => {
    return _post('/coupon/memroyGetCouponList', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// 邀请好友，页面初始化
export const inviteFriends = () => {
    return _postPromise('/invite/getUserInfo', null, { showLoading: true })
}

// 邀请好友，邀请人信息
export const getFriendsInfo = (param) => {
    return _postPromise('/invite/getMyInviteInfoList', param, { showLoading: false })
}

// 邀请好友，取现
export const getEncashment = () => {
    return _postPromise('/invite/withdraw', null, { showLoading: true })
}

// 邀请好友，获取结果值
// export const getTransferRecord = () => {
//     return _postPromise('/invite/getTransferRecordJson', null, { showLoading: false })
// }

// iphone8活动: 获取预约人数
export const getOrderCount = (param, callback, catchCallback) => {
    return _post('/invitationLetter/show', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// iphone8活动: 预约接口
export const iphoneOrder = (param, callback, catchCallback) => {
    return _post('/invitationLetter/reserve', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}

// iphone8活动: 获取姓名
export const iphoneGetName = (param, callback, catchCallback) => {
    return _post('/invitationLetter/getName', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback(data)
    })
}


// 双十一预热活动：根据红包token获取库存
export const getCouponRepertory = (param, callback, catchCallback) => {
    return _post('/double11preheat/couponRepertory', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 双十一预热活动：领取红包
export const receiveDouble11Coupon = (param, callback, catchCallback) => {
    return _post('/double11preheat/receiveCoupon', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 双十一预热活动：根据商品列表ID获取商品列表数据
export const getPreHeatProductList = (param, callback, catchCallback) => {
    return _post('/double11preheat/list', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 双十一预热活动：我的预约
export const getMyReservations = (param, callback, catchCallback) => {
    return _post('/double11preheat/reservations', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 双十一预热活动：预约
export const postReserve = (param, callback, catchCallback) => {
    return _post('/double11preheat/reserve', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 签到
export const doScoreTask = (callback, catchCallback) => {
    return _post('/app/scoretask/doscoretask?taskSign=signed', {}, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 获取签到状态
export const getSignRecord = (callback, catchCallback) => {
    return _get('/activeSign/getSignRecord', {}, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 2018新年薅狗毛活动，根据红包数目拆红包接口
export const receiveCouponByNum = (param, callback, catchCallback) => {
    return _get('/newYear/receiveCoupon', param, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 2018新年薅狗毛活动，获取用户在游戏中获得所有红包
export const getCouponList = (callback, catchCallback) => {
    return _get('/newYear/getCouponList', {}, (data) => {
        callback && callback(formatRet(data))
    }, (data) => {
        catchCallback && catchCallback()
    })
}

// 公用获取服务器时间
let sysTimeUrl = (window.aixuedai.isUavoApp === 'y') ? '/app/common/getNow' : '/common/getNow'
export const getSysTime = (param) => {
    return _getPromise(sysTimeUrl, param, { showLoading: false })
}

// 获取秒杀红包列表接口 参数:templateId
export const getSeckillCoponList = (param) => {
    return _postPromise('/limitSeckill/getSeckillCouponList', param, { showLoading: true })
}

// 获取秒杀红包列表接口 参数:templateId,couponId
export const getNextSeckillCoponInfo = (param) => {
    return _postPromise('/limitSeckill/getSeckillCouponNextEntryInfo', param, { showLoading: true })
}

// 秒杀红包接口
export const revieveSeckillCoupon = (param) => {
    return _postPromise('/coupon/receiveSeckillCoupon', param, { showLoading: true })
}

// 摇钱树任务 参数:taskType: double_eleven_share
// 任务类型，分享-double_eleven_share，浏览-double_eleven_view
export const taskFinish = (param) => {
    return _postPromise('/cointree/task/finish', param, { showLoading: true })
}
// let newProductListUrl = (window.aixuedai.isUavoApp == 'y') ? '/app/plist/commonActivityProductList' : '/plist/commonActivityProductList'
export const newProductList = (param) => {
    return _postPromise('/app/plist/commonActivityProductList', param, { showLoading: true })
}

// cms串码
export const p0Data = (param) => {
    return _postPromise('/p0/data', param, { showLoading: true })
}

// 活动提额 参数：活动页面的alias
export const getCreditInfo = (param) => {
    return _postPromise('/activity/credit/increase', param, { showLoading: true })
}

// 活动提额领取红包 参数：活动页面的serialNo  couponId
export const actReceiveCoupon = (param) => {
    return _postPromise('/activity/credit/receiveCoupon', param, { showLoading: true })
}
