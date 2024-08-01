import { nextTick, type Directive, type DirectiveBinding } from 'vue'
import { debounce } from 'lodash'

const loadMore: Directive = {
  beforeMount(el: any, binding: DirectiveBinding) {
    console.log(el)

    nextTick(() => {
      const selectDom = el.querySelector(
        '.el-select-dropdown .el-select-dropdown__wrap'
      )

      const loadMores = debounce(function (this: any) {
        const isBase = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (isBase) {
          binding.value && binding.value()
        }
      }, 200)
      el.selectDomInfo = selectDom
      el.userLoadMore = loadMores
      selectDom?.addEventListener('scroll', loadMores)
    })
  },
  beforeUnmount(el: any) {
    if (el.userLoadMore) {
      el.selectDomInfo?.removeEventListener('scroll', el.userLoadMore)
      delete el.selectDomInfo
      delete el.userLoadMore
    }
  }
}
export default loadMore
