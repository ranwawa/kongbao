/**
 * @file 供应商商品相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/24 16:58
 */
const { ControllerBase, db, utils } = require("api");
const { _, $, colSpGoods } = db;
const { lodash } = utils;
module.exports = class SupplierGoods extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 添加单个商品
   */
  async add(options) {
    this.info("(supplier-goods)添加商品-入参", options);
    const res = await colSpGoods.add(options);
    return this.processResponseData(res, "(supplier-goods)添加商品");
  }
  /**
   * 删除全部商品
   * @returns {Promise<{deleted: number}>}
   */
  async removeAll() {
    const res = await colSpGoods.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "(supplier-goods)删除全部商品");
  }
  /**
   * 修改商品
   */
  async update(options) {
    this.info("修改商品-入参", options);
    const res = await colSpGoods
      .doc(options.goodsId)
      .update(lodash.omit(options, ["goodsId"]));
    return this.processResponseData(res, "(supplier-goods)修改商品");
  }
  /**
   * 根据ID查询单个商品
   */
  async getSingleById(options) {
    this.info("(supplier-goods)根据ID查询单个商品-入参", options);
    const { goodsId } = options;
    if (!this.checkIsId(goodsId)) {
      return this.get400Error("商品id有误");
    }
    const res = await colSpGoods.doc(goodsId).get();
    return this.processResponseData(
      res,
      "(supplier-goods)根据ID查询单个商品",
      true
    );
  }
  /**
   * 查询多条商品
   */
  async getList(options) {
    this.info("(supplier-goods)查询多条商品-入参", options);
    const { pageSize, currentPage } = options;
    const isVipAgent = false; // 代理分站也要分等级,以区分进货价
    const res = await colSpGoods
      .aggregate()
      .match({ _id: _.exists(true) })
      .addFields({
        spGoodsId: "$_id",
        agentCostPrice: $.cond({
          if: isVipAgent,
          then: "$agentPriceNormal",
          else: "$agentPriceVip",
        }),
      })
      .project({
        _id: false,
        ...this.getTrue([
          "goodsName",
          "content",
          "imgList",
          "sales",
          "spGoodsId",
          "agentCostPrice",
        ]),
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .end();
    return this.processResponseData(res, "(supplier-goods)查询多条商品");
  }
};
