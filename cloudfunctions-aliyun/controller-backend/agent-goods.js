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
  /**
   * 添加金条商品
   */
  async addMore(options) {
    this.info("(agent-goods)添加多条商品-入参", options);
    const res = await colAgGoods.add(options);
    return this.processResponseData(res, "(agent-goods)添加多条商品");
  }
  async removeAll() {
    const res = await colAgGoods.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "(agent-goods)删除全部商品");
  }
};
