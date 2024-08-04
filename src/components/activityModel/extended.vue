<script>
/*
 *扩展模块json数据需要传type，用来判断类型，以此调用不同的component
 */
export default {
    name: 'extend',
    props: {
        config: Object
    },
    render(h) {
        let temp
        let conf = this.config
        if (conf.type === 'telecom') {
            temp = require('./custom/telecom.vue').default
        } else if (conf.type === 'conduitDownload') {
            temp = require('./custom/conduitDownload.vue').default
        }
        return h(temp, {
            props: {
                config: conf
            }
        })
    }
}
</script>
