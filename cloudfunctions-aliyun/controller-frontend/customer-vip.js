const { ControllerAuth, db } = require("api");
const { colCsVip, _ } = db;
module.exports = class VipInfo extends ControllerAuth {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
  /**
   * 获取vip信息列表
   */
  async getList() {
    const res = await colCsVip.where({ _id: _.exists(true) }).get();
    return this.processResponseData(res, "(vip-info)获取vip信息列表");
  }
};
