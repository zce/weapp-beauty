Page({
  /**
   * 页面的初始数据
   */
  data: {
    // https://picsum.photos/1080/1920/?image=302
    image: '/assets/background.jpg',
    result: null
  },

  detectImage (src) {
    wx.showLoading({ title: '分析中...' })

    const that = this

    wx.uploadFile({
      url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
      filePath: src,
      name: 'image_file',
      success (res) {
        const result = JSON.parse(res.data)
        
        // 检测失败
        if (result.ret !== 0) {
          wx.showToast({ icon: 'none', title: '找不到你的小脸蛋喽' })
          return false
        }

        that.setData({ result: result.data.face[0] })
        wx.hideLoading()
      }
    })
  },

  handleStart () {
    const that = this
    wx.chooseImage({
      sizeType: ['original'],
      sourceType: ['camera'],
      success (res) {
        const image = res.tempFiles[0]
        
        // 图片过大
        if (image.size > 1024 * 1000) {
          wx.showToast({ icon: 'none', title: '图片过大, 请重新拍张小的！' })
          return false
        }
        
        that.setData({ image: image.path })
        that.detectImage(image.path)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    if (this.data.result) {
      return { title: `刚刚测了自己的颜值为【${this.data.result.beauty}】你也赶紧来试试吧！` }
    }
  }
})