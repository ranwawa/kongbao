/**
 * @file 将供应商商品同步到分站
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/25 17:14
 */
const { ControllerBase, db, utils } = require("api");
const { colAgGoods, colSpGoods, _ } = db;
const { md5 } = utils;
module.exports = class GoodsOperate extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
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
    const spGoodsList = await this.getAgentGoodsAll();
    const now = Date.now();
    spGoodsList.map((ele) => {
      // 每件商品赚5分钱
      const costPrice = ele.goodsCostPrice + 5;
      ele.costPrice = ele.salePriceNormal = ele.salePriceVip = ele.showPrice = costPrice;
      ele.appId = appId;
      ele.spGoodsId = ele._id;
      ele._id = md5(`${appId}-${ele._id}`);
      ele.sort = 0;
      ele.isEnable = true;
      ele.createTime = ele.updateTime = now;
      return ele;
    });
    const res = await colAgGoods.add(spGoodsList);
    console.log(res);
  }
  /**
   * 查询所有供应商商品
   */
  async getAgentGoodsAll() {
    const spGoodsList = [];
    const currentPage = 1;
    const pageSize = 100;
    let count = 0;
    do {
      const res = await colSpGoods
        .where({ _id: _.exists(true) })
        .field({
          _id: true,
          goodsName: true,
          content: true,
          imgList: true,
          sales: true,
          goodsCostPrice: true,
        })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .get();
      count = res.affectedDocs;
      spGoodsList.push(...res.data);
    } while (count > pageSize);
    this.info(
      "(goods-operate)初始化代理分站商品-出参",
      spGoodsList.length + "条"
    );
    return spGoodsList;
  }
};
