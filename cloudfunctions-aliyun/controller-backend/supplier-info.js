/**
 * @file 供应商信息
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerBase, db } = require("api");
const { colSpInfos } = db;
module.exports = class SupplierInfo extends ControllerBase {
  constructor(appId) {
    super(appId);
  }
  /**
   * 根据ID查询供应商信息
   */
  async getSupplierInfoById(id) {
    uniCloud.logger.info("根据ID查询供应商信息-入参", id);
    const res = await colSpInfos.doc(id).get();
    return this.processResponseData(res, "根据ID查询供应商信息", true);
  }
};
