const uniID = require("uni-id");
const { ControllerBase, db } = require("api");
const { colCsUser, _ } = db;
module.exports = class UserNormal extends ControllerBase {
  constructor(appId) {
    super(appId);
  }
  /**
   * 更新余额
   */
  async updateBalance(options) {
    uniCloud.logger.info("更新余额-入参", options);
    const { userId, appId, price } = options;
    const res = await colCsUser
      .where({
        appId,
        _id: userId,
      })
      .update({
        balance: _.inc(price),
      });
    return this.processResponseData(res, "更新余额");
  }
};
