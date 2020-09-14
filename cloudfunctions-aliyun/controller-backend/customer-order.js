/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerAuth, ControllerBase, db } = require('api');
const { colCsOrder } = db;
module.exports = class CustomerOrder extends ControllerBase {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
  /**
   * 通过第3方batchCode查询订单地址
   */
  async getOrderAddressByBatchCode(batchNo) {
    uniCloud.logger.info("通过第3方batchCode查询订单地址-入参", batchNo);
    const res = await colCsOrder
      .where({ batchNo })
      .field({ addressInfo: true })
      .get();
    return this.processResponseData(res, '通过第3方batchCode查询订单地址', true);
  }
  /**
   * 更新订单地址的recordId,便于后期查询快递单号
   */
  async updateOrderAddressRecordId(options) {
    uniCloud.logger.info("更新订单地址的recordId-入参", options);
    const res = await colCsOrder.doc(options.orderId).update({ addressInfo: options.addressInfo });
    return this.processResponseData(res, '更新订单地址的recordId', true);
  }
};
