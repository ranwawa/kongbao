/**
 * @file 用户售后地址相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:09
 */
const { db, ControllerBase } = require("api");
const { colCsService, _ } = db;
module.exports = class CustomerService extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  async removeAll() {
    const res = await colCsService.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "(customer-service)删除全部售后信息");
  }
};
