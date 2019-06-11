// const { apiUrl, apiAppId, apiAppSecret } = getApp().config

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // https://images.unsplash.com/photo-1560042289-7951ad5bfcf5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=750&h=1334&fit=crop&ixid=eyJhcHBfaWQiOjF9
    image: '/assets/placeholder.jpg',
    showTips: false,
    result: null
  },

  /**
   * 分析照片
   */
  detectImage (src) {
    const that = this

    // 取消之前的结果显示
    that.setData({ result: null })

    // loading
    wx.showLoading({ title: '分析中...' })

    // 将图片上传至 AI 服务端点
    wx.uploadFile({
      url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
      name: 'image_file',
      filePath: src,
      success (res) {
        // 解析 JSON
        const result = JSON.parse(res.data)

        if (result.ret === 0) {
          // 成功获取分析结果
          that.setData({ result: result.data.face[0] })
        } else {
          // 检测失败
          wx.showToast({ icon: 'none', title: '找不到你的小脸蛋喽～' })
        }

        // end loading
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取照片
   */
  getImage (type = 'camera') {
    const that = this

    // 调用系统 API 选择或拍摄照片
    wx.chooseImage({
      sourceType: [type], // camera | album
      sizeType: ['compressed'], // original | compressed
      count: 1,
      success (res) {
        // 取照片对象
        const image = res.tempFiles[0]

        // 图片过大
        if (image.size > 1024 * 1000) {
          return wx.showToast({ icon: 'none', title: '图片过大, 请重新拍张小的！' })
        }

        // 显示到界面上
        that.setData({ image: image.path })

        // 分析检测人脸
        that.detectImage(image.path)
      }
    })

    // 关闭 Tips 显示
    this.setData({ showTips: false })
  },

  /**
   * 按钮事件处理函数
   */
  handleClick (e) {
    if (e.type === 'tap') {
      // 短按拍照为拍摄照片
      this.getImage()
    } else if (e.type === 'longpress') {
      // 长按拍照为选择照片
      this.getImage('album')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const isUsed = wx.getStorageSync('is_used')
    if (isUsed) return
    // 第一次使用显示 Tips
    this.setData({ showTips: true })
    // 并记住用使用过了
    wx.setStorageSync('is_used', true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    if (!this.data.result) return
    // 如果有分析结果，则分享
    return { title: `刚刚测了我的颜值「${this.data.result.beauty}」你也赶紧来试试吧！` }
  }
})
