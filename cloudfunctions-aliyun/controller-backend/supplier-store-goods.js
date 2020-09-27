/**
 * @file 仓库商品关联表
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/24 17:52
 */
const { ControllerBase, db, utils } = require("api");
const { _, colSpStoreGoods } = db;
const { lodash } = utils;

module.exports = class SupplierStoreGoods extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 添加仓库商品关联
   */
  async add(options) {
    this.info("(supplier-store-goods)添加仓库商品关联-入参", options);
    const res = await colSpStoreGoods.add(
      lodash.pick(options, ["storeId", "goodsId"])
    );
    return this.processResponseData(
      res,
      "(supplier-store-goods)添加仓库商品关联",
      true
    );
  }
  async removeAll() {
    const res = await colSpStoreGoods.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "(supplier-store-goods)删除全部关联");
  }
};
