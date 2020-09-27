/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerBase, db, utils } = require("api");
const { colCsOrder, colCsOrderSub, _ } = db;
const { lodash, md5 } = utils;

class OrderSub extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 批量添加子订单
   */
  async addSubOrderMore(options) {
    this.info("(customer-order)批量添加子订单-入参", options);
    const res = await colCsOrderSub.add(options.addressList);
    return this.processResponseData(res, "(customer-order)批量添加子订单");
  }
  /**
   * alhc更新子订单
   */
  async updateSub(options) {
    this.info("(customer-order)alhc更新子订单-入参", options);
    const res = await colCsOrderSub
      .doc(options.thirdOrderNo)
      .update(lodash.omit(options, ["thirdOrderNo"]));
    return this.processResponseData(res, "alhc更新子订单");
  }
}

module.exports = class CustomerOrder extends OrderSub {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 添加订单
   */
  async add(options) {
    const { appId, userId, priceInfo, orderInfo } = options;
    const orderId = md5(`${appId}${userId}${Date.now()}`);
    const param = {
      _id: orderId,
      status: 1, // 1已创建,待支付 2,已支付,待提交到供应商 3,已提交到供应,待供应商响应(待收货) 5,
      // 已收货,待发货(出物流纪录)
      appId,
      userId,
      ...priceInfo,
      ...orderInfo,
      ...this.getBaseFields(),
    };
    this.info("(customer-order)添加订单-入参", param);
    const res = await colCsOrder.add(param);
    return this.processResponseData(res, "(customer-order)添加订单");
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
    this.info("(customer-order)更新单条订单-入参", options);
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
   * 根据batchNo修改订单状态
   */
  async updateStatusByBatchNo(options) {
    this.info("(customer-order)根据batchNo修改订单状态-入参", options);
    const res = await colCsOrder
      .where({ status: 3, batchNo: options.batchNo })
      .update({ status: 5 });
    return this.processResponseData(
      res,
      "(customer-order)根据batchNo修改订单状态"
    );
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
    const res = await colCsOrder
      .where({
        _id: _.exists(true),
      })
      .remove();

    const res2 = await colCsOrderSub
      .where({
        _id: _.exists(true),
      })
      .remove();
    uniCloud.logger.log("删除所有订单-出参", res, res2);
  }
  /**
   * 查询订单金额
   */
  async getOrderAmount(options) {
    this.info("(customer-order)查询订单金额-入参", options);
    const res = await colCsOrder
      .aggregate()
      .match({
        appId: options.appId,
        userId: options.userId,
        _id: options.orderId,
        status: 1,
        isDelete: false,
      })
      .addFields({ spId: "$spStoreInfo.spId" })
      .project(
        this.getFalse([
          "status",
          "dealPriceCustomer",
          "dealPriceAgent",
          "dealPricePlatform",
          ...this.baseFields,
        ])
      )
      .lookup({
        from: "kb-cs-order-sub",
        foreignField: "orderId",
        localField: "_id",
        as: "addressList",
      })
      .end();
    return this.processResponseData(res, "(customer-order)查询订单金额", true);
  }
};
