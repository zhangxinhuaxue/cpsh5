<template>
    <div class="aui-page">
        <div class="aui-content module__box">
            <!--  <ul>
                <li>
                    <a href="javascript:;" class="aui-btn aui-btn_primary" @click="login">登录</a>
                </li>
            </ul> -->
            <section v-for="(value, key) in appObj" class="module__list" :key="key">
                <h4>{{key}}</h4>
                <p @click="toggle(key)">
                    {{value.desc}}
                    <!-- <a href="javascript:;" class="aui-btn  " @click="toggle(key)">显示/折叠</a> -->
                </p>
                <div class="aui-cells" v-show="value.isShow">
                    <a v-for="(svalue, skey) in value.methods" :key="skey" @click="callApp(key,skey,svalue.params,svalue.callback)" class="aui-cell aui-cell_access" href="javascript:;">
                        <div class="aui-cell__bd">
                            <p>{{skey}}</p>
                        </div>
                        <div class="aui-cell__ft">
                        </div>
                    </a>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import axdAlert from 'components/alert/index'
const shareObj = {
    title: '分享标题',
    info: '分享内容',
    img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2846083149,3165976842&fm=27&gp=0.jpg',
    url: '分享跳转URL'
}
const creditObj = {
    callInfo: 'this is test cards',
    callCode: 1,
    callbackUrl: 'http://www.aiyoumi.com'
}

const storageObj = {
    key: 'key1'
}

const testURL = 'http://192.168.4.102:9999/mock/requestOnServer.do?url=http%3A%2F%2F127.0.0.1%3A9998%2Fmockjs%2F145%2Fmall%2Fcart%2Fadd%3F'

let appObj = {
    device: {
        desc: '设备模块，提供设备相关信息，如设备型号、操作系统版本等',
        methods: {
            getUUID: {
                desc: '获取设备唯一标识UUID',
                params: {}
            },
            getInfo: {
                desc: '获取设备信息'
            },
            getNetworkType: {
                desc: '  获取设备当前的网络类型'
            }

        }
    },
    appInfo: {
        desc: 'App信息模块，提供App相关信息，如版本号之类',
        methods: {
            getVersion: { desc: '获取APP当前版本号' },
            forceUpdate: {
                desc: '触发APP强制升级',
                params: {
                    tipMessage: '强制升级对话框上的提示信息'
                }
            }
        }
    },
    tools: {
        desc: '工具模块，提供分享、定位、扫码、拍照，选照片，上传等功能',
        methods: {
            share: { // TODO: 分享到qq没有回调
                desc: '调用APP的综合分享面板分享',
                params: shareObj
            },
            shareWithChannels: {
                desc: '调用APP的综合分享面板分享,可自定义分享渠道',
                params: {
                    channel: ['ShareT_SinaWeibo',
                        'ShareT_QZone',
                        'ShareT_QQ',
                        'ShareT_WxSession',
                        'ShareT_WxTimeline',
                        'ShareT_SMS',
                        'ShareT_QRCode'
                    ],
                    ...shareObj
                }
            },
            shareQQ: { desc: '直接分享到QQ好友', params: shareObj },
            shareQZone: { desc: '直接分享到QQ空间', params: shareObj },
            shareSinaWeibo: { desc: '直接分享到新浪微博', params: shareObj },
            shareWxSession: { desc: '直接分享到微信好友', params: shareObj },
            shareWxTimeline: { desc: '直接分享到微信朋友圈', params: shareObj },
            shareSMS: { desc: '直接短信分享', params: shareObj },
            getLocationInfo: { desc: '获取当前的定位信息' },
            getLocationStatusInfo: { desc: '获取当前的定位信息以及定位授权状态' },
            scanOpenURL: { desc: '扫描二维码并跳转URL(二维码的内容是URL)' },
            scanQRCode: { desc: '扫描二维码并得到扫描信息' },
            scanBarCode: { desc: '扫描条形码并得到扫描信息' },
            get: {
                desc: '发送GET请求并得到请求结果（可解决跨域问题）',
                params: {
                    url: testURL
                }
            },
            post: {
                desc: '发送POST请求并得到请求结果（可解决跨域问题）',
                params: {
                    url: testURL,
                    params: {
                        aa: '',
                        bb: ''
                    }
                }
            },
            hudMessage: {
                desc: '调用原生HUD显示信息（3秒自动消失）',
                params: {
                    msg: '需要显示的信息'
                }
            },
            hudError: {
                desc: '调用原生HUD显示错误（3秒自动消失）',
                params: {
                    msg: 'error信息'
                }
            },
            hudStartLoading: {
                desc: '调用原生HUD显示加载动画,2s后隐藏',
                params: {
                    msg: 'loading'
                },
                callback: () => {
                    console.log(this.callApp)
                    setTimeout(() => {
                        axdApp.send({
                            module: 'tools', // 模块名
                            method: 'hudStopLoading', // 方法名
                            callback: function(data) { // 回调函数
                                console.log(data)
                            }
                        })
                    }, 2000)
                }
            },
            // hudStopLoading: { desc: '关闭原生HUD加载动画' },
            hudLoading: { // TODO: 并没有消失，，，，
                desc: '调用原生HUD显示加载动画（可设置时间间隔自动消失）',
                params: {
                    msg: '正在加载',
                    duration: 5
                }
            },
            log: {
                desc: '写调试日志',
                params: {
                    logMsg: '日志内容，，，'
                }
            },
            sendSMS: {
                desc: '发短信',
                params: {
                    phone: '4008671888',
                    sms: '短信内容'
                }
            },
            uploadWithPickImage: { // TODO:
                desc: '上传图片-通过选择照片',
                params: {
                    url: '上传服务接口URL', // 上传服务接口URL（注：需遵循返回结果为JSON）
                    filekey: 'filekey', // 上传的filekey,可为空
                    pscheck: false, // 是否开启PS处理痕迹检测
                    pscheckList: [], // PS处理痕迹检测的标识列表
                    facedetect: false, // 是否开启人脸检测功能
                    minface: 2 // 如果开启人脸检测功能，则图片中检测到的人脸数必须>=此值才通过
                }
            },
            uploadWithTakePhoto: { // TODO:
                desc: '上传图片-通过拍照',
                params: {
                    url: '上传服务接口URL', // 上传服务接口URL（注：需遵循返回结果为JSON）
                    filekey: 'filekey', // 上传的filekey,可为空
                    facedetect: false, // 是否开启人脸检测功能
                    minface: 2 // 如果开启人脸检测功能，则图片中检测到的人脸数必须>=此值才通过
                }
            },
            pickContacts: { desc: '选择联系人' },
            showRewardVideo: {
                desc: '显示激励视频',
                params: {
                    watchId:  '123456',
                    startTime: new Date().getTime() / 1000,
                    positionId: '1349991098822443084', // 安卓
                    channelNum: '',
                    channelVersion: ''
                }
            },
            customerService: {
                desc: 'IM客服', // 以下参数可为空，为空时默认招集令平台客服
                params: {
                    refMerchantId: '1234', // 商家ID
                    platform: 'h5', // 平台来源
                    productId: '16612' // 商品id
                }
            },
            cacheImages: {
                desc: '缓存图片',
                params: {
                    imgUrls: []
                }
            },
            action: { // TODO:
                desc: '后台下发协议 传给客户端',
                params: {
                    url: ''
                }
            }
        }
    },
    user: {
        desc: '用户模块，提供用户相关信息以及登录、注册等方法',
        methods: {
            getInfo: {
                desc: '获取用户信息'
            },
            isLogin: {
                desc: '获取用户是否登录'
            },
            login: {
                desc: '登录',
                params: {
                    // type: 0,
                    phone: '132322233' // TODO: 传了没用。但是个必填项
                }
            },
            reLogin: {
                desc: '强制重新登录(clearMode在 >= 4.0.0支持)',
                params: {
                    type: 0, // 首选登录方式 0: 账号密码登录，1: 短信快速登录
                    phone: '1232312',
                    clearMode: 0 // clearMode: 1:会清空web的cache，用户信息，cookies, 0: 会清空用户信息，cookies
                }
            }
        }
    },
    webview: {
        desc: '浏览器模块，提供如后退，刷新，设置导航栏等',
        methods: {
            goBack: { desc: '后退' },
            refresh: {
                desc: '刷新',
                params: {
                    joinLoginInfo: true // 刷新时是否需要加入爱学贷用户登录信息
                }
            },
            close: { desc: '关闭当前浏览器窗口' },
            holdClose: {
                desc: '当前浏览器窗口关闭拦截',
                params: {
                    msg: '你确定要离开此页面巴拉巴拉....?', // 提示消息
                    cancelButton: '取消', // 取消按钮文字
                    confirmButton: '确定', // 确定按钮文字
                    closeAction: true, // 用户确定关闭当前窗口后是否需要跳转一个URL
                    actionUrl: 'http://www.aiyoumi.com' // 用户确定关闭当前窗口后要跳转的URL
                }
            },
            historyClear: { desc: '清除当前浏览器窗口导航历史' },
            setTitle: {
                desc: '设置当前浏览器自定义标题(不设置的话浏览器会自动取HTML里<title></title>中的标题)',
                params: {
                    title: '自定义标题'
                }
            },
            configNavigationBar: {
                desc: '配置当前浏览器导航栏（其中的 leftbuttonVisible 和 leftbuttonAction参数从 APP Version >= 3.3.7 开始支持，rightbuttonVisible 参数从 APP Version >= 3.5.0开始支持，rightbuttonInfo 参数从 APP Version >= 3.5.9开始支持）shareInfo中channel参数从 APP Version >= 4.0.6开始支持',
                params: {
                    visible: true, // 是否可见
                    color: '#ffffff', // 导航栏颜色
                    leftbuttonVisible: true, // 导航栏左（返回）按钮是否显示(App默认显示)
                    leftbuttonAction: 'onBack', // 导航栏左（返回）按钮点击时执行的JS函数名,如需处理特殊逻辑可赋值并实现该函数,为空则APP浏览器执行默认的 history.back
                    rightbuttonVisible: true, // 导航栏右按钮是否显示(App默认显示)
                    rightbutton: 'close', // 导航栏右按钮类型 close: 关闭按钮；share: 分享按钮；custom: 自定义右侧按钮
                    shareInfo: { // 当导航栏右按钮为分享按钮时的分享内容
                        channel: ['ShareT_SinaWeibo',
                            'ShareT_QZone',
                            'ShareT_QQ',
                            'ShareT_WxSession',
                            'ShareT_WxTimeline',
                            'ShareT_SMS',
                            'ShareT_QRCode'
                        ],
                        ...shareObj
                    },
                    rightbuttonInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: '展示类型', // TEXT:文字 IMAGE:图片
                        imageUrl: 'icon地址', // 图片地址 showType=IMAGE
                        textColor: '文字颜色 ', // #ff00000颜色 showType=TEXT
                        text: '文字内容 ', // 展示文字内容 showType=TEXT
                        action: '点击动作' // 点击右侧按钮执行的js函数名
                    }
                }
            },
            setNativeRefreshEnable: {
                desc: '设置当前浏览器原生下拉刷新功能是否有效（仅支持 iOS）',
                params: {
                    enable: true
                }
            },
            setRightCloseBtnStatus: {
                desc: '设置浏览器头部不是原生时右侧x按钮状态',
                params: {
                    showClose: true
                }
            }
        }
    },
    security: {
        desc: '安全模块，提供设置支付密码、忘记密码等功能调用',
        methods: {
            setPayPassword: { desc: '设置支付密码' },
            resetPayPassword: { desc: '重置支付密码' }
            // bindPhoneCanReceiveCode: { desc: '手机能接收短信验证绑定方式入口' },
            // bindPhoneUnableReceiveCode: { desc: '手机无法接收短信绑定方式入口' }
        }
    },
    credit: {
        desc: '认证授信模块，提供认证授信等相关功能调用',
        methods: {
            showCertification: {
                desc: '调用认证',
                params: creditObj
            },
            showCreditBase: { desc: '调用基础授信', params: creditObj },
            showCreditBase2: { desc: '调用毕业生基础', params: creditObj },
            showCreditDIY: { desc: '调用自助授信', params: creditObj },
            showCreditDIY3: { desc: '调用自助授信3', params: creditObj },
            showCreditDIY4: { desc: '调用自助授信4(毕业金自助)', params: creditObj },
            showCreditReviewMode: { desc: '调用选择审核方式', params: creditObj },
            showCreditProgress: { desc: '调用进度详情 (授信进度)' },
            idCardOCR: {
                desc: '身份证OCR接口',
                params: { // 参数ocrType canManual durationTime 从AppVersion>=4.0.2开始支持
                    // source: '调用来源', // 调用来源，由服务端给出
                    idCardInCertification: '认证时的身份证号', // 认证时的身份证号，如果不需要在原生OCR流程中拿OCR结果与认证时的身份证号做比较的话可传空
                    ocrType: 0, // 扫描类型 0:只扫描身份证正面 1:只扫描身份证反面 2:同时扫描正反面
                    canManual: false, // 正面是否支持自动切换手动混合模式(默认false)
                    backCanManual: false, // 背面是否支持自动切换手动混合模式(默认false)
                    durationTime: 10 // 当支持自动手动混合模式时(canManual=true或backCanManual=true)，限定多长时间切换手动模式，单位秒
                }
            },
            livenessCheck: {
                desc: '活体检测接口',
                params: {
                    source: '', // 调用来源，由服务端给出
                    recordSound: true // 是否需要录音
                }
            },
            commonForm: {
                desc: '通用表单',
                params: {
                    callInfo: '温馨提示..巴拉巴拉...', // 提示信息
                    callCode: 1, // 1：完成后跳转 url（callbackUrl）; 2: 完成后直接返回浏览器视图并且回调JS函数（callbackFunc）
                    callbackUrl: 'http://www.baidu.com', // 完成后跳转的url
                    //  callbackFunc: 'onFinish' // 完成后返回浏览器视图回调的函数名
                    requestUrl: 'http://www.baidu.com' // 表单数据的请求接口
                }
            },
            showCreditSeries: {
                desc: '授信串联(协议1)',
                params: {
                    toFrom: 'aym-h5', // 来源
                    toUrl: 'http://www.baidu.com' // 来源 url
                }
            }
        },
        refreshFundsStatus: {
            desc: '公积金社保结果查询',
            params: {
                requestType: '' // 业务码，区分公积金和社保，透传
            }
        },
        checkFace: {
            desc: '刷脸活体请求',
            params: {
                channel: '' // 渠道
            }
        },
        showOcr: {
            desc: '身份证识别',
            params: {
                channel: '' // 渠道
            }
        }
    },
    payment: {
        desc: '调起收银台功能',
        methods: {
            pay: {
                desc: '支付(还款)调起收银台',
                params: {
                    accessToken: '123456', // 授权token
                    payInfo: '....' // 支付信息串
                }
            }
        }
    },
    navigation: {
        desc: '导航模块，提供跳转各种原生页面功能调用',
        methods: {
            goURL: {
                desc: '在一个新的浏览器窗口打开URL',
                params: {
                    url: 'http://www.baidu.com',
                    isOutSiteUrl: false, // 否是外站URL，如果是外站URL，APP不会将登录信息、Cookie等加入请求会话
                    loginFirst: false, // 否需要先登录再跳转
                    closeToRoot: true, // 回（或者关闭）至首页
                    rootPage: 0 // 需要返回至首页时标识具体的首页页面 0:商城首页 1:发现专题 3:取现聚合页 4:我的
                }
            },
            goPage: {
                // root 首页
                // bill 我的账单
                // red 我的红包
                // accdetails 账户明细
                // subject 精彩活动
                // feedback 意见反馈
                // msglist 消息列表
                // cash 提现页
                // banklist 银行卡列表
                // bindphone 绑定手机号
                desc: '打开各种原生页面',
                params: {
                    page: 'root', // 生页面标识
                    loginFirst: false, // 否需要先登录再跳转
                    closeToRoot: true, // 回（或者关闭）至首页
                    rootPage: 1, // 需要返回至首页时标识具体的首页页面 0:商城首页 1:专题 3:取现 4:我的
                    rootPageTab: 0 // rootPage=0时可指定rootPageTab，使跳转顶部某个tab页
                }
            },
            goURLWithOuterBrowser: {
                desc: '在APP外部的浏览器中打开URL（外部浏览器指系统默认浏览器）',
                params: {
                    url: 'http://www.baidu.com'
                }
            },
            goWebPack: {
                desc: '打开一个WebPack静态页面资源包',
                params: {
                    packId: 'subject_20170101'
                }
            }
        }
    },
    storage: {
        desc: '本地缓存模块，提供内存KV缓存，持久KV缓存功能',
        methods: {
            sessionContains: {
                desc: '查（在一次会话-APP启动到退出期间有效）（注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key: 'key1'
                }
            },
            sessionSet: {
                desc: '存（在一次会话-APP启动到退出期间有效）（注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key1: '111',
                    key2: '222',
                    key3: '333'
                }
            },
            sessionGet: {
                desc: '取（在一次会话-APP启动到退出期间有效）（注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key: 'key1'
                }
            },
            sessionRemove: {
                desc: '删（在一次会话-APP启动到退出期间有效） （注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key: 'key1'
                }
            },
            localContains: {
                desc: '查（持久化，除非用户或程序进行删除）（注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key: 'key1'
                }
            },
            localSet: {
                desc: '存（持久化，除非用户或程序进行删除）（注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key1: '111',
                    key2: '222',
                    key3: '333'
                }
            },
            localGet: {
                desc: '取（持久化，除非用户或程序进行删除） （注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key: 'key1'
                }
            },
            localRemove: {
                desc: '删（持久化，除非用户或程序进行删除）（注：APP会把 session方式存入的缓存自动带到跟服务端接口的每次交互中，而 local方式存入的缓存则不会）',
                params: {
                    key: 'key1'
                }
            }
        }
    },
    executor: { // TODO:
        desc: '命令执行模块，主要提供延迟执行、批量执行等功能',
        methods: {
            delayExecute: {
                desc: '延迟执行',
                params: {
                    delay: 3,
                    command: {
                        module: 'device',
                        method: 'getInfo',
                        params: { test: 12345 },
                        callback: 'callback'
                    }
                }
            },
            batchExecute: {
                desc: '批量执行',
                params: {
                    commands: [{
                        module: 'webview',
                        method: 'close',
                        params: {},
                        callback: 'callback'
                    }, {
                        module: 'navigation',
                        method: 'goURL',
                        params: { url: 'http://www.baidu.com', isOutSiteUrl: true, loginFirst: false, closeToRoot: true, rootPage: 0 },
                        callback: 'callback'
                    }]
                }
            }
        }
    },
    bill: {
        desc: '账单模块，主要提供账单首页面跳转、设置还款日等功能',
        methods: {
            setRepayment: { desc: '设置还款日' }
        }
    },
    permission: {
        desc: '权限模块，主要提供权限检查等功能',
        methods: {
            pushCheck: { desc: '检测推送权限' },
            contactCheck: { desc: '通讯录权限检查' }, 
            checkContact: { desc: '检查是否有通讯录权限，不弹框' }, 
            checkLocation: { desc: '检查是否有定位权限，不弹框' }
        }
    }
}
export default {

    name: 'callApp',

    data() {
        return {
            appObj: appObj
        }
    },
    methods: {
        toggle(key) {
            this.$set(this.appObj[key], 'isShow', !this.appObj[key].isShow)
        },
        defaultCallback(res) {
            axdAlert(JSON.stringify(res))
            console.log(JSON.stringify(res))
        },
        callApp(module, method, params = {}, callback = this.defaultCallback) {
            axdApp.send({
                module, // 模块名
                method, // 方法名
                // repeat: false,  // 缺省项，防重复提交配置（默认false，为true时允许多次请求，不拦截）
                params,
                callback
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.module__box {
    padding: 10px 0;
}

.module__list {

    h4,
    p {
        padding: 0 10px;
    }

    p {
        font-size: 14px;
        color: #666
    }
}
</style>
