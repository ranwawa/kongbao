/**
 * @file 代理分站商品相关信息
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/16 15:52
 */
const { db, ControllerBase, callFunc, utils } = require("api");
const { $, _, colAgGoods, colPlExpress } = db;
const { lodash, fen2yuan, is } = utils;
module.exports = class SupplierStore extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
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
  async getSingleByGoodsIdAndStoreId(options = {}) {
    this.info("根据商品ID查询商品信息-入参", options);
    const { goodsId = "" } = options;
    if (!this.checkIsId(goodsId)) {
      return new this.ResponseModal(400, {}, "参数异常");
    }
    const [, expressList] = await callFunc({
      name: "controller-backend",
      action: "platform-express/getListAll",
    });
    const res = await colAgGoods
      .aggregate()
      .match({
        appId: this.appId,
        _id: goodsId,
        isEnable: true,
      })
      .addFields({
        agGoodsId: "$_id",
        showPriceStr: $.divide(["$showPrice", 100]),
        salePriceVipStr: $.divide(["$salePriceVip", 100]),
        salePriceNormalStr: $.divide(["$salePriceNormal", 100]),
      })
      .project(this.getFalse([...this.baseFields, "_id", "agentCostPrice"]))
      .lookup({
        from: "kb-sp-goods",
        let: { spGoodsId: "$spGoodsId" },
        pipeline: $.pipeline()
          .match(
            _.expr(
              $.and([
                $.eq(["$_id", "$$spGoodsId"]),
                $.eq(["$isDelete", false]),
                $.eq(["$isEnable", true]),
              ])
            )
          )
          .project({ _id: false, inventory: true, storeId: true })
          .done(),
        as: "spGoodsInfo",
      })
      .unwind("$spGoodsInfo")
      .replaceRoot({
        newRoot: $.mergeObjects(["$$ROOT", "$spGoodsInfo"]),
      })
      .project({ spGoodsInfo: false })
      .lookup({
        from: "kb-sp-stores",
        let: { storeId: "$storeId" },
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$_id", "$$storeId"])))
          .addFields({
            cityId: "$cityInfo.cityId",
            cityName: "$cityInfo.cityName",
            expressName: "$expressInfo.expressName",
            expressPrice: "$expressInfo.expressCostPrice",
            expressPriceStr: $.divide(["$expressInfo.expressCostPrice", 100]),
          })
          .project({
            _id: false,
            ...this.getTrue([
              "cityId",
              "remark",
              "cityName",
              "expressName",
              "expressPrice",
              "expressPriceStr",
              "storeName",
              "formattedAddress",
            ]),
          })
          .done(),
        as: "spStoreInfo",
      })
      .unwind("$spStoreInfo")
      .replaceRoot({
        newRoot: $.mergeObjects(["$$ROOT", "$spStoreInfo"]),
      })
      .addFields({ goodsId: "$agGoodsId" })
      .project({ spStoreInfo: false, agGoodsId: false })
      .end();
    return this.processResponseData(res, "根据商品ID查询商品信息", true);
  }
  /**
   * 根据商品ID查询完整的商品信息
   */
  async getSingleCompleteByGoodsIdAndStoreId(options) {
    this.info("根据商品ID查询完整的商品信息-入参", options);
    const res = await colAgGoods
      .aggregate()
      .match({
        _id: options.goodsId,
        appId: this.appId,
        isEnable: true,
      })
      .addFields({ agGoodsInfo: "$$ROOT" })
      .lookup({
        from: "kb-sp-goods",
        let: { spGoodsId: "$spGoodsId" },
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$_id", "$$spGoodsId"])))
          .done(),
        as: "spGoodsInfo",
      })
      .unwind("$spGoodsInfo")
      .lookup({
        from: "kb-sp-stores",
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$_id", options.storeId])))
          .done(),
        as: "spStoreInfo",
      })
      .unwind("$spStoreInfo")
      .project({
        _id: false,
        ...this.getTrue(["agGoodsInfo", "spGoodsInfo", "spStoreInfo"]),
      })
      .end();
    return this.processResponseData(res, "查询完整商品信息", true);
  }
};
