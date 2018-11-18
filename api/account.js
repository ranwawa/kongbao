import request from './request';
export default {
  // 获取验证码
  getImg () {
    return request.request('captchas');
  },
  // 注册
  register (param) {
    return request.request('userReg', param);
  },
  // 登陆
  login (param) {
    return request.request('login', param);
  },
  // 获取平台信息
  getPlatform (param) {
    return request.request('getPlatform', param, 'get');
  },
  // 获取用户信息
  getUserInfo (param) {
    return request.request('userInfo', param, 'get');
  },
  // 获取资金明细
  getCashList (param) {
    return request.request('moneyLog', param, 'get');
  },
  // 调起支付接口
  payNow (param) {
    return request.request('pay', param);
  },
  // 充值VIP
  getVip (param) {
    return request.request('getVip', param, 'get');
  },
  // 发送邮件验证码
  sendEmail (param) {
    return request.request('sendEmail', param);
  },
  // 验证邮箱
  bindEmail (param) {
    return request.request('bindEmail', param);
  },
  // 发送手机短信
  sendSMS (param) {
    return request.request('sendSms', param);
  },
  // 绑定手机号码
  bindPhone (param) {
    return request.request('bindPhone', param);
  },
  // 编辑信息
  editInfo (param) {
    return request.request('editInfo', param);
  }
};
