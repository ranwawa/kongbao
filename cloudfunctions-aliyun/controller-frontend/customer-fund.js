/**
 * @file 用户资金明细相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 17:09
 */
const { db, utils, ControllerAuth } = require("api");
const { $, colCsFund } = db;
const { moment } = utils;
console.log(111111111111, utils);
module.exports = class CustomerFund extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 根据类型获取列表
   */
  async getListByIsIncome(options) {
    uniCloud.logger.info("(customer-fund)根据类型获取列表-入参", options);
    const { currentPage = 1, pageSize = 20, isIncome = true } = options;
    const res = await colCsFund
      .aggregate()
      .match({
        isIncome,
        isDelete: false,
        appId: this.appId,
        userId: this.userId,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .project({
        _id: false,
        price: true,
        createTime: true,
        type: true,
      })
      .addFields({
        priceStr: $.divide(["$price", 100]),
      })
      .sort({ createTime: 1 })
      .end();
    res.data = res.data.map((ele) => {
      ele.createTimeStr = moment(ele.createTime).format("YYYY-MM-DD HH:mm:ss");
      return ele;
    });
    return this.processResponseData(res, "(customer-fund)根据类型获取列表");
  }
};
