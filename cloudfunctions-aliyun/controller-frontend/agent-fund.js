/**
 * @file 代理资金明细相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:12
 */
const { db, ControllerAuth } = require("api");
const { colAgFund } = db;
module.exports = class AgentFund extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 添加一条分站资金明细
   */
  add(options) {
    const param = {
      remark: `订单id-${options._id}`,
      type: 21,
      isIncome: false,
      isDelete: false,
      createTime: Date.now(),
      appId: this.appId,
      userId: this.userInfo._id,
    };
    uniCloud.logger.info("添加一条分站资金明细-入参", param);
    const res = colAgFund.add({
      ...param,
      price: options.agAmount,
    });
    uniCloud.logger.info("添加一条分站资金明细-出参", res);
    return res;
  }
};
