/**
 * @file 用户资金相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 15:20
 */
const md5 = require("md5");
const { ControllerAuth, db, request } = require("api");
const { colCsFundOrder, dbCmd } = db;
const NOTIFY_URL =
  "https://66108fd9-83f0-4fda-9219-f9fe3a6a377e.bspapp.com/http/cb/payapi";
const UID = "77c561bf719cd7cb972f8b9e";
const TOKEN = "3784648214cf83f20ceb9746880033a2";
module.exports = class CustomerFund extends ControllerAuth {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
  /**
   * 创建充值订单
   */
  async addFundOrder(options) {
    // 新增纪录
    // 请求第3方接口
    // 查找二维码
    // 返回数据
    uniCloud.logger.info("创建充值订单-入参", options);
    const now = Date.now();
    const res = await colCsFundOrder.add({
      money: options.money,
      payType: options.payType,
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
      createTime: now,
      expireTime: now + 300000,
      status: 1, // 1待响应 2待支付 3已支付 5已超时 6已取消
    });
    uniCloud.logger.info("新增收款二维码-出参", res);
    return res;
  }
  /**
   * 调起paysApi接口
   * @returns {Promise<void>}
   */
  async paysApi(options) {
    uniCloud.logger.info("调起paysApi接口-入参", options);
    const { payType, orderId, money } = options;
    const key = md5(
      payType +
        NOTIFY_URL +
        orderId +
        this.userId +
        money +
        NOTIFY_URL +
        TOKEN +
        UID
    );
    const res = await request({
      url: "https://pay.bearsoftware.net.cn/?format=json",
      contentType: "application/json",
      data: {
        istype: payType,
        notify_url: NOTIFY_URL,
        orderid: orderId,
        orderuid: this.userId,
        price: money,
        return_url: NOTIFY_URL,
        uid: UID,
        key,
      },
    });
    uniCloud.logger.info("调起paysApi接口-出参", res);
    return res;
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
