/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { ControllerAuth, db } = require("api");
const { colCsOrder, $ } = db;
const md5 = require("md5");
function isId(id) {
  return typeof id === "string" && id.length === 32;
}
module.exports = class CustomerOrder extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 添加订单
   */
  async add(csAmount, agAmount, orderInfo) {
    const now = Date.now();
    const orderId = md5(`${this.appId}${this.userInfo._id}${csAmount}${now}`);
    orderInfo.addressInfo = orderInfo.addressInfo.map((ele, index) => ({
      ...ele,
      addressId: md5(`${orderId}${index}`),
    }));
    const param = {
      csAmount,
      agAmount,
      ...orderInfo,
      _id: orderId,
      appId: this.appId,
      userId: this.userInfo._id,
      isDelete: false,
      createTime: now,
      status: 1, // 1已创建,待支付 2,已支付,待提交到供应商 3,已提交到供应,待供应商响应(待收货) 5,
      // 已收货,待发货(出物流纪录)
    };
    const res = await colCsOrder.add(param);
    uniCloud.logger.log("添加订单-入参", param);
    return new this.ResponseModal(0, res);
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
   * 查询单条订单
   */
  async getSingle(options) {
    const param = {
      appId: this.appId,
      userId: this.userInfo._id,
      _id: options.orderId,
      isDelete: false,
    };
    uniCloud.logger.log("查询单条订单-入参", param);
    if (!isId(options.orderId)) {
      return new this.ResponseModal(400, {}, "订单信息有误");
    }
    const res = await colCsOrder
      .aggregate()
      .match(param)
      .limit(1)
      .project({
        orderId: "$_id",
        _id: false,
        status: true,
        createTime: true,
        payTime: true,
        storeTime: "$spBuyTime",
        amount: "$csAmount",
        num: $.size("$addressInfo"),
        serviceInfo: "$serviceInfo.formattedAddress",
        addressInfo: $.map({
          input: "$addressInfo",
          as: "this",
          in: { formattedAddress: "$$this.formattedAddress" },
        }),
        goodsInfo: {
          goodsId: "$csGoodsInfo._id",
          expressName: "$spGoodsInfo.expressName",
          goodsName: "$spGoodsInfo.goodsName",
          salePriceNormal: $.divide(["$csAmount", $.size("$addressInfo")]),
          imgList: $.split(["$spGoodsInfo.imgList", "---"]),
        },
      })
      .end();
    return this.processResponseData(res, "查询单条订单", true);
  }
  /**
   * 查询完整的订单信息
   */
  async getSingleComplete(orderId) {
    uniCloud.logger.log("(customer-order)查询完整的订单信息-入参", orderId);
    const res = await colCsOrder
      .where({
        appId: this.appId,
        userId: this.userInfo._id,
        _id: orderId,
        status: 1,
        isDelete: false,
      })
      .field({
        _id: true,
        csAmount: true,
        agAmount: true,
        csGoodsInfo: true,
        serviceInfo: true,
        addressInfo: true,
      })
      .limit(1)
      .get();
    return this.processResponseData(
      res,
      "(customer-order)支付订单,查询订单信息",
      true
    );
  }
  /**
   * 根据分类查询订单
   */
  async getListByStatus(options) {
    const { currentPage = 1, pageSize = 10, status = -1 } = options;
    const param = {
      appId: this.appId,
      userId: this.userInfo._id,
      status: status === -1 ? undefined : status,
      isDelete: false,
    };
    uniCloud.logger.log("根据分类查询订单-入参", param);
    const res = await colCsOrder
      .aggregate()
      .match(param)
      .sort({
        createTime: -1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .project({
        _id: false,
        status: true,
        createTime: true,
        orderId: "$_id",
        num: $.size("$addressInfo"),
        amount: "$csAmount",
        goodsInfo: {
          goodsId: "$csGoodsInfo.goodsId",
          expressName: "$spGoodsInfo.expressName",
          goodsName: "$spGoodsInfo.goodsName",
          salePriceNormal: $.divide(["$csAmount", $.size("$addressInfo")]),
          imgList: $.split(["$spGoodsInfo.imgList", "---"]),
        },
      })
      .end();
    return this.processResponseData(res, "根据分类查询订单");
  }
};
