/**
 * @file 供应商信息
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerBase, db } = require("api");
const { colSpInfos } = db;
module.exports = class SupplierInfo extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }

  /**
   * 根据ID查询供应商信息
   */
  async getSupplierInfoById(options) {
    uniCloud.logger.info("(supplier-info)根据ID查询供应商信息-入参", options);
    const res = await colSpInfos.doc(options.supplierId).get();
    return this.processResponseData(
      res,
      "(supplier-info)根据ID查询供应商信息",
      true
    );
  }
};
