/**
 * @file 供应商商品相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/24 16:58
 */
const { ControllerBase, db, utils } = require("api");
const { _, colSpGoods } = db;
const { lodash } = utils;
module.exports = class SupplierGoods extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 添加单个商品
   */
  async add(options) {
    uniCloud.logger.info("添加商品-入参", options);
    const res = await colSpGoods.add(options);
    return this.processResponseData(res, "添加商品");
  }
  /**
   * 删除全部商品
   * @returns {Promise<{deleted: number}>}
   */
  async removeAll() {
    const res = await colSpGoods.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "删除全部商品");
  }
  /**
   * 修改商品
   */
  async update(options) {
    uniCloud.logger.info("修改商品-入参", options);
    const res = await colSpGoods
      .doc(options.goodsId)
      .update(lodash.omit(options, ["goodsId"]));
    return this.processResponseData(res, "修改商品");
  }
  /**
   * 根据ID查询单个商品
   */
  async getSingleById(options) {
    uniCloud.logger.info("(supplier-goods)根据ID查询单个商品-入参", options);
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
};
