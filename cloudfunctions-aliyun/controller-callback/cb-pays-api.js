/**
 * @file pays api 支付回调
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/18 14:21
 */
const md5 = require('md5');
const Qs = require('qs');
const { db, callFunc } = require('api');
const { colCsFundOrder } = db;

const TOKEN = "3784648214cf83f20ceb9746880033a2";
module.exports = class PaysApi {
  /**
   * 支付回调
   */
  async payed(options) {
    uniCloud.logger.info('支付回调-入参', options);
    // 解析入参
    const params = Qs.parse(options);
    // 验证key合法性
    if (!this.checkKey(params)) {
      return this.getResponse({ statusCode: 400});
    }
    // 查找对应订单
    // 修改订单状态
    const res = await colCsFundOrder.where({
      _id: params.orderid,
      userId: params.orderuid,
      status: 2,
    }).update({
      status: 3,
    });
    uniCloud.logger.info('支付回调,修改订单状态-出参', res);
    if (!res.affectedDocs < 1) {
      return this.getResponse({ statusCode: 500});
    }
    // 新增一条资金明细
    const res2 = callFunc({
      name: 'controller-frontend',
      action: '/customer-fund/payed',
      data: {

      }
    })
    // 原子修改余额
  }
  /**
   * 验证是key是否合法
   */
  checkKey(options) {
    uniCloud.logger.info('验证是key是否合法-入参', options);
    const { orderid, orderuid , paysapi_id , price , realprice , key } = options;
    const myKey = md5(orderid + orderuid + paysapi_id + price + realprice + TOKEN);
    const res = myKey === key;
    uniCloud.logger.info('验证是key是否合法-出参', res);
    return res;
  }
  /**
   * 获取集成响应的响应体
   */
  getResponse(options) {
    return {
      "mpserverlessComposedResponse": true, // 使用阿里云返回集成响应是需要此字段为true
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": { "headerName": "headerValue" },
      "body": "...",
        ...options,
    }
  }
}
