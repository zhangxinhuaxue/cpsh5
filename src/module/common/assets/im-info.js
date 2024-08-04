/**
 *
 * @author:      sunxj
 * @dateTime:    2018-02-02 15:10:08
 * @description: 联系客服获取基本信息
 * param {
 *      platfrom: string 来源  aicai
 *      refUserId: string 用户ID
 *      refMerchantId: string 商家ID
 * }
 * isOff: string 是否是下架商品
 *
 */
import { AXD } from 'libs/util'
import { getImMerchantInfo } from 'src/store/modules/trade/product'

export const getMerchantInfoByKey = (param) => {
    return new Promise((resolve, reject) => {
        getImMerchantInfo(param).then((data) => {
            let info = {}
            let IMtype = 'callphone'
            if (data.success && data.result) {
                // console.log(data.result + '=====IM')
                // 请求的基本信息传入配置文件
                let result = data.result
                info.sdkParams = {
                    siteid: result.siteId || '', // 平台基础id
                    sellerid: result.imMerchantId || '', // 商户id，平台中不需传递此参数，商家需传递此参数
                    settingid: result.talkersSettingId || '', // Ntalker分配的缺省客服组id，平台客服组用平台的settingid，商家客服组用商家的settingid
                    uid: result.userId || '', // 用户ID，未登录可以为空，但是不能给null，uid赋予的值在显示到小能客户端
                    uname: result.userName || '户名', // 用户名，未登录可以为空，但是不能给null，uname赋予的值显示到小能客户端
                    userlevel: '0' // 用户级别,1为vip用户,0为普通用户
                }

                // activeHandle判断
                if (result.isAdaptApp === 'y') { // 原生适配
                    // app内调用原生协议
                    if (AXD.util.isapp()) {
                        IMtype = 'appim'
                        // this.IMtype = 'apph5im'
                        // 否则调用h5
                    } else {
                        IMtype = 'h5im'
                    }
                } else { // H5
                    // this.IMtype = 'h5im'
                    if (AXD.util.isapp()) {
                        IMtype = 'apph5im'
                    } else {
                        IMtype = 'h5im'
                    }
                }
                // resolve(sdkParams)
                // console.log(this.IMtype + '======im类型')
            } else {
                // 异常，打电话
                IMtype = 'callphone'
                if (data.resultDes) {
                    console.log(data.resultDes)
                } else {
                    console.log('IM 客服接口数据返回异常，请查看接口返回信息~')
                }
            }
            info.IMtype = IMtype
            // app客服 && 打电话 && 商品下架，不加载sdk
            // if (IMtype != 'appim' && IMtype != 'callphone' && !isOff) {
            //     // loadInit('ac_1000')
            //     core.loadSdk('ac_1000')
            // }
            resolve(info)
        })
    })
}
