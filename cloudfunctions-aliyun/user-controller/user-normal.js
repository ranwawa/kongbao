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
    return await uniID.register({
      appId: this.appId,
      isVip: false,
      balance: 0,
      ...data,
    });
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
    return new ResponseModal(res.code, res, res.msg);
  }
};
