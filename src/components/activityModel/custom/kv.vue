<template>
    <div type="kv" v-on:click="customEvent">
        <axd-image :src="imgSrc" :lazy="false"></axd-image>
    </div>
</template>

<script>
    import axdImage from 'src/components/image/index.vue'

    export default {
        name: 'kv',
        props: {
            keyName: String,
            blockData: Array,
            event: Function
        },
        data() {
            return {
                imgSrc: ''
            }
        },
        mounted() {
            if (this.blockData) {
                this.blockData.map((item) => {
                    if (item.blockType === 'primary_kv' && item.title === this.keyName) {
                        this.imgSrc = item.img
                    }
                })
            }
        },
        methods: {
            customEvent() {
                this.event && this.event()
            }
        },
        components: {
            axdImage
        }
    }
</script>
