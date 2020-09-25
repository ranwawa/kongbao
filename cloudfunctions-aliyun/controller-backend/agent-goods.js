/**
 * @file 分站商品相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/24 17:52
 */
const { ControllerBase, db, utils } = require("api");
const { _, colAgGoods } = db;

module.exports = class SupplierStoreGoods extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }

  async removeAll() {
    const res = await colAgGoods.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "删除全部商品");
  }
};
