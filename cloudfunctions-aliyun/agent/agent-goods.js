const db = require("./db");
const { colSpGoods, colAgGoods } = db;
module.exports = class AgentGoods {
  constructor() {}
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
        goodsCostPrice: true,
        expressCostPrice: "$storeInfo.expressCostPrice",
      })
      .end();
    uniCloud.logger.log("查询所有供应商商品-出参", res);
    return res.affectedDocs ? res.data : [];
  }
  async update() {}
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
  async syncInfo(appId) {
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
      ele.appId = appId;
      return ele;
    });
    await this.add(agGoodsList);
  }
};
