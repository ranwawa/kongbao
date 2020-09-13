const db = require("./db");
const api = require("api");
const md5 = require("md5");
const { ResponseModal } = api;
const { colSpGoods, colAgGoods, dbCmd, $ } = db;
module.exports = class AgentGoods {
  constructor(appId) {
    if (!appId) {
      throw new Error("请传入appId");
    }
    this.appId = appId;
  }
  /**
   * 获取所有供应商商品
   * @returns {Promise<Object>}
   */
  async getSpGoodsList() {
    const res = await colSpGoods
      .aggregate()
      .match({
        isEnable: true,
        isDeleted: false,
      })
      .lookup({
        localField: "storeCode",
        from: "kb-sp-stores",
        foreignField: "storeCode",
        as: "storeInfo",
      })
      .unwind({
        path: "$storeInfo",
      })
      .project({
        spGoodsId: "$_id",
        goodsCode: "$goodsCode",
        spId: "$spId",
        goodsCostPrice: true,
        _id: false,
        expressCostPrice: "$storeInfo.expressCostPrice",
      })
      .end();
    uniCloud.logger.log("查询所有供应商商品-出参", res);
    return res.affectedDocs ? res.data : [];
  }
  /**
   * 查询某个代理的所有商品信息
   */
  async getList(param = {}) {
    const { pageSize = 10, currentPage = 1 } = param;
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
        "spGoodsInfo.storeCode": param.storeCode,
        "spGoodsInfo.isDeleted": false,
        "spGoodsInfo.isEnable": true,
      })
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
      .project({
        _id: false,
        spGoodsInfo: false,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .end();
    res.data = res.data.map((ele) => {
      ele.sales > 9999 && (ele.sales = `${(ele.sales / 10000).toFixed(1)}w`);
      return ele;
    });
    return this.processResponseData(res, "查询推荐商品", false);
  }
  /**
   * 根据商品ID查询商品信息
   * @param param
   */
  async get(param = {}) {
    uniCloud.logger.log("根据商品ID查询商品信息-入参", param);
    const res = await colAgGoods
      .aggregate()
      .match({
        appId: this.appId,
        _id: param.goodsId,
        isEnable: true,
      })
      .lookup({
        from: "kb-sp-goods",
        localField: "spGoodsId",
        foreignField: "_id",
        as: "spGoodsInfoList",
      })
      .lookup({
        from: "kb-sp-stores",
        localField: "spGoodsInfo.storeCode",
        foreignField: "storeCode",
        as: "spStoreInfoList",
      })
      .addFields({
        spGoodsInfo: $.arrayElemAt(["$spGoodsInfoList", 0]),
        spStoreInfo: $.arrayElemAt(["$spStoreInfoList", 0]),
      })
      .replaceRoot({
        newRoot: {
          goodsId: "$_id",
          showPrice: "$showPrice",
          salePriceVip: "$salePriceVip",
          salePriceNormal: "$salePriceNormal",
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
   * 查询推荐商品
   * @returns {Promise<void>}
   */
  async getRecommend() {
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
  async update() {}
  /**
   * 删除所有代理商品
   */
  async removeAll() {
    const res = await colAgGoods.where({ _id: dbCmd.exists(true) }).remove();
    uniCloud.logger.log("删除所有代理商品-出参", res);
    return res;
  }
  /**
   * 新增代理商品
   * @param apGoodsList
   * @returns {Promise<Object>}
   */
  async add(apGoodsList) {
    uniCloud.logger.log("新增代理商品-入参", apGoodsList);
    const res = await colAgGoods.add(apGoodsList);
    uniCloud.logger.log("新增代理商品-出参", res);
    return res.inserted ? res.ids : [];
  }

  async syncInfo() {
    // 查询所有可用的供应商商品
    // 计算代理成本价 = 供应商成本价 + 0.1
    // 计算代理显示价,代理销售价,代理vip销售价
    // 批量插入到代理商品表中
    const spGoodsList = await this.getSpGoodsList();
    const now = Date.now();
    const agGoodsList = spGoodsList.map((ele) => {
      let { goodsCostPrice, expressCostPrice } = ele;
      const costPrice = goodsCostPrice + expressCostPrice + 10;
      ele.costPrice = ele.salePriceNormal = ele.salePriceVip = ele.showPrice = costPrice;
      ele.isEnable = true;
      ele.sort = 0;
      ele.createTime = ele.updateTime = now;
      ele.appId = this.appId;
      ele._id = md5(`${this.appId}-${ele.spGoodsId}`);
      return ele;
    });
    await this.add(agGoodsList);
  }
  /**
   * 加工查询数据
   * 用于按固定格式返回前端
   * @param res
   * @param title
   * @param isPickFirst
   */
  async processResponseData(res, title = "--", isPickFirst = false) {
    uniCloud.logger.log(title + "-出参", res);
    let data = res.affectedDocs ? res.data || [] : [];
    isPickFirst && (data = data[0] || {});
    return new ResponseModal(0, data);
  }
};
