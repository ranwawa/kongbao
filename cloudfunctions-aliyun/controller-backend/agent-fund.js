/**
 * @file 代理资金明细相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:12
 */
const { db, ControllerBase } = require("api");
const { colAgFund } = db;
module.exports = class AgentFund extends ControllerBase {
  constructor(appId) {
    super(appId);
  }
  /**
   * 添加一条分站资金明细
   */
  async add(options) {
    uniCloud.logger.info("(agent-fund)添加一条分站资金明细-入参", options);
    const { remarkId, type, userId, appId, price } = options;
    const isIncome = type > 10 && type < 20; // 11自己充值 12管理员充值 21购物 22管理员扣减 23开通vip
    const res = await colAgFund.add({
      price,
      appId,
      userId,
      type,
      isIncome,
      isDelete: false,
      createTime: Date.now(),
      remark: `订单id-${remarkId}`,
    });
    return this.processResponseData(res, "(agent-fund)添加一条分站资金明细");
  }
};
