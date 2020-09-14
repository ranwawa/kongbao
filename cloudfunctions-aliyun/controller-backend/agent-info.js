/**
 * @file 代理分站信息
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerAuth, ControllerBase, db } = require("api");
const { colCsOrder } = db;
module.exports = class AgentInfo extends ControllerBase {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
};
