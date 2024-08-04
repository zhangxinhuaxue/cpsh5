import { getTrafficUrl } from '@/store/modules/syh'

export default{
    methods:{
        handleClick({trafficId  = '', isNeedAuth = false, productName = ''}) { 
            this.log({ type: 'button-logic', name: 'syh-click', desc: '点击去申请按钮' }) 

            let  params = {
                trafficId,
                positionCode: this.positionCode
            }
            if(!isNeedAuth){
                this.goTrafficUrl(params)
                return
            }
            this.log({ type: 'button-logic', name: 'syh_dialog', desc: '显示授权弹窗' }) 
            this.$_confirm({
                type: 'confirm', 
                content: `您将申请由<b>"${productName}"</b>提供的借款服务<br>  <span  style="color:#666;font-size:12px;">我们将会将您的注册手机号授权给对方<br>招集令承诺不会将您的其他信息进行外泄</span>`,
                confirmBtn: '申请借款',
                cancelBtn: '取消',
                onConfirm: () => {
                    this.log({ type: 'button-logic', name:'syh_button_auth', desc: '确定授权' }) 
                    this.goTrafficUrl(params)
                }
            })
        },
        goTrafficUrl(params = {}){
            getTrafficUrl(params).then(res=>{
                if(res.success){
                    const logName = {
                        // products:产品列表页  creditFail:授信失败  auto:auto页面
                        products: 'productlist-button-goandapply',
                        auto: 'autopage-button-goandapply',
                        creditFail: 'creditfailure-button-goandapply'
                    }[this.positionCode] || 'randomflowers-button-goandapply'
        
                    this.log({ type: 'button-link', name:logName, desc: '去申请按钮' }) 
                    this.resetHref(res.result) 

                    return
                }
                this.$_toast(res.resultDes)
            })
        }
    }
}

 