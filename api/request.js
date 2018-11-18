import fly from 'axios';
import wx from 'wx';

fly.defaults.baseURL = '/api/';
// fly.config.baseURL = 'http://localhost:8080/api';
export default {
  // 设置token, 因为import之后,所有页面就共享这个模块的实例了
  // 如果第一次没有获取到token,那么以后也不会再进行获取,所以只有主动设置
  /***
   * 设置token
   */
  setToken() {
    fly.defaults.headers.Authorization = wx.getStorageSync('rww-token');
  },
  // http请求
  request(url, param, method) {
    fly.defaults.headers.Authorization = wx.getStorageSync('rww-token');
    // 显示加载框
    wx.showLoading({ title: '正在加载', mask: true });
    method = method || 'post';
    param = param || {};
    // 遍历删除没有值的参数
    for (let key in param) {
      if (param[key] === '') {
        delete param[key];
      }
    }
    let attr = method === 'get' ? 'params' : 'data';
    return new Promise((resolve, reject) => {
      fly({ method, url, [attr]: param }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err.response);
      });
    });
  },
};
