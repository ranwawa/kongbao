/**
 * @file (后台)用户资金相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 15:20
 */
const { db, ControllerBase } = require("api");
const { colCsFundOrder, $ } = db;
module.exports = class CustomerFund extends ControllerBase {
  constructor(appId) {
    super(appId);
  }
  /**
   * 更新实际支付金额
   */
  async update(options) {
    const { fundOrderId, realPrice, userId, appId } = options;
    uniCloud.logger.info("更新实际支付金额-入参", options);
    const res = await colCsFundOrder
      .where({
        userId,
        appId,
        _id: fundOrderId,
        status: options.preStatus,
        isDelete: false,
      })
      .update({
        realPrice,
        status: options.nextStatus,
      });
    return this.processResponseData(res, "更新实际支付金额");
  }
};
