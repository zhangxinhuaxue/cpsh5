/*
    Created by hity on 06/08/17
    参数说明：
        auto: 是否自执行
        imgs: 需预加载的图片列表，为二维表
        ignore：在自执行过程中，需要跳过的图片set 脚标
        firstSetReady: 第一组图片完成加载以后，置为true，便于外部掌握状态
    说明：
        非自执行的需求，可直接调用loadOneSetImages方法，返回值为promise
*/
import co from 'co'
class Preload {
    constructor(auto, imgs = [], ignore = []) {
        this.imgs = imgs
        this.ignore = ignore
        this.auto = auto
        this.firstSetReady = false
        this.finished = false
        this.init()
    }
    init() {
        let me = this
        if (this.auto) {
            co(this.autoExeImageStream.call(this))
                .then(() => {
                    me.finished = true
                })
                .catch(function() {
                    me.finished = true
                })
        }
    }

    *autoExeImageStream() {
        let rstList = []
        for (let i = 0; i < this.imgs.length; i++) {
            if (this.ignore.indexOf(i) == -1) {
                yield this.loadOneSetImages(this.imgs[i], i)
            }
        }
    }
    loadOneSetImages(imgList, i) {
        let promiseList = []
        let me = this

        imgList.forEach((item, index) => {
            promiseList.push(me.loadSingleImage(item))
        })
        return Promise.all([...promiseList])
            .then(() => {
                me.firstSetReady = true
            })
            .catch(function() {
                me.firstSetReady = true
            })
    }
    loadSingleImage(src) {
        if (!src) {
            return new Promise((resolve, reject) => {
                resolve('noImage')
            })
        }
        let newImg = new Image()
        newImg.src = src
        return new Promise((resolve, reject) => {
            newImg.onload = () => {
                this.total++
                resolve('success')
            }
            newImg.onerror = () => {
                reject('fail')
            }
        })
    }
}

export default Preload
