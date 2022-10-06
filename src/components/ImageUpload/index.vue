<template>
  <div>
    <!-- 给action一个# 因为他是必填项 否则报错 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{disabled: fileComputed }"
      :on-change=" changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width=100%">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的COS包
// 实例化COS
const cos = new COS({
  SecretId: 'AKIDqZ6OSHsELDrJZaNwGKAl7F7lU0IVaTBo', // 身份识别
  SecretKey: 'hM4g6HEx3C8pHURAetwpY5PURK3YpreF' // 身份密钥
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传图片的uid
      showPercent: false, // 默认不显示进度条
      percent: 0 // 当前进度条百分比
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file) {
      // file是点击删除的文件
    //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
      // 这里为何不成功呢？应为现在还没有上传，所有二次进来的数据 一定是空的
      // 如果完成上传动作了，第一次和第二次进去的file list长度都应该是1
    },
    // 上传之前的检查 1: 检查文件类型
    beforeUpload(file) {
      // file是一个对象，在里面可以拿到要上传的图片的大小size以及格式type
      // 定义类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 如果存在的类型 === file的类型
      // 数组的includes方法，会判断数组里面有没有符合条件的，如果有符合的就会返回true,否则返回false
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件的大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后一定要return true
    },
    // 调用腾讯云，执行上传操作
    upload(params) {
      // 通过params拿到file文件，上传
      // 判断如果存在 ，调用COS里面的方法，执行上传操作
      if (params.file) {
        cos.putObject({
          // 上传到腾讯云的存储桶 = 文件 格式 名称 那个地域 回调
          Bucket: 'miyoshi-1314168696', // 存储桶名称
          Region: 'ap-chengdu', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 。默认标准模式
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // 这里需要改为箭头函数，this才可以给FileLIST
          console.log(err || data)
          // 上传成功
          // 处理返回的data 数据,没有err 并且状态码是200的时候图片上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明上传成功 == 》获取成功的返回地址
            // 如果上传成功则会拿到data，里面包含上传成功之后的图片的url地址
            // 如果上传失败，则会打印err,里面包含错误的提示信息
            // fileList才能显示到上传组件上此时我们要将fileList中的数据的url地址变成现在上传成功的地址
            this.fileList = this.fileList.map(item => {
              // 找谁的uid地址等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值原来的url属性
                return { url: 'http://' + data.Location, upload: true }
              }
              // 如果不相等，将原来的对象原封不动的返回
              return item
            })
            // 将上传成功的地址回写到filelist数组
            // 关闭进度条 ，重置百分比
            this.showPercent = false
            this.percent = 0
            // 考虑到图片大小不同，上传速度不同，为了防止再没上传成功的时候点击保存按钮，需要加一个上传成功的标识，upload：true
          }
        })
      }
    }
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
