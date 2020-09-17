/**
 * @file 用户资金相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 15:20
 */
const { ControllerAuth, db } = require("api");
const { colCsFundOrder, dbCmd } = db;

module.exports = class CustomerFund extends ControllerAuth {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
  /**
   * 创建充值订单
   */
  async add(money, payType) {
    // 新增纪录
    // 请求第3方接口
    // 查找二维码
    // 返回数据
    const now = Date.now();
    const param = {
      money,
      payType,
      appId: this.appId,
      userId: this.userInfo._id,
      isDelete: false,
      createTime: now,
      expireTime: now + 300000,
      status: 1, // 1待响应 2待支付 3已支付 5已超时 6已取消
    };
    uniCloud.logger.info("创建充值订单-入参", param);
    const res = await colCsFundOrder.add(param);
    uniCloud.logger.info("创建充值订单-出参", res);
    return new this.ResponseModal(0, res);
  }

  /**
   * 确认充值订单
   */
  async confirmFundOrder(options) {
    const { money, payType } = options;
    if (
      (typeof money !== "number" && money < 0) ||
      (typeof payType !== "number" && payType > 2)
    ) {
      return new this.ResponseModal(400, {}, "参数有误");
    }
    const addRes = await this.addFundOrder(options);
    if (!addRes.id) {
      return new this.ResponseModal(500, {}, "创建订单失败");
    }
    const [err, data] = await this.paysApi({
      ...options,
      orderId: addRes.id,
    });
    if (err) {
      return new this.ResponseModal(500, {}, err.msg);
    }
  }
};
