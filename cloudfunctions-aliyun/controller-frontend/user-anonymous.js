const uniID = require("uni-id");
const { ResponseModal } = require("api");
module.exports = class UserNormal {
  constructor(appId) {
    this.appId = appId;
  }
  /**
   * 注册
   * @param data
   */
  async register(data) {
    const res = await uniID.register({
      appId: this.appId,
      vipExpireTime: Date.now(),
      balance: 0,
      username: data.username,
      nickname: data.username,
      password: data.password,
    });
    uniCloud.logger.info("注册-出参", res);
    return new ResponseModal(res.code, res, res.msg);
  }
  /**
   * 登录
   * @param data
   * @returns {Promise<ResponseModal>}
   */
  async login(data) {
    const res = await uniID.login({
      ...data,
      queryField: ["username", "email", "mobile"],
    });
    uniCloud.logger.info("帐户密码登录-出参", res);
    const res2 = await uniID.updateUser({
      uid: res.uid,
      token: [res.token],
    });
    uniCloud.logger.info("单点登录,清空其他token-出参", res2);
    return new ResponseModal(res.code, res, res.msg);
  }
};
