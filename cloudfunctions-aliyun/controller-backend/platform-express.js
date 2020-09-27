const { ControllerBase, db } = require("api");
const { colPlExpress, _ } = db;
module.exports = class PlatformExpress extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 获取所有快递
   */
  async getListAll() {
    const res = await colPlExpress.where({ _id: _.exists(true) }).get();
    return this.processResponseData(res, "(platform-express)获取所有商品");
  }
};
