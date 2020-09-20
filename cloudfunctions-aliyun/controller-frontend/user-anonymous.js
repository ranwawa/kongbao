const uniID = require("uni-id");
const { ControllerBase } = require("api");
module.exports = class UserAnonymous extends ControllerBase {
  constructor(appId) {
    super(appId);
  }
  /**
   * 注册
   */
  async register(options) {
    uniCloud.logger.info("(user-anonymous)注册-入参", options);
    const res = await uniID.register({
      appId: this.appId,
      vipExpireTime: Date.now(),
      balance: 0,
      username: options.username,
      nickname: options.username,
      password: options.password,
    });
    uniCloud.logger.info("注册-出参", res);
    return new this.ResponseModal(res.code, res, res.msg);
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
    return new this.ResponseModal(res.code, res, res.msg);
  }
};
