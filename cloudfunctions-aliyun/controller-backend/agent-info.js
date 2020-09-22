/**
 * @file 代理分站信息
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerBase, db } = require("api");
const { colAgInfo, _ } = db;
module.exports = class AgentInfo extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 根据appId修改余额
   */
  async updateBalanceByAppId(options) {
    uniCloud.logger.log("(agent-info)根据appId修改余额-入参", options);
    const res = await colAgInfo
      .where({
        appId: options.appId,
        isDelete: false,
        isEnable: true,
      })
      .update({
        balance: _.inc(options.price),
      });
    return this.processResponseData(res, "(agent-info)根据appId修改余额");
  }
  /**
   * 根据appId查询分站代理余额
   */
  async getSingleByAppId(options) {
    uniCloud.logger.log("(agent-info)根据appId查询分站代理余额-入参", options);
    const res = await colAgInfo
      .where({
        appId: options.appId,
        isDelete: false,
        isEnable: true,
      })
      .get();
    return this.processResponseData(
      res,
      "(agent-info)根据appId查询分站代理余额",
      true
    );
  }
};
