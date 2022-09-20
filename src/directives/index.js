// 负责管理所有得自定义指令

export const imagerror = {
  // 指令对象，会在当前得dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom 表示当前指令作用得dom 对象，认为此时就是图片
    // 当图片有地址，但没有加载成功得时候，会报错会触发一个图片得事件=>onerror
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
