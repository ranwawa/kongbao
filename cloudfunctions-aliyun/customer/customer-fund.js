/**
 * @file 用户资金明细相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:09
 */
const { db, ControllerAuth } = require('api');
const { colCsFund } = db;
module.exports = class CustomerFund extends ControllerAuth {
  constructor(appId, userInfo) {super(appId, userInfo);}
  /**
   * 添加一条资金明细
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
    uniCloud.logger.info('添加一条资金明细-入参', param);
    const res = colCsFund.add({
      ...param,
      price: options.csAmount,
    });
    uniCloud.logger.info('添加一条资金明细-出参', res);
    return res;
  }
};
