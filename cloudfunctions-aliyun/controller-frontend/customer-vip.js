const { ControllerAuth, db } = require("api");
const { colCsVip, _, $ } = db;
module.exports = class VipInfo extends ControllerAuth {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
  /**
   * 获取vip信息列表
   */
  async getList() {
    const res = await colCsVip
      .aggregate()
      .match({ appId: this.appId, isDelete: false })
      .addFields({
        vipId: "$_id",
        priceStr: $.divide(["$price", 100]),
        activityPriceStr: $.divide(["$activityPrice", 100]),
      })
      .project({
        _id: false,
        vipId: true,
        priceStr: true,
        activityPriceStr: true,
        title: true,
        describe: true,
      })
      .end();
    return this.processResponseData(res, "(customer-vip)获取vip信息列表");
  }
  /**
   * 根据id查询详情
   */
  async getSingleById(options) {
    uniCloud.logger.info("(customer-vip)根据id查询详情-入参", options);
    const res = await colCsVip
      .aggregate()
      .match({
        _id: options.vipId,
        appId: this.appId,
        isDelete: false,
      })
      .end();
    return this.processResponseData(res, "(vip-info)根据id查询详情", true);
  }
};
