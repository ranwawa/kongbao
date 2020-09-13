const uniID = require("uni-id");
const { ResponseModal } = require("api");
const db = uniCloud.database();
const colCsFund = db.collection("kb-cs-fund");
const $ = db.command.aggregate;

module.exports = class UserAuth {
  constructor(appId, uniIdToken) {
    this.uniIdToken = uniIdToken;
    this.appId = appId;
  }
  /**
   * 验证token
   * @returns {Promise<ResponseModal|{msg: string, code: number}|{msg: string,
   *   code: number}|{msg: string, code: number}|*|{msg: string, code: number,
   *   err: *}|{msg: string, code: number, err: *}>}
   */
  async checkToken() {
    if (!this.uniIdToken) {
      return new ResponseModal(401, "请登录后访问");
    }
    const res = await uniID.checkToken(this.uniIdToken);
    uniCloud.logger.log("验证token-出参", res);
    if (res.code !== 0) {
      return res;
    }
    if (res.appId !== this.appId) {
      uniCloud.logger.warn("验证token", "注册时appId与登录时appId有差异");
    }
    const { userInfo } = res;
    this.userInfo = {
      username: userInfo.username,
      isVip: userInfo.isVip,
      appId: userInfo.appId,
      balance: userInfo.balance,
      nickname: userInfo.nickname,
      mobile: userInfo.mobile,
      email: userInfo.mobile,
      avatar: userInfo.avatar,
    };
    return res;
  }
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    uniCloud.logger.info("获取用户信息-出参", this.userInfo);
    return new ResponseModal(0, this.userInfo);
  }
  /**
   * 退出登录
   */
  async logout() {
    uniCloud.logger.info("退出登录-入参", this.uniIdToken);
    const res = await uniID.logout(this.uniIdToken);
    uniCloud.logger.info("退出登录-出参", res);
    return new ResponseModal(res.code, res, res.msg);
  }
};
