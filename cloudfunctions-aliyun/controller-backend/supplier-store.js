/**
 * @file 供应商仓库相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/24 11:43
 */
const { ControllerBase, db, utils } = require("api");
const { colSpStore, _ } = db;
const { lodash } = utils;
module.exports = class SupplierStore extends ControllerBase {
  /**
   * 新增一条仓库
   */
  async add(options) {
    this.info("(supplier-store)新增一条仓库-入参", options);
    const res = await colSpStore.add(options);
    return this.processResponseData(res, "(supplier-store)新增一条仓库");
  }
  async removeAll() {
    const res = await colSpStore.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "(supplier-store)删除全部仓库");
  }
  /**
   * 修改仓库信息
   */
  async update(options) {
    this.info("(supplier-store)修改仓库信息-入参", options);
    const res = await colSpStore
      .doc(options.storeId)
      .update(lodash.omit(options, ["storeId"]));
    return this.processResponseData(res, "(supplier-store)修改仓库信息");
  }
  /**
   * 根据ID查询单个仓库信息
   */
  async getSingleById(options) {
    this.info("(supplier-store)根据ID查询单个仓库信息-入参", options);
    const { storeId } = options;
    if (!this.checkIsId(storeId)) {
      return this.get400Error("供应商id有误");
    }
    const res = await colSpStore.doc(storeId).get();
    return this.processResponseData(
      res,
      "(supplier-store)根据ID查询单个仓库信息",
      true
    );
  }
};
