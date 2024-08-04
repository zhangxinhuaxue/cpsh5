<template>
<div>
    <axd-loading :show="loadingshow" :message="loadText"></axd-loading>
    <div v-if="!loadingshow">
        <button @click="onShowToast_TOP">Click Show Toast TOP</button> <button @click="onShowToast">Click Show Toast MIDDLE</button>
         <button @click="onShowToast_BOTTOM">Click Show Toast BOTTOM</button>
        <br>
        <button @click="onShowAlert">Click Show Alert</button>
        <br>
        <button @click="onShowAlert2">Click Show Alert customize</button>
        <br>
        <button @click="onShowModal">Click Show Modal</button>

        <axd-modal :show="modalshow">
          <div slot="title">弹窗标题</div>
          <div slot="content">内容内容内容内容内容内容内容内容内容内容</div>
          <div slot="buttons" class="modal-buttons">
            <span class="modal-button modal-button-cancel" v-on:click="onClick(1)">取消</span>
            <span class="modal-button" v-on:click="onShowAlert2(1)">弹窗</span>
            <span class="modal-button modal-button-bold" v-on:click="onOkClick">确定</span>
          </div>
        </axd-modal>


        <swipe class="my-swipe">
            <swipe-item class="slide1"><img src="http://aixuedaiimg.img-cn-hangzhou.aliyuncs.com/merchant/2016817/122322246/147140780223628272.jpg" /></swipe-item>
            <swipe-item class="slide2"><img src="http://aixuedaiimg.img-cn-hangzhou.aliyuncs.com/merchant/20160728/203204367/FqEhw3RlRcW8qRf2TLVUOu5aj4OS.jpg" /></swipe-item>
            <swipe-item class="slide3"><img src="http://aixuedaiimg.img-cn-hangzhou.aliyuncs.com/merchant/2016818/15540067/147150684005988258.jpg" /></swipe-item>
        </swipe>
    </div>
</div>
</template>
<script type="text/javascript">
import axdLoading from 'components/loading/index.vue'
import axdAlert from 'components/alert/index'
import Modal from 'components/modal/index.vue'
import {
    Swipe,
    SwipeItem
} from 'components/swipe'

export default {
    data() {
        return {
            loadingshow: true,
            modalshow: false,
            loadText: 'loading'
        }
    },
    components: {
        'axd-modal': Modal,
        axdLoading,
        Swipe,
        SwipeItem
    },
    mounted() {
        let that = this
        this.loadingshow = true
        setTimeout(function() {
            that.loadingshow = false
        }, 1000)
    },
    methods: {
        onClick() {
            this.modalshow = false
        },
        onShowModal() {
            this.modalshow = true
        },
        onShowToast_TOP() {
            this.$_toast({
                txt: 'upload complete top',
                time: 3000,
                mast: true
            })
        },
        onShowToast_BOTTOM() {
            this.$_toast({
                txt: 'upload complete bottom',
                time: 3000,
                mast: true
            })
        },
        onShowAlert() {
            axdAlert('xxxxx')
        },
        onShowAlert2() {
            axdAlert({
                title: 'upload',
                content: 'upload complete',
                okText: 'okok',
                onOk: function() {
                    this.$_toast('ok button clicked')
                }
            })
        },

        onOkClick() {
            this.$_toast('确定按钮点击了')
            this.modalshow = false
        },
        onShowToast() {
            this.$_toast('upload complete')
        }
    }
}
</script>

<style type="text/css">
    .my-swipe {
      height: 200px;
      color: #fff;
      font-size: 30px;
      text-align: center;
    }
    .slide img {
        height: 200px;
    }
    .slide1 {
      background-color: #0089dc;
      color: #fff;
    }
    .slide2 {
      background-color: #ffd705;
      color: #000;
    }
    .slide3 {
      background-color: #ff2d4b;
      color: #fff;
    }
</style>
