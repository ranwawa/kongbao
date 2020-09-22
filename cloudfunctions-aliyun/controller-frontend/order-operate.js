/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { ControllerAuth, apiPaysApi, callFunc, apiALHC } = require("api");
const CustomerOrder = require("./customer-order");
const CustomerFundOrder = require("./customer-fund-order");
const AgentGoods = require("./agent-goods");
const CustomerVip = require("./customer-vip");
function isId(id) {
  return typeof id === "string" && id.length === 32;
}
const BACK_END = "controller-backend";
module.exports = class OrderOperate extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
    this.agentGoods = new AgentGoods(appId, userInfo);
    this.customerOrder = new CustomerOrder(appId, userInfo);
    this.customerFundOrder = new CustomerFundOrder(appId, userInfo);
    this.customerVip = new CustomerVip(appId, userInfo);
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
      name: BACK_END,
      action: "customer-fund-order/update",
      data: {
        fundOrderId,
        preStatus: 1,
        nextStatus: 2,
        realPrice: +(+realPrice * 100).toFixed(2),
      },
    });
    if (err) {
      return err;
    }
    return new this.ResponseModal(0, { fundOrderId });
  }
  /**
   * 支付
   */
  async pay(options) {
    uniCloud.logger.info("(order-operate)支付-入参", options);
    const { orderId } = options;
    if (typeof orderId !== "string") {
      return new this.ResponseModal(400, {}, "参数异常");
    }
    // 查询订单,用户,分站金额信息
    const res = await this.getAmountInfo(orderId);
    if (!res) {
      return new this.ResponseModal(400, {}, "获取相关信息,数据异常");
    }
    // 判断金额是否足够
    const res2 = this.checkAmount(res);
    if (typeof res2 === "string") {
      return new this.ResponseModal(400, {}, res2);
    }
    // 更新用户和分站资金明细表
    // 更新订单表
    const res3 = await this.updateAmountInfo({ ...res2, orderId });
    if (!res3) {
      return new this.ResponseModal(500, {}, "更新相关信息,数据异常");
    }
    // 请求第3方接口,更新订单状态
    const postData = await this.getPostData(res);
    if (!postData) {
      return new this.ResponseModal(500, {}, "获取第快递公司信息,数据异常");
    }
    const [, res4] = await apiALHC.merchantCreateOrderList(postData);
    if (!res4 || res4.length < 1) {
      return new this.ResponseModal(500, {}, "快递公司下单失败");
    }
    const [, res5] = await this.updateOrderInfo({
      orderId,
      preStatus: 2,
      nextStatus: 3,
      batchNo: res4[0].batchNo,
      spBuyTime: Date.now(),
    });
    if (!res5 || res5.affectedDocs < 1) {
      return new this.ResponseModal(500, {}, "更新订单失败");
    }
    return this.processResponseData(res5, "(order-operate)支付");
  }
  /**
   * 获取金额信息
   */
  async getAmountInfo(orderId) {
    uniCloud.logger.info("(order-operate)获取金额信息-入参", orderId);
    const getOrderSingleComplete = this.customerOrder.getSingleComplete(
      orderId
    );
    const getAgentSingle = callFunc({
      name: BACK_END,
      action: "agent-info/getSingleByAppId",
      data: { appId: this.appId },
    });
    const getUserSingle = callFunc({
      name: BACK_END,
      action: "user-anonymous/getSingleByUserId",
      data: { userId: this.userInfo._id },
    });
    const promiseAll = [getOrderSingleComplete, getAgentSingle, getUserSingle];
    const res = await Promise.all(promiseAll);
    uniCloud.logger.info("(order-operate)获取金额信息-出参", res);
    const [{ data: orderInfo }, [err1, agentInfo], [err2, userInfo]] = res;
    if (
      !orderInfo ||
      !orderInfo.csAmount ||
      !orderInfo.agAmount ||
      err1 ||
      !agentInfo.balance ||
      err2 ||
      !userInfo.balance
    ) {
      return;
    }
    return { orderInfo, agentInfo, userInfo };
  }
  /**
   * 验证资金是否足够
   */
  checkAmount(options) {
    const csBalance = options.userInfo.balance;
    const agBalance = options.agentInfo.balance;
    const { csAmount, agAmount } = options.orderInfo;
    if (csBalance > 0 && csAmount > csBalance) {
      return "余额告急,请先充值";
    }
    if (agBalance > 0 && agAmount > agBalance) {
      return "库存告急,请联系管理员补充库存";
    }
    const res = { csBalance, agBalance, csAmount, agAmount };
    uniCloud.logger.info("(order-operate)验证资金是否足够-出参", res);
    return res;
  }
  /**
   * 更新金额信息
   */
  async updateAmountInfo(options) {
    uniCloud.logger.info("(order-operate)更新金额信息-入参", options);
    const userId = this.userInfo._id;
    const appId = this.appId;
    const { agAmount, csAmount, orderId } = options;
    // 扣减用户资金
    const updateAgent = callFunc({
      name: BACK_END,
      action: "agent-info/updateBalanceByAppId",
      data: { appId, price: -agAmount },
    });
    // 扣减分站资金
    const updateCustomer = callFunc({
      name: BACK_END,
      action: "user-anonymous/updateBalance",
      data: { appId, userId, price: -csAmount },
    });
    // 更新订单状态
    const updateOrder = this.updateOrderInfo({
      orderId,
      preStatus: 1,
      nextStatus: 2,
    });
    const pubParam = {
      remarkId: orderId,
      type: 21,
      userId,
      appId,
    };
    // 新增分站资金表
    const addAgentFund = callFunc({
      name: BACK_END,
      action: "agent-fund/add",
      data: {
        ...pubParam,
        price: agAmount,
      },
    });
    // 新增用户资金表
    const addCustomerFund = callFunc({
      name: BACK_END,
      action: "customer-fund/add",
      data: {
        ...pubParam,
        price: csAmount,
      },
    });
    const res = await Promise.all([
      updateAgent,
      updateCustomer,
      updateOrder,
      addAgentFund,
      addCustomerFund,
    ]);
    uniCloud.logger.info("(order-operate)更新金额信息-出参", res);
    const [[err1], [err2], [err3], [err4], [err5]] = res;
    if (err1 || err2 || err3 || err4 || err5) {
      return;
    }
    return res;
  }
  /**
   * 获取传递给阿里货仓的订单数据
   */
  async getPostData(options) {
    const { csGoodsInfo, serviceInfo, addressInfo } = options.orderInfo;
    const SUPPLIER_ID = "5f4b16741179ce00015923a3"; // 阿里货仓ID
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-info/getSupplierInfoById",
      data: { supplierId: SUPPLIER_ID },
    });
    if (err || !data._id) {
      return;
    }
    const res = {
      accessToken: data.accessToken,
      datas: JSON.stringify(
        addressInfo.map((addressInfoItem) => ({
          storehouseCode: csGoodsInfo.storeCode,
          goodsCode: csGoodsInfo.goodsCode,
          minSingleGoodsWeight: csGoodsInfo.min || 0.6,
          maxSingleGoodsWeight: csGoodsInfo.max || 0.8,
          receiver: addressInfoItem.name,
          receiverPhone: addressInfoItem.mobile,
          receiverProvinceName: addressInfoItem.provinceName,
          receiverCityName: addressInfoItem.cityName,
          receiverAreaName: addressInfoItem.areaName,
          receiverAddress: addressInfoItem.address,
          thirdOrderNo: addressInfoItem.addressId,
          goodsNum: 1,
          shipperName: serviceInfo.name,
          shipperPhone: serviceInfo.mobile,
        }))
      ),
    };
    uniCloud.logger.info(
      "(order-operate)获取传递给阿里货仓的订单数据-出参",
      res
    );
    return res;
  }
  /***
   * 更新订单状态
   */
  async updateOrderInfo(options) {
    return callFunc({
      name: BACK_END,
      action: "customer-order/updateOrderInfo",
      data: {
        ...options,
        appId: this.appId,
        userId: this.userInfo._id,
      },
    });
  }
  /**
   * 购买vip
   */
  async buyVip(options) {
    if (typeof options.vipId !== "string") {
      return new this.ResponseModal(400, {}, "参数有误");
    }
    // 查询vip价格和时长
    // 查询余额
    const res = await this.customerVip.getSingleById(options);
    if (res.code !== 0) {
      return res;
    }
    if (res.data.activityPrice > this.userInfo.balance) {
      return new this.ResponseModal(400, {}, "余额不足，请先充值");
    }
    const res2 = await this.updateVip(res.date.days);
    if (!res2) {
      return new this.ResponseModal(500, {}, "开通vip失败，请稍后再试");
    }
    // 新增支出明细
  }
  async updateVip(days) {
    const now = Date.now();
    let { vipExpireTime } = this.userInfo;
    vipExpireTime < now && (vipExpireTime = now);
    vipExpireTime += days * 1000 * 60 * 60 * 24;
    // 扣减余额并延长vip时间
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "user-anonymous/updateVip",
      data: {
        vipExpireTime,
        appId: this.appId,
        price: -res.data.activityPrice,
      },
    });
    return err ? null : data;
  }
};
