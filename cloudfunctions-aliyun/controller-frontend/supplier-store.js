/**
 * @file 供应商仓库相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/16 15:16
 */
const { db, ControllerBase } = require("api");
const { colSpStore } = db;
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
    const { cityId } = options;
    if (typeof cityId !== "string") {
      return new this.ResponseModal(400, {}, "参数有误");
    }
    const res = await colSpStore
      .aggregate()
      .match({ cityId })
      .project({
        spId: false,
        updateTime: false,
        createTime: false,
        isEnable: false,
        isDeleted: false,
        sort: false,
        originInfo: false,
        plCityId: false,
      })
      .lookup({
        from: "kb-sp-store-goods",
        foreignField: "storeId",
        localField: "_id",
        as: "spStoreGoodsInfo",
      })
      .unwind("$spStoreGoodsInfo")
      .replaceRoot({
        newRoot: {
          storeName: "$storeName",
          spGoodsId: "$spStoreGoodsInfo.goodsId",
          expressList: "$expressList",
        },
      })
      .lookup({
        from: "kb-ag-goods",
        foreignField: "spGoodsId",
        localField: "spGoodsId",
        as: "agGoodsInfo",
      })
      .unwind("$agGoodsInfo")
      .addFields({
        goodsName: "$agGoodsInfo.goodsName",
        imgList: "$agGoodsInfo.imgList",
        sales: "$agGoodsInfo.sales",
        inventory: "$agGoodsInfo.inventory",
        content: "$agGoodsInfo.content",
      })
      .project({
        agGoodsInfo: false,
      })
      .end();
    return this.processResponseData(
      res,
      "(platform-cities)根据城市ID查询商品列表"
    );
  }
};
