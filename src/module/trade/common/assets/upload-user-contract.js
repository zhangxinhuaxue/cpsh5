import { uploadUserContract } from 'store/modules/trade/confirm'

export default function uploadHandler() {
    const str = this.isApp ? '为确保您的账户安全，爱又米需要访问您的通讯录，以确认您是本人使用，否则无法分期' : '只有在爱又米APP内才能继续通讯录信息补充，请您打开或下载爱又米APP'
    const btnText = this.isApp ? '允许访问' :
        '打开爱又米APP'
    let supportContactCheck = true

    const upload = (next) => {
        next()
        // axdApp.send({
        //     module: 'permission',
        //     method: 'contactCheck',
        //     callback: (ret) => {
        //         if (ret.data && ret.data.state == '1') {
        //             axdApp.send({
        //                 module: 'tools',
        //                 method: 'uploadDeviceInfo',
        //                 params: {
        //                     event: 'event_order'
        //                 },
        //                 callback: (res) => {
        //                     if (res && res.data && res.data.ossKey) {}
        //                 }
        //             })
        //         }
        //         next()
        //     }
        // })
    }
    const update = () => {
        this.$_confirm({
            type: 'confirm',
            title: '',
            content: '您的爱又米APP当前版本较低，不支持获取通讯录授权，请升级APP',
            onCancel: () => {

            },
            onConfirm: () => {
                axdApp.send({
                    module: 'appInfo',
                    method: 'forceUpdate'
                })
            }
        })
    }
    return new Promise((resolve, reject) => {
        uploadUserContract().then(res => {
            if (res.success && !res.result) {
                this.$_alert({
                    content: str,
                    confirmBtn: btnText,
                    onMaskClick: (hide) => {
                        hide()
                    },
                    onConfirm: () => {
                        if (this.isApp) {
                            if (supportContactCheck) {
                                upload(resolve)
                            } else {
                                update()
                            }
                        } else {
                            window.location.href = aixuedai.appDownloadUrl
                        }
                    }
                })
                return
            }
            resolve()
        })
    })
}
