/**
 * @file 代理分站商品相关信息
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/16 15:52
 */
const { db, ControllerBase } = require("api");
const { $, colAgGoods } = db;
module.exports = class SupplierStore extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }

  /**
   * 根据仓库编号获取商品列表
   */
  async getListByStoreCode(options = {}) {
    uniCloud.logger.log("根据仓库编号获取商品列表-入参", options);
    const { pageSize = 10, currentPage = 1, storeCode } = options;
    if (
      typeof pageSize !== "number" ||
      pageSize < 1 ||
      pageSize > 199 ||
      typeof currentPage !== "number" ||
      typeof storeCode !== "string"
    ) {
      return new this.ResponseModal(400, {}, "参数异常");
    }
    const res = await colAgGoods
      .aggregate()
      .match({
        appId: this.appId,
        isEnable: true,
      })
      .lookup({
        from: "kb-sp-goods",
        localField: "spGoodsId",
        foreignField: "_id",
        as: "spGoodsInfoList",
      })
      .addFields({
        spGoodsInfo: $.arrayElemAt(["$spGoodsInfoList", 0]),
      })
      .match({
        "spGoodsInfo.storeCode": storeCode,
        "spGoodsInfo.isDeleted": false,
        "spGoodsInfo.isEnable": true,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .project({
        showPrice: true,
        salePriceVip: true,
        salePriceNormal: true,
        spGoodsInfo: true,
        goodsId: "$_id",
        imgList: "$spGoodsInfo.imgList",
        expressName: "$spGoodsInfo.expressName",
        goodsName: "$spGoodsInfo.goodsName",
        sales: "$spGoodsInfo.sales",
      })
      .addFields({
        showPriceStr: $.divide(["$showPrice", 100]),
        salePriceVipStr: $.divide(["$salePriceVip", 100]),
        salePriceNormalStr: $.divide(["$salePriceNormal", 100]),
      })
      .project({
        _id: false,
        spGoodsInfo: false,
      })
      .end();
    res.data = res.data.map((ele) => {
      ele.sales > 9999 && (ele.sales = `${(ele.sales / 10000).toFixed(1)}w`);
      return ele;
    });
    return this.processResponseData(res, "查询推荐商品", false);
  }
  /**
   * 查询推荐商品
   * @returns {Promise<void>}
   */
  async getListRecommend() {
    const res = await colAgGoods
      .aggregate()
      .match({
        appId: this.appId,
        isEnable: true,
      })
      .sort({ sort: 1 })
      .lookup({
        from: "kb-sp-goods",
        localField: "spGoodsId",
        foreignField: "_id",
        as: "spGoodsInfoList",
      })
      .addFields({
        spGoodsInfo: $.arrayElemAt(["$spGoodsInfoList", 0]),
      })
      .project({
        showPrice: true,
        salePriceVip: true,
        salePriceNormal: true,
        spGoodsInfo: true,
        showPriceStr: $.divide(["$showPrice", 100]),
        salePriceVipStr: $.divide(["$salePriceVip", 100]),
        salePriceNormalStr: $.divide(["$salePriceNormal", 100]),
        goodsId: "$_id",
        imgList: "$spGoodsInfo.imgList",
        expressName: "$spGoodsInfo.expressName",
        goodsName: "$spGoodsInfo.goodsName",
        sales: "$spGoodsInfo.sales",
      })
      .project({
        _id: false,
        spGoodsInfo: false,
      })
      .limit(10)
      .end();
    res.data = res.data.map((ele) => {
      ele.sales > 9999 && (ele.sales = `${(ele.sales / 10000).toFixed(1)}w`);
      return ele;
    });
    return this.processResponseData(res, "查询推荐商品", false);
  }

  /**
   * 根据商品ID查询商品信息
   */
  async getSingleByGoodsId(options = {}) {
    uniCloud.logger.log("根据商品ID查询商品信息-入参", options);
    const { goodsId = "" } = options;
    if (typeof goodsId !== "string" || goodsId.length !== 32) {
      return new this.ResponseModal(400, {}, "参数异常");
    }
    const res = await colAgGoods
      .aggregate()
      .match({
        appId: this.appId,
        _id: goodsId,
        isEnable: true,
      })
      .lookup({
        from: "kb-sp-goods",
        localField: "spGoodsId",
        foreignField: "_id",
        as: "spGoodsInfoList",
      })
      .addFields({
        spGoodsInfo: $.arrayElemAt(["$spGoodsInfoList", 0]),
      })
      .lookup({
        from: "kb-sp-stores",
        localField: "spGoodsInfo.storeCode",
        foreignField: "storeCode",
        as: "spStoreInfoList",
      })
      .addFields({
        spStoreInfo: $.arrayElemAt(["$spStoreInfoList", 0]),
      })
      .replaceRoot({
        newRoot: {
          goodsId: "$_id",
          showPrice: "$showPrice",
          salePriceVip: "$salePriceVip",
          salePriceNormal: "$salePriceNormal",
          showPriceStr: $.divide(["$showPrice", 100]),
          salePriceVipStr: $.divide(["$salePriceVip", 100]),
          salePriceNormalStr: $.divide(["$salePriceNormal", 100]),
          goodsName: "$spGoodsInfo.goodsName",
          imgList: $.split(["$spGoodsInfo.imgList", "----"]),
          content: "$spGoodsInfo.content",
          sales: "$spGoodsInfo.sales",
          storeName: "$spGoodsInfo.storeName",
          expressName: "$spGoodsInfo.expressName",
          shipAddress: "$spStoreInfo.shipAddress",
          notSendAddress: "$spStoreInfo.notSendAddress",
        },
      })
      .end();
    return this.processResponseData(res, "根据商品ID查询商品信息", true);
  }
  /**
   * 根据商品ID查询完整的商品信息
   */
  async getSingleCompleteByGoodsId(goodsId) {
    uniCloud.logger.log("根据商品ID查询完整的商品信息-入参", goodsId);
    const res = await colAgGoods
      .aggregate()
      .match({
        _id: goodsId,
        appId: this.appId,
        isEnable: true,
      })
      .lookup({
        from: "kb-sp-goods",
        localField: "spGoodsId",
        foreignField: "_id",
        as: "spGoodsInfoList",
      })
      .addFields({
        spGoodsInfo: $.arrayElemAt(["$spGoodsInfoList", 0]),
      })
      .lookup({
        from: "kb-sp-stores",
        localField: "spGoodsInfo.storeId",
        foreignField: "_id",
        as: "spStoreInfoList",
      })
      .addFields({
        spStoreInfo: $.arrayElemAt(["$spStoreInfoList", 0]),
      })
      .replaceRoot({
        newRoot: {
          csGoodsInfo: {
            goodsId: "$_id",
            spGoodsId: "$spGoodsId",
            expressCostPrice: "$expressCostPrice",
            goodsCostPrice: "$goodsCostPrice",
            costPrice: "$costPrice",
            isEnable: "$isEnable",
            salePriceVip: "$salePriceVip",
            salePriceNormal: "$salePriceNormal",
            storeCode: "$spGoodsInfo.storeCode",
            goodsCode: "$goodsCode",
          },
          spGoodsInfo: "$spGoodsInfo",
          spStoreInfo: "$spStoreInfo",
        },
      })
      .end();
    return this.processResponseData(res, "查询完整商品信息", true);
  }
};
