const uniID = require("uni-id");
const { ControllerAuth, utils } = require("api");
const { moment } = utils;
module.exports = class UserAuth extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 验证是否vip
   */
  checkVip() {
    return this.userInfo.vipExpireTime > Date.now();
  }
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const { userInfo } = this;
    const res = {
      userId: userInfo._id,
      balance: userInfo.balance,
      balanceStr: (userInfo.balance / 100).toFixed(2),
      nickname: userInfo.nickname,
      isVip: this.checkVip(),
      vipExpireTimeStr: moment(userInfo.vipExpireTime).format("YYYY年MM月DD日"),
    };
    uniCloud.logger.info("获取用户信息-出参", res);
    return new this.ResponseModal(0, res);
  }
  /**
   * 退出登录
   */
  async logout() {
    uniCloud.logger.info("退出登录-入参", this.token);
    const res = await uniID.logout(this.token);
    uniCloud.logger.info("退出登录-出参", res);
    return new this.ResponseModal(res.code, res, res.msg);
  }
};
