/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerBase, db } = require("api");
const { colCsOrder, _ } = db;
const lodash = require("lodash");
module.exports = class CustomerOrder extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 通过第3方batchCode查询订单地址
   */
  async getOrderAddressByBatchCode(batchNo) {
    uniCloud.logger.info(
      "(customer-order)通过第3方batchCode查询订单地址-入参",
      batchNo
    );
    const res = await colCsOrder
      .where({ batchNo })
      .field({
        appId: true,
        userId: true,
        addressInfo: true,
      })
      .limit(1)
      .get();
    return this.processResponseData(
      res,
      "(customer-order)通过第3方batchCode查询订单地址",
      true
    );
  }
  /**
   * 更新单条订单
   */
  async updateOrderInfo(options) {
    uniCloud.logger.info("(customer-order)更新单条订单-入参", options);
    const res = await colCsOrder
      .where({
        _id: options.orderId,
        appId: options.appId,
        userId: options.userId,
        status: options.preStatus,
        isDelete: false,
      })
      .update({
        status: options.nextStatus,
        ...lodash.omit(options, [
          "orderId",
          "appId",
          "userId",
          "preStatus",
          "nextStatus",
        ]),
      });
    return this.processResponseData(res, "(customer-order)更新单条订单", true);
  }
  /**
   * 批量更新订单
   */
  async updateOrderList(options) {
    uniCloud.logger.info("(customer-order)批量更新订单-入参", options);
    const promiseAll = options.map((ele) => {
      return colCsOrder.doc(ele._id).update(lodash.omit(ele, ["_id"]));
    });
    const res = await Promise.all(promiseAll);
    return this.processResponseData(res, "(customer-order)批量更新订单", true);
  }
  /**
   * 根据status查询订单地址
   * @param status
   */
  async getOrderAddressByStatus(status) {
    uniCloud.logger.info("(customer-order)根据status查询订单地址-入参", status);
    const res = await colCsOrder
      .where({ status })
      .field({ addressInfo: true })
      .get();
    return this.processResponseData(
      res,
      "(customer-order)根据status查询订单地址"
    );
  }
  /**
   * 删除所有订单
   * @returns {Promise<void>}
   */
  async removeAll() {
    // const res = await colCsOrder.where({
    //   _id: dbCmd.exists(true)
    // }).remove();
    // uniCloud.logger.log("删除所有订单-出参", res);
  }
  /**
   * 更新所有订单
   */
  async updateAll() {
    // const res = await colCsOrder.where({
    //   _id: _.exists(true),
    //   status: 5,
    // }).update({
    //   status: 3
    // });
    // uniCloud.logger.log("更新所有订单-出参", res);
  }
};
