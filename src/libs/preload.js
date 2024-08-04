/*
    Created by hity on 04/17/17
*/
class Preload {
    constructor () {
        this.status = -1;
        this.ignore = [];
        this.auto = true;
        this.imgs = [];
        Object.defineProperty(this, 'status', {
            set(newValue) {
               this._status = newValue;
               this.loadResource();
            },
            get() {
                return this._status;
            }
        })
    }
    init() {
        this.status = 0
    }
    loadResource() {
        let me = this;
        let id = this.status;
        let imgs = this.imgs[id];
        let newImgObjs = [];
        let loadeds = 0;
        if (this.imgs[id] == undefined || id < 0) {
            return
        }
        if (this.ignore.indexOf(id) != -1) {
            if (this.auto) {
                this.status = id + 1
            }
            return
        }

        for (let i = 0; i < imgs.length; i++) {
            newImgObjs[i] = new Image()
            newImgObjs[i].src = imgs[i]

            newImgObjs[i].onload = function() {
                loadeds++
                if (loadeds == newImgObjs.length) {
                    if (me.auto) {
                        me.status = id + 1
                    }
                    newImgObjs = null
                    imgs = null
                    console.log('图片资源已经加载完成')
                }
            }

            newImgObjs[i].onerror = function() {
                loadeds++
                if (loadeds == newImgObjs.length) {
                    if (me.auto) {
                        me.status = id + 1
                    }
                    newImgObjs = null
                    imgs = null
                    console.log('图片资源已经加载完成')
                }
            }
        }
    }
}

export default Preload;
