/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { ControllerAuth, apiPaysApi, callFunc } = require("api");
const CustomerOrder = require("./customer-order");
const CustomerFundOrder = require("./customer-fund-order");
const AgentGoods = require("./agent-goods");
function isId(id) {
  return typeof id === "string" && id.length === 32;
}
module.exports = class OrderOperate extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
    this.agentGoods = new AgentGoods(appId, userInfo);
    this.customerOrder = new CustomerOrder(appId, userInfo);
    this.customerFundOrder = new CustomerFundOrder(appId, userInfo);
  }
  /**
   * 确认订单
   */
  async confirmOrder(options = {}) {
    uniCloud.logger.log("确认订单-入参", options);
    const { goodsInfo = {}, serviceInfo = {}, addressInfo = [] } = options;
    if (!isId(goodsInfo.goodsId)) {
      return new this.ResponseModal(400, {}, "该商品已下架");
    }
    if (!Array.isArray(addressInfo) || addressInfo.length < 1) {
      return new this.ResponseModal(400, {}, "请填写收货地址");
    }
    // 处理商品信息
    // 创建订单
    const goodsResult = await this.agentGoods.getSingleCompleteByGoodsId(
      goodsInfo.goodsId
    );
    if (goodsResult.code !== 0) {
      return new this.ResponseModal(400, {}, "商品数据异常");
    }
    const { csGoodsInfo, spGoodsInfo, spStoreInfo } = goodsResult.data;
    const { length = 0 } = addressInfo;
    // 根据用户身份取成交价
    const dealPrice =
      this.userInfo.vipExpireTime > Date.now()
        ? csGoodsInfo.salePriceVip
        : csGoodsInfo.salePriceNormal;
    const customerAmount = dealPrice * length; // 用户成交价
    const agentAmount = csGoodsInfo.costPrice * length; // 分站成交价
    const addRes = await this.customerOrder.add(customerAmount, agentAmount, {
      serviceInfo,
      addressInfo,
      csGoodsInfo,
      spGoodsInfo,
      spStoreInfo,
    });
    if (addRes.code !== 0) {
      return new this.ResponseModal(400, {}, "创建订单失败,请稍后再试");
    }
    return new this.ResponseModal(0, addRes.data);
  }
  /**
   * 确认充值订单
   */
  async confirmFundOrder(options = {}) {
    uniCloud.logger.info("确认充值订单-入参", options);
    const { money, payType } = options;
    if (
      typeof money !== "number" ||
      money <= 0 ||
      typeof payType !== "number" ||
      payType < 1 ||
      payType > 2
    ) {
      return new this.ResponseModal(400, {}, "参数异常");
    }
    // 创建充值订单
    const res = await this.customerFundOrder.add(money, payType);
    const fundOrderId = res.data.id;
    if (res.code !== 0) {
      return new this.ResponseModal(500, "创建充值订单失败");
    }
    // 提交第3方充值软件
    const [res2] = await apiPaysApi.pay(
      payType,
      (money / 100).toFixed(2),
      fundOrderId,
      this.userInfo._id,
      this.appId
    );
    if (!res2 || !res2.data || !res2.data.realprice) {
      return res2;
    }
    // 实际支付金额,如果有返回,则说明第3方接口调用成功
    const realPrice = res2.data.realprice;
    // 更新充值订单状态
    const [err, res3] = await callFunc({
      name: "controller-backend",
      action: "customer-fund-order/update",
      data: {
        fundOrderId,
        realPrice: +(+realPrice * 100).toFixed(2),
      },
    });
    if (err) {
      return err;
    }
    return new this.ResponseModal(0, { fundOrderId });
  }
};
