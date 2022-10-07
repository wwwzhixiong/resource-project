// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import uploadExcel from './uploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('uploadExcel', uploadExcel)
    Vue.component('ImageUpload', ImageUpload)// 注册图片上传组件
    Vue.use(Print) // 注册打印指令
  }
}
