/**
 * @file 用户资金明细相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:09
 */
const { db, ControllerAuth } = require("api");
const { colCsFund } = db;
module.exports = class CustomerFund extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
};
