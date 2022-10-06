// 负责管理所有得自定义指令

export const imagerror = {
  // 指令对象，会在当前得dom元素插入到节点之后执行
  inserted(dom, options) {
    // 分两种情况：地址报错的时候会触发一个图片的onerror事件，如果图片不报错就不会触发这个事件
    // 2；当图片地址为空的时候不会触发onerror事件，,这时候我们也需要默认一样图片进行展示

    dom.src = dom.src || options.value
    // dom 表示当前指令作用得dom 对象，认为此时就是图片
    // 当图片有地址，但没有加载成功得时候，会报错会触发一个图片得事件=>onerror
    dom.onerror = function() {
      dom.src = options.value
    }
  },
  // 该函数同inserted一样也是钩子函数
  componentUpload(dom, options) {
    // 该钩子函数会在当前指令作用的组件更新数据完毕之后执行l
    //  inserted只会执行一次
    // 组件初始化一旦更新就会再进入 inserted函数﹐会进去 componentUpdated
    dom.src = dom.src || options.value
    // inserted和componentUpdated钩子的数的区别?
    // 第一次插入到节占的时候就会触发，而且只触发一次
    // componentUndated钩子函数是当数据更新之后，自定义指令所在的DON需要更新，更新的时候不会再触发inserted钩子函数，触发的是cokponentUpdated的
  }
}
