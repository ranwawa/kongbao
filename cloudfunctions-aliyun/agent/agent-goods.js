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
        goodsId: "$_id",
        goodsCode: "$goodsCode",
        spId: "$spId",
        goodsCostPrice: true,
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
    const { pageSize = 11, currentPage = 1 } = param;
    const res = await colAgGoods
      .aggregate()
      .match({
        appId: this.appId,
        _id: dbCmd.exists(true),
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lookup({
        from: "kb-sp-goods",
        localField: "goodsId",
        foreignField: "_id",
        as: "spGoodsInfo",
      })
      .unwind({
        path: "$spGoodsInfo",
      })
      .match({
        "spGoodsInfo.storeCode": param.storeCode,
        "spGoodsInfo.isDeleted": false,
        "spGoodsInfo.isEnable": true,
      })
      .project({
        createTime: false,
        updateTime: false,
        isEnable: false,
        sort: false,
        goodsId: false,
        expressCostPrice: false,
        goodsCostPrice: false,
        "spGoodsInfo._id": false,
        "spGoodsInfo.price": false,
        "spGoodsInfo.spId": false,
        "spGoodsInfo.sort": false,
        "spGoodsInfo.updateTime": false,
        "spGoodsInfo.createTime": false,
        "spGoodsInfo.isDeleted": false,
        "spGoodsInfo.isEnable": false,
        "spGoodsInfo.thirdObj": false,
      })
      .project({
        goodsInfo: $.mergeObjects(["$$ROOT", "$spGoodsInfo"]),
      })
      .project({
        spGoodsInfo: false,
      })
      .replaceRoot({
        newRoot: "$goodsInfo",
      })
      .end();
    uniCloud.logger.log("查询某个代理的所有商品信息-出参", res);
    let data = res.affectedDocs ? res.data : [];
    data = data.map((ele) => {
      ele.sales > 9999 && (ele.sales = `${(ele.sales / 10000).toFixed(1)}w`);
      return ele;
    });
    return new ResponseModal(0, data);
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
      goodsCostPrice = +goodsCostPrice;
      expressCostPrice = +expressCostPrice;
      const costPrice = goodsCostPrice + expressCostPrice + 0.1;
      ele.costPrice = ele.salePriceNormal = ele.salePriceVip = ele.showPrice = costPrice.toFixed(
        2
      );
      ele.isEnable = true;
      ele.sort = 0;
      ele.createTime = ele.updateTime = now;
      ele.appId = this.appId;
      ele._id = md5(`${this.appId}-${ele.goodsId}`);
      return ele;
    });
    await this.add(agGoodsList);
  }
};
