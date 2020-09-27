/**
 * @file 将供应商商品同步到分站
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/25 17:14
 */
const { ControllerBase, db, utils } = require("api");
const AgentGoods = require("./agent-goods");
const SupplierGoods = require("./supplier-goods");
const { md5 } = utils;
module.exports = class GoodsOperate extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
    this.agentGoods = new AgentGoods(appId, userInfo);
    this.supplierGoods = new SupplierGoods(appId, userInfo);
  }
  /**
   * 初始化代理分站商品
   */
  async initAgentGoods(options) {
    this.info("(goods-operate)初始化代理分站商品-入参", options);
    const { appId } = options;
    if (typeof appId !== "string") {
      return new this.ResponseModal(400, "", "参数有误");
    }
    const spGoodsList = await this.getSupplierGoodsAll();
    const agGoodsList = spGoodsList.map((ele) => {
      const costPrice = ele.agentCostPrice;
      return {
        _id: md5(`${appId}-${ele.spGoodsId}`),
        appId: appId,
        showPrice: costPrice + 100,
        salePriceNormal: costPrice + 50, // 普通用户一单 赚5毛
        salePriceVip: costPrice + 30, // vip用户每间赚 3毛
        ...ele,
        ...this.getBaseFields(),
      };
    });
    const res = await this.agentGoods.addMore(agGoodsList);
  }
  /**
   * 查询所有供应商商品
   */
  async getSupplierGoodsAll() {
    const spGoodsList = [];
    const currentPage = 1;
    const pageSize = 100;
    let count = 0;
    do {
      const res = await this.supplierGoods.getList({ currentPage, pageSize });
      count = res.data.length;
      spGoodsList.push(...res.data);
    } while (count === pageSize);
    this.info(
      "(goods-operate)初始化代理分站商品-出参",
      spGoodsList.length + "条"
    );
    return spGoodsList;
  }
};
