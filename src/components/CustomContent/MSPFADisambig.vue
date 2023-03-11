<script>
import MSPFAPage from '@/components/CustomContent/MSPFAPage.vue'
import MSPFALog from '@/components/CustomContent/MSPFALog.vue'
import MSPFAIndex from '@/components/CustomContent/MSPFAIndex.vue'

export default {
  name: 'MSPFADisambig',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MSPFALog, MSPFAPage, MSPFAIndex
  },
  theme: () => "mspfa",
  title: function(ctx) {
    if (!ctx.routeParams.story)
      return 'MSPFA' 
    else {
      const comic = ctx.$archive.mspfa[ctx.routeParams.story].n
      if (ctx.routeParams.p == 'log') {
        return `Adventure Log - ${comic}`
      } else {
        const command = ctx.$archive.mspfa[ctx.routeParams.story].p[Number(ctx.routeParams.p - 1)].c
        return command ? `${command} - ${comic}` : comic
      }
    }
  },
  functional: true,
  render: function (h, ctx) {
    let options = ctx // pass through everything
    // some special changes here
    options['class'] = ctx.data.class
    options['ref'] = ctx.data.ref

    // compute props globally, yolo
    options.props['storyId'] = ctx.props.routeParams.story
    options.props['pageNum'] = Number(ctx.props.routeParams.p)
    // these will be invalid values sometimes but only on pages that don't use them

    // {
    //   props: {
    //     tab: ctx.props.tab
    //   },
    //   data: {
    //     ref: ctx.data.ref,
    //   },
    //   class: ctx.data.class,
    //   ref: ctx.data.ref
    // }
    if (!ctx.props.routeParams.story)
      return h(MSPFAIndex, options)
    else if (ctx.props.routeParams.p == 'log') {
      return h(MSPFALog, options)
    } else if (ctx.props.routeParams.p && ctx.props.routeParams.story) {
      return h(MSPFAPage, options)
    } else return h("pre", {
      text: ctx.props.routeParams
    })
  }
}
</script>
