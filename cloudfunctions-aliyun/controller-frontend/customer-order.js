/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { ControllerAuth, db, utils } = require("api");
const { colCsOrder, colCsOrderSub, $, _ } = db;
const { moment, md5, lodash } = utils;
function isId(id) {
  return typeof id === "string" && id.length === 32;
}
const FORMATTER = "YYYY-MM-DD HH:mm:ss";
module.exports = class CustomerOrder extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 查询单条订单
   */
  async getSingle(options) {
    this.info("(customer-order)查询单条订单-入参", options);
    const { orderId } = options;
    if (!isId(orderId)) {
      return new this.ResponseModal(400, {}, "订单信息有误");
    }
    const param = {
      appId: this.appId,
      userId: this.userInfo._id,
      _id: orderId,
      isDelete: false,
    };
    const res = await colCsOrder
      .aggregate()
      .match(param)
      .lookup({
        from: "kb-cs-order-sub",
        pipeline: $.pipeline()
          .match(_.expr($.eq([orderId, "$orderId"])))
          .project({ _id: false, formattedAddress: true, expressNo: true })
          .done(),
        as: "addressList",
      })
      .addFields({
        orderId,
        amountStr: $.divide(["$amountCustomer", 100]),
        amount: "$amountCustomer",
        serviceInfo: "$serviceInfo.formattedAddress",
        storeTime: "$spBuyTime",
        num: $.size("$addressList"),
        goodsInfo: {
          goodsId: "$agGoodsInfo._id",
          expressName: "$spStoreInfo.expressInfo.expressName",
          storeName: "$spStoreInfo.storeName",
          dealPriceStr: $.divide(["$dealPriceCustomer", 100]),
          goodsName: "$agGoodsInfo.goodsName",
          imgList: "$agGoodsInfo.imgList",
        },
      })
      .project({
        _id: false,
        ...this.getTrue([
          "orderId",
          "amountStr",
          "amount",
          "serviceInfo",
          "storeTime",
          "status",
          "createTime",
          "payTime",
          "num",
          "addressList",
          "goodsInfo",
        ]),
      })
      .end();
    res.data = res.data.map((ele) => {
      ele.createTimeStr = moment(ele.createTime).utcOffset(8).format(FORMATTER);
      ele.storeTime &&
        (ele.storeTimeStr = moment(ele.storeTime)
          .utcOffset(8)
          .format(FORMATTER));
      ele.payTime &&
        (ele.payTimeStr = moment(ele.payTime).utcOffset(8).format(FORMATTER));
      return ele;
    });
    return this.processResponseData(res, "(customer-order)查询单条订单", true);
  }
  /**
   * 根据分类查询订单
   */
  async getListByStatus(options) {
    const { currentPage = 1, pageSize = 10, status = -1 } = options;
    const param = {
      appId: this.appId,
      userId: this.userInfo._id,
      isDelete: false,
    };
    status !== -1 && (param.status = status);
    this.info("(customer-order)根据分类查询订单-入参", param);
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
        num: $.divide(["$amountCustomer", "$dealPriceCustomer"]),
        orderId: "$_id",
        amount: "$amountCustomer",
        amountStr: $.divide(["$amountCustomer", 100]),
        goodsInfo: {
          goodsId: "$agGoodsInfo._id",
          expressName: "$spStoreInfo.expressInfo.expressName",
          goodsName: "$agGoodsInfo.goodsName",
          num: "$num",
          storeName: "$spStoreInfo.storeName",
          dealPriceStr: $.divide(["$dealPriceCustomer", 100]),
          imgList: "$agGoodsInfo.imgList",
        },
      })
      .end();
    res.data = res.data.map((ele) => {
      ele.createTimeStr = moment(ele.createTime).utcOffset(8).format(FORMATTER);
      return ele;
    });
    return this.processResponseData(res, "(customer-order)根据分类查询订单");
  }
};
