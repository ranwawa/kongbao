const uniID = require("uni-id");
const { ResponseModal } = require("api");
const db = uniCloud.database();
const colCsFund = db.collection("kb-cs-fund");

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
    this.userInfo = res.userInfo;
    return res;
  }
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const res = await colCsFund
      .where({ userId: this.userInfo._id })
      .field({ balance: true })
      .orderBy("createTime", "desc")
      .limit(1)
      .get();
    uniCloud.logger.info("获取用户信息-出参", res);
    const {
      data: [userInfo],
    } = res;
    return new ResponseModal(0, userInfo);
  }
};
