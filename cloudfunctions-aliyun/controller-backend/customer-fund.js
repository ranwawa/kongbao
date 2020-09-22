/**
 * @file 用户资金明细相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:09
 */
const { db, ControllerBase } = require("api");
const { colCsFund } = db;
module.exports = class CustomerFund extends ControllerBase {
  /**
   * 添加一条资金明细
   */
  async add(options) {
    uniCloud.logger.info("添加一条用户资金明细-入参", options);
    const { type, price, remarkId, appId, userId } = options;
    const res = await colCsFund.add({
      remark: `订单id-${remarkId}`,
      isIncome: false,
      isDelete: false,
      createTime: Date.now(),
      appId,
      userId,
      type, // 11自己充值 12管理员充值 21购物 22管理员扣减 23开通vip
      price,
    });
    return this.processResponseData(res, "添加一条用户资金明细");
  }
};