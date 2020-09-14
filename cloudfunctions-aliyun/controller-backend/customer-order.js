/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerAuth, ControllerBase, db } = require("api");
const { colCsOrder } = db;
const _ = require("lodash");

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
    return this.processResponseData(
      res,
      "通过第3方batchCode查询订单地址",
      true
    );
  }
  /**
   * 更新单条订单
   */
  async updateOrderSingle(options) {
    uniCloud.logger.info("更新单条订单-入参", options);
    const res = await colCsOrder
      .doc(options._id)
      .update(_.omit(options, ["_id"]));
    return this.processResponseData(res, "更新单条订单", true);
  }
  /**
   * 批量更新订单
   */
  async updateOrderList(options) {
    uniCloud.logger.info("批量更新订单-入参", options);
    const promiseAll = options.map((ele) => {
      return colCsOrder.doc(ele._id).update(_.omit(ele, ["_id"]));
    });
    const res = await Promise.all(promiseAll);
    return this.processResponseData(res, "批量更新订单", true);
  }
  /**
   * 根据status查询订单地址
   * @param status
   */
  async getOrderAddressByStatus(status) {
    uniCloud.logger.info("根据status查询订单地址-入参", status);
    const res = await colCsOrder
      .where({ status })
      .field({ addressInfo: true })
      .get();
    return this.processResponseData(res, "根据status查询订单地址");
  }
};
