import wx from './wx';
import request from 'request';
import account from '../api/account';
export default {
  setTitle (title) {
    this.$store.commit('UPDATE_TITLE', {value: title});
  },
  // 网络异常,本地代码异常处理
  /***
   * 处理异常
   * @param err 异常信息
   */
  dealError (err) {
    console.log(err);
    wx.hideLoading();
    let title = '';
    let status = err.status;
    switch (status) {
      case 401: // Unauthorized 验证失败
        title = '验证失败';
        break;
      case 405: // Method not allowed 请求方法错误
        title = '请求方法错误';
        break;
      case 422: // Unprocessable Entity 不可用的实体
        title = '输入过期';
        break;
      case 500: // Unauthenticated 未授权
        // 如果是授权失败，则清空缓存和请求头并跳转到登陆页面
        if (err.data.message === 'Unauthenticated.') {
          title = '请重新登陆';
          wx.removeStorageSync('rww-token', '');
          request.setToken();
          this.$router.replace('/account/login?redirect=true');
        } else {
          title = '服务异常';
        }
        return;
    }
    wx.showModal({title, content: err.data.message});
  },
  /***
   * 处理api请求返回的结果
   * @param res 服务器返回的数据
   * @param cb api请求成功时执行的回调
   */
  dealResponse (res, cb) {
    // 隐藏加载框
    wx.hideLoading();
    const status = res.status;
    switch (status) {
      case 200: // 查询成功
      case 204: // no content
      case 201: // created 创建成功
        if (cb && typeof cb === 'function') {
          cb();
        }
        break;
      case 203:
        this.showModal(res.data.message);
        break;
      default:
        console.log(status);
        break;
    }
    // } else if (res.data.code === 500) {
    //   // 如果是服务器错误
    //   console.error(res);
    //   this.showModal('网络异常service', res.data.msg);
    // } else if (code === 0) {
    //   // 如果是token问题 过期,没有
    //   // 清空缓存
    //   wx.clearStorageSync();
    //   // 跳转到个人中心页面进行登陆
    //   wx.navigateTo({url: '/pages/account/login'});
    // } else {
    //   console.error(res.data.msg);
    //   this.showModal('业务异常', res.data.errorMsg);
    // }
  },
  // 截取指定长度的字符串
  subS (str, length) {
    if (str.length > length) {
      return str.substring(0, length) + '...';
    } else {
      return str;
    }
  },
  /***
   * 拼接图片前缀
   * @param path 图片路径
   * @returns {*} 拼接之后的图片
   */
  appendUrl (path) {
    // 如果是url则不拼接
    if (/^http/.test(path)) {
      return path;
    }
    return 'https://wenkaobang.hanguosoft.com' + path;
  },
  // 是否允许获取用户信息
  isAuthorUserInfo () {
    wx.getSetting()
      .then(res => {
        // 如果允许授权,则直接调用接口获取token
        if (res.authSetting['scope.userInfo']) {
          account.login();
        } else if (res.authSetting['scope.userInfo'] === false) {
          // 如果拒绝授权,则跳转到设置引导页面
          wx.navigateTo({
            url: '/pages/account/setting'
          });
        } else {
          // 如果没有授权过,则跳转到登陆引导页面
          wx.navigateTo({
            url: '/pages/account/login'
          });
        }
      })
      .catch(err => {
        this.dealError(err);
      });
  },
  // 是否缓存了token
  isStorageToken () {
    wx.getStorage({key: 'rww-token'})
      .then(res => {
        // 如果已经缓存,则设置请求头
        request.setToken();
      })
      .catch(() => {
        // 如果没有缓存,则检查是否授权获取信息
        this.isAuthorUserInfo();
      });
  },
  showModal (title, content) {
    return wx.showModal({title, content});
  },
  showToast (title) {
    return wx.showToast({
      title,
      duration: 3000,
      icon: 'none'
    });
  }
};
