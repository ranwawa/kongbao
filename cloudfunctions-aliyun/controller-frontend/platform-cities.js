/**
 * @file 所支持的城市相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/25 14:29
 */

const { ControllerBase, db } = require("api");
const { colPlCities, _, $ } = db;
module.exports = class PlatformCities extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 查询所有城市
   */
  async getList() {
    const res = await colPlCities
      .aggregate()
      .match({ _id: _.exists(true) })
      .project({ _id: false })
      .end();
    return this.processResponseData(res, "(platform-cities)查询所有城市");
  }
};
