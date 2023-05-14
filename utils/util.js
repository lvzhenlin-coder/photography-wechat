const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//封装request请求
const baseUrl = 'https://请求地址/'
function request(url, data = {}, method = "get"){
  return new Promise(function(resolve, reject){
    wx.request({
      url: baseUrl+url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        resolve(res);
      },
      fail: function(err){
        reject(err);
      }
    })
  })
}

module.exports = {
  formatTime,
  request,
  baseUrl
}
