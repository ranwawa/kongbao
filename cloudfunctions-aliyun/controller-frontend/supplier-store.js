/**
 * @file 供应商仓库相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/16 15:16
 */
const { db, ControllerBase } = require("api");
const { colSpStore, $, _ } = db;
module.exports = class SupplierStore extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 获取仓库列表
   */
  async getList() {
    const res = await colSpStore
      .where({
        isDeleted: false,
        isEnable: true,
      })
      .field({
        _id: false,
        storeName: true,
        storeCode: true,
      })
      .get();
    return this.processResponseData(res, "获取仓库列表");
  }
  /**
   * 根据城市ID查询商品列表
   */
  async getGoodsListByCityId(options) {
    this.info("(platform-cities)根据城市ID查询商品列表-入参", options);
    const { cityId, currentPage = 1, pageSize = 10 } = options;
    if (
      typeof cityId !== "string" ||
      typeof currentPage !== "number" ||
      typeof pageSize !== "number"
    ) {
      return new this.ResponseModal(400, {}, "参数有误");
    }
    const res = await colSpStore
      .aggregate()
      .match({
        "cityInfo.cityId": cityId,
        isEnable: true,
        isDelete: false,
      })
      .addFields({
        storeId: "$_id",
        cityId: cityId,
        cityName: "$cityInfo.cityName",
        expressName: "$expressInfo.expressName",
        expressPrice: "$expressInfo.expressCostPrice",
        expressPriceStr: $.divide(["$expressInfo.expressCostPrice", 100]),
      })
      .project(
        this.getFalse([
          "_id",
          "cityInfo",
          "expressInfo",
          "originInfo",
          ...this.baseFields,
        ])
      )
      .lookup({
        from: "kb-sp-goods",
        let: { storeId: "$storeId" },
        pipeline: $.pipeline()
          .match(
            _.expr(
              $.and([
                $.eq(["$storeId", "$$storeId"]),
                $.eq(["$isDelete", false]),
                $.eq(["$isEnable", true]),
              ])
            )
          )
          .addFields({ spGoodsId: "$_id" })
          .project({ _id: false, inventory: true, spGoodsId: true })
          .done(),
        as: "spGoodsInfo",
      })
      .unwind("$spGoodsInfo")
      .replaceRoot({ newRoot: $.mergeObjects(["$$ROOT", "$spGoodsInfo"]) })
      .project({ spGoodsInfo: false })
      .lookup({
        from: "kb-ag-goods",
        let: { spGoodsId: "$spGoodsId" },
        pipeline: $.pipeline()
          .match(
            _.expr(
              $.and([
                $.eq(["$spGoodsId", "$$spGoodsId"]),
                $.eq(["$appId", this.appId]),
                $.eq(["$isEnable", true]),
              ])
            )
          )
          .addFields({
            agGoodsId: "$_id",
            showPriceStr: $.divide(["$showPrice", 100]),
            salePriceVipStr: $.divide(["$salePriceVip", 100]),
            salePriceNormalStr: $.divide(["$salePriceNormal", 100]),
          })
          .project({
            _id: false,
            ...this.getTrue([
              "goodsName",
              "imgList",
              "content",
              "agGoodsId",
              "showPriceStr",
              "salePriceVipStr",
              "salePriceNormalStr",
              "sales",
            ]),
          })
          .done(),
        as: "agGoodsInfo",
      })
      .unwind("$agGoodsInfo")
      .replaceRoot({
        newRoot: $.mergeObjects(["$$ROOT", "$agGoodsInfo"]),
      })
      .addFields({ goodsId: "$agGoodsId" })
      .project({ agGoodsInfo: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .end();
    return this.processResponseData(
      res,
      "(platform-cities)根据城市ID查询商品列表"
    );
  }
};
