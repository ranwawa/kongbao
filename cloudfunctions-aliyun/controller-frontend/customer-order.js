/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */

const { ControllerAuth, db } = require('api');
const { colCsOrder } = db;
module.exports = class CustomerOrder extends ControllerAuth {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
};
