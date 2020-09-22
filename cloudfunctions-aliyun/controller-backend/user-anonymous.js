const uniID = require("uni-id");
const { ControllerBase, db } = require("api");
const { colCsUser, _ } = db;
module.exports = class UserNormal extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }

  /**
   * 更新余额
   */
  async updateBalance(options) {
    uniCloud.logger.info("(user-anonymous)更新余额-入参", options);
    const { userId, appId, price, vipExpireTime } = options;
    const res = await colCsUser
      .where({
        appId,
        _id: userId,
      })
      .update({
        balance: _.inc(price),
      });
    return this.processResponseData(res, "(user-anonymous)更新余额");
  }
  /**
   * 更新VIP到期时间
   */
  async updateVip(options) {
    uniCloud.logger.info("(user-anonymous)更新VIP到期时间-入参", options);
    const { userId, appId, price, vipExpireTime } = options;
    const param = {};
    price && (param.balance = _.inc(price));
    vipExpireTime && (param.vipExpireTime = vipExpireTime);
    const res = await colCsUser
      .where({
        appId,
        _id: userId,
      })
      .update(param);
    return this.processResponseData(res, "(user-anonymous)更新余额");
  }

  /**
   * 根据userId查询用户余额
   */
  async getSingleByUserId(options) {
    uniCloud.logger.log("(user-anonymous)根据userId查询用户余额-入参", options);
    const res = await colCsUser.doc(options.userId).get();
    return this.processResponseData(
      res,
      "(user-anonymous)根据userId查询用户余额",
      true
    );
  }
};
