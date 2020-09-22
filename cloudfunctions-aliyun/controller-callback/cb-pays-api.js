/**
 * @file pays api 支付回调
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 14:21
 */
const md5 = require("md5");
const Qs = require("qs");
const { callFunc } = require("api");

const TOKEN = "3784648214cf83f20ceb9746880033a2";
module.exports = class PaysApi {
  /**
   * 支付回调
   */
  async payed(options) {
    uniCloud.logger.info("支付回调-入参", options);
    // 解析入参
    const params = Qs.parse(options);
    // 验证key合法性
    if (!this.checkKey(params)) {
      return this.getResponse({ statusCode: 400 });
    }
    const [userId, appId] = params.orderuid.split("and");
    const data = {
      userId,
      appId,
      fundOrderId: params.orderid,
      realPrice: +(+params.realprice * 100).toFixed(2),
    };
    // 查找对应订单
    // 修改订单状态
    const [err, res] = await this.updateFundOrderStatus(data);
    if (err || res.affectedDocs < 1) {
      return this.getResponse({ statusCode: 500 });
    }
    // 新增一条资金明细
    const [err2, res2] = await this.addFund(data);
    if (err2 || !res2.id) {
      return this.getResponse({ statusCode: 500 });
    }
    // 原子修改余额
    const [err3, res3] = await this.updateBalance(data);
    if (err3 || res3.affectedDocs < 1) {
      return this.getResponse({ statusCode: 500 });
    }
    return this.getResponse({ statusCode: 200 });
  }
  /**
   * 添加一条资金明细
   */
  async addFund(options) {
    uniCloud.logger.info("支付回调,添加一条资金明细-入参", options);
    const res = await callFunc({
      name: "controller-backend",
      action: "/customer-fund/add",
      data: {
        type: 11,
        price: options.realPrice,
        remarkId: options.fundOrderId,
        appId: options.appId,
        userId: options.userId,
      },
    });
    uniCloud.logger.info("支付回调,添加一条资金明细-出参", options);
    return res;
  }

  /**
   * 更新充值订单状态
   */
  async updateFundOrderStatus(options) {
    uniCloud.logger.info("支付回调,更新充值订单状态-入参", options);
    const res = await callFunc({
      name: "controller-backend",
      action: "customer-fund-order/update",
      data: {
        ...options,
        preStatus: 2,
        nextStatus: 3,
      },
    });
    uniCloud.logger.info("支付回调,更新充值订单状态-出参", res);
    return res;
  }

  /**
   * 更新余额
   */
  async updateBalance(options) {
    uniCloud.logger.info("支付回调,更新余额-入参", options);
    const res = await callFunc({
      name: "controller-backend",
      action: "user-anonymous/updateBalance",
      data: {
        userId: options.userId,
        appId: options.appId,
        price: options.realPrice,
      },
    });
    uniCloud.logger.info("支付回调,更新余额-出参", res);
    return res;
  }
  /**
   * 验证是key是否合法
   */
  checkKey(options) {
    uniCloud.logger.info("验证是key是否合法-入参", options);
    const { orderid, orderuid, paysapi_id, price, realprice, key } = options;
    const myKey = md5(
      orderid + orderuid + paysapi_id + price + realprice + TOKEN
    );
    const res = myKey === key;
    uniCloud.logger.info("验证是key是否合法-出参", res);
    return res;
  }
  /**
   * 获取集成响应的响应体
   */
  getResponse(options) {
    return {
      mpserverlessComposedResponse: true, // 使用阿里云返回集成响应是需要此字段为true
      isBase64Encoded: false,
      statusCode: 200,
      headers: { headerName: "headerValue" },
      body: "...",
      ...options,
    };
  }
};
