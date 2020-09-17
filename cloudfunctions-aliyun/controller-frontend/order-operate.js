/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { ControllerAuth, apiPaysApi } = require("api");
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
      payType !== 1
    ) {
      return new this.ResponseModal(400, "参数异常");
    }
    const res = await this.customerFundOrder.add(money, payType);
    if (res.code !== 0) {
      return new this.ResponseModal(500, "创建充值订单失败");
    }
    const [err, data] = await apiPaysApi.pay(
      payType,
      money,
      res.data.id,
      this.userInfo._id
    );
    return err || data;
  }
};
