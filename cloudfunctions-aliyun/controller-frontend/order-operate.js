/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { ControllerAuth, apiPaysApi, callFunc, apiALHC, utils } = require("api");
const { md5 } = utils;
const CustomerFundOrder = require("./customer-fund-order");
const AgentGoods = require("./agent-goods");
const AgentService = require("./customer-service");
const CustomerVip = require("./customer-vip");
const BACK_END = "controller-backend";
const FUNC = {
  "5f4b16741179ce00015923a3": "alihuocang", // 阿里货仓-测试环境
  "5f705f19fcfc0c000111d3b2": "alihuocang", // 阿里货仓-生产环境
};

/**
 * 确认订单相关操作
 */
class OrderConfirm extends ControllerAuth {
  constructor(appId, userInfo) {
    super(appId, userInfo);
    this.agentGoods = new AgentGoods(appId, userInfo);
    this.agentService = new AgentService(appId, userInfo);
  }
  /**
   * 确认订单
   */
  async confirmOrder(options = {}) {
    this.info("(order-operate)确认订单-入参", options);
    const {
      goodsId = "",
      serviceId = "",
      storeId = "",
      addressList = [],
    } = options;
    if (!this.checkIsId(goodsId)) {
      return new this.ResponseModal(400, {}, "该商品已下架");
    }
    if (!Array.isArray(addressList) || addressList.length < 1) {
      return new this.ResponseModal(400, {}, "请填写收货地址");
    }
    // 处理商品信息
    const res = await this.getGoodsAndServiceInfo(goodsId, serviceId, storeId);
    if (!res) {
      return new this.ResponseModal(400, {}, "商品或售后数据异常");
    }
    // 添加主订单
    const [goodsInfo, serviceInfo] = res;
    const { agGoodsInfo, spGoodsInfo, spStoreInfo } = goodsInfo;
    const [err, addRes] = await this.addOrder(
      this.figurePrice(
        agGoodsInfo,
        spGoodsInfo,
        spStoreInfo,
        addressList.length
      ),
      { serviceInfo, agGoodsInfo, spGoodsInfo, spStoreInfo }
    );
    if (err) {
      return new this.ResponseModal(400, {}, "创建订单失败,请稍后再试");
    }
    // 添加子订单，每条地址是一个子订单
    const orderId = addRes.id;
    await this.addOrderSub(addressList, orderId);
    return new this.ResponseModal(0, addRes);
  }
  /**
   * 新增主订单
   */
  async addOrder(priceInfo, orderInfo) {
    return callFunc({
      name: BACK_END,
      action: "customer-order/add",
      data: {
        priceInfo,
        orderInfo,
        appId: this.appId,
        userId: this.userInfo._id,
      },
    });
  }
  /**
   * 新增子订单
   */
  async addOrderSub(addressList, orderId) {
    const addressListNew = addressList.map((ele, index) => ({
      orderId,
      ...ele,
      // 阿里货仓只限城市名为2个字以上,而直辖市只有一个字.所以得处理一下
      cityName: ele.cityName.length < 2 ? ele.areaName : ele.cityName,
      _id: md5(`${orderId}${index}`),
      ...this.getBaseFields(true),
    }));
    return callFunc({
      name: BACK_END,
      action: "customer-order/addSubOrderMore",
      data: { addressList: addressListNew },
    });
  }
  /**
   * 计算各种金额
   */
  figurePrice(agGoodsInfo, spGoodsInfo, spStoreInfo, addressLength) {
    // 根据用户身份取成交价
    const isAgentVip = false;
    const { expressCostPrice } = spStoreInfo.expressInfo;
    const dealPriceCustomer =
      (this.isVip ? agGoodsInfo.salePriceVip : agGoodsInfo.salePriceNormal) +
      expressCostPrice;
    const dealPriceAgent =
      (isAgentVip ? spGoodsInfo.agentPriceVip : spGoodsInfo.agentPriceNormal) +
      expressCostPrice;
    const dealPricePlatform = spGoodsInfo.goodsCostPrice + expressCostPrice;
    const amountCustomer = dealPriceCustomer * addressLength; // 用户成交价
    const amountAgent = dealPriceAgent * addressLength; // 分站成交价
    const amountPlatform = dealPricePlatform * addressLength; // 分站成交价
    return {
      dealPriceCustomer,
      dealPriceAgent,
      dealPricePlatform,
      amountCustomer,
      amountAgent,
      amountPlatform,
    };
  }
  /**
   * 查询商品和分站售后信息
   */
  async getGoodsAndServiceInfo(goodsId, serviceId, storeId) {
    const [goodsInfo, serviceInfo] = await Promise.all([
      this.agentGoods.getSingleCompleteByGoodsIdAndStoreId({
        goodsId,
        storeId,
      }),
      this.agentService.getSingle({ serviceId }),
    ]);
    if (
      !goodsInfo ||
      goodsInfo.code !== 0 ||
      !serviceInfo ||
      serviceInfo.code !== 0
    ) {
      return;
    }
    return [goodsInfo.data, serviceInfo.data];
  }
}

/**
 * 支付订单相关操作
 */
class OrderPay extends OrderConfirm {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 支付
   */
  async pay(options) {
    this.info("(order-operate)支付-入参", options);
    const { orderId } = options;
    if (!this.checkIsId(orderId)) {
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
    return await this[FUNC[res.orderInfo.spId]](res.orderInfo, orderId);
  }
  /**
   * 阿里货仓下单逻辑
   */
  async alihuocang(orderInfo, orderId) {
    const postData = await this.getPostData(orderInfo);
    if (!postData) {
      return new this.ResponseModal(500, {}, "获取下单参数,数据异常");
    }
    const [, res4] = await apiALHC.merchantCreateOrderList({ datas: postData });
    if (!res4 || res4.length < 1) {
      return new this.ResponseModal(500, {}, "快递公司下单失败");
    }
    const [, res5] = await this.updateOrderInfo({
      orderId,
      preStatus: 2,
      nextStatus: 3,
      batchNo: res4[0].batchNo,
      spPayTime: Date.now(),
    });
    if (!res5 || res5.affectedDocs < 1) {
      return new this.ResponseModal(500, {}, "更新订单失败");
    }
    return this.processResponseData(res5, "(order-operate)阿里货仓下单逻辑");
  }
  /**
   * 获取金额信息
   */
  async getAmountInfo(orderId) {
    this.info("(order-operate)获取金额信息-入参", orderId);
    const { appId } = this;
    const userId = this.userInfo._id;
    const getOrderAmount = callFunc({
      name: BACK_END,
      action: "customer-order/getOrderAmount",
      data: { appId, userId, orderId, status: 1 },
    });
    const getAgentSingle = callFunc({
      name: BACK_END,
      action: "agent-info/getSingleByAppId",
      data: { appId },
    });
    const getUserSingle = callFunc({
      name: BACK_END,
      action: "user-anonymous/getSingleByUserId",
      data: { userId },
    });
    const promiseAll = [getOrderAmount, getAgentSingle, getUserSingle];
    const res = await Promise.all(promiseAll);
    this.info("(order-operate)获取金额信息-出参", res);
    const [[err, orderInfo], [err1, agentInfo], [err2, userInfo]] = res;
    if (
      err ||
      !orderInfo.amountCustomer ||
      !orderInfo.amountAgent ||
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
    const { amountCustomer, amountAgent, amountPlatform } = options.orderInfo;
    if (csBalance > 0 && amountCustomer > csBalance) {
      return "余额告急,请先充值";
    }
    if (agBalance > 0 && amountAgent > agBalance) {
      return "库存告急,请联系管理员补充库存";
    }
    const res = {
      csBalance,
      agBalance,
      amountCustomer,
      amountAgent,
      amountPlatform,
    };
    this.info("(order-operate)验证资金是否足够-出参", res);
    return res;
  }
  /**
   * 更新金额信息
   */
  async updateAmountInfo(options) {
    this.info("(order-operate)更新金额信息-入参", options);
    const userId = this.userInfo._id;
    const appId = this.appId;
    const { amountCustomer, amountAgent, orderId } = options;
    // 扣减用户资金
    const updateAgent = callFunc({
      name: BACK_END,
      action: "agent-info/updateBalanceByAppId",
      data: { appId, price: -amountCustomer },
    });
    // 扣减分站资金
    const updateCustomer = callFunc({
      name: BACK_END,
      action: "user-anonymous/updateBalance",
      data: { appId, userId, price: -amountAgent },
    });
    // 更新订单状态
    const updateOrder = this.updateOrderInfo({
      orderId,
      preStatus: 1,
      nextStatus: 2,
      payTime: Date.now(),
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
        price: amountCustomer,
      },
    });
    // 新增用户资金表
    const addCustomerFund = this.addCustomerFund(orderId, 21, amountAgent);
    const res = await Promise.all([
      updateAgent,
      updateCustomer,
      updateOrder,
      addAgentFund,
      addCustomerFund,
    ]);
    this.info("(order-operate)更新金额信息-出参", res);
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
    const {
      agGoodsInfo,
      spGoodsInfo,
      spStoreInfo,
      serviceInfo,
      addressList,
    } = options;
    const data = JSON.stringify(
      addressList.map((addressInfoItem) => ({
        storehouseCode: spStoreInfo.originInfo.code,
        goodsCode: spGoodsInfo.goodsCode,
        minSingleGoodsWeight: agGoodsInfo.min || 0.6,
        maxSingleGoodsWeight: agGoodsInfo.max || 0.8,
        receiver: addressInfoItem.name,
        receiverPhone: addressInfoItem.mobile,
        receiverProvinceName: addressInfoItem.provinceName,
        receiverCityName: addressInfoItem.cityName,
        receiverAreaName: addressInfoItem.areaName,
        receiverAddress: addressInfoItem.address,
        thirdOrderNo: addressInfoItem._id,
        goodsNum: 1,
        shipperName: serviceInfo.name,
        shipperPhone: serviceInfo.mobile,
      }))
    );
    this.info("(order-operate)获取传递给阿里货仓的订单数据-出参", data);
    return data;
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
   * 新增用户资金明细
   */
  addCustomerFund(remarkId, type, price) {
    return callFunc({
      name: BACK_END,
      action: "customer-fund/add",
      data: {
        remarkId,
        price,
        type,
        userId: this.userInfo._id,
        appId: this.appId,
      },
    });
  }
  /**
   * 提醒打单
   */
  async alertPrint(options) {
    this.info("(order-operate)提醒打单-入参", options);
    const { orderId } = options;
    if (!this.checkIsId(orderId)) {
      return new this.ResponseModal(400, {}, "参数异常");
    }
    const [err, orderInfo] = await callFunc({
      name: BACK_END,
      action: "customer-order/getOrderAmount",
      data: { appId: this.appId, uerId: this.userInfo._id, orderId, status: 2 },
    });
    if (err || !orderInfo.spId) {
      return new this.ResponseModal(400, "订单信息有误");
    }
    return await this[FUNC[orderInfo.spId]](orderInfo, orderId);
  }
}

/**
 * 查询快递单号相关操作
 */
class OrderSend extends OrderPay {
  constructor(appId, userInfo) {
    super(appId, userInfo);
    this.customerFundOrder = new CustomerFundOrder(appId, userInfo);
    this.customerVip = new CustomerVip(appId, userInfo);
  }
  /**
   * 提醒发货
   */
  async alertSend(options) {
    this.info("(order-operate)提醒发货-入参", options);
    const { orderId } = options;
    if (!this.checkIsId(orderId)) {
      return new this.ResponseModal(400, {}, "参数有误");
    }
    // 查询当前订单所有地址
    const res = await this.getRecordIdList(orderId);
    if (!res) {
      return new this.ResponseModal(400, {}, "数据异常");
    }
    // 根据地址查询第3方快递单号
    // 每次最多查100个
    const [err, data] = await apiALHC.findExpressNoList({
      recordIds: res.join(","),
    });
    if (err) {
      return new this.ResponseModal(500, {}, "服务异常,请稍后再试");
    }
    // 更新子订单和主订单
    const res2 = await this.updateSub(data);
    if (!res2) {
      return new this.ResponseModal(500, {}, "更新快递单号出错");
    }
    // 更新主订单
    const [err2, data2] = await callFunc({
      name: "controller-backend",
      action: "customer-order/updateOrderInfo",
      data: {
        orderId,
        appId: this.appId,
        userId: this.userInfo._id,
        preStatus: 5,
        nextStatus: 6,
      },
    });
    if (!data2 || data2.affectedDocs < 1) {
      uniCloud.logger.log("(cb-ali-huocang)批量下单接口回调-出参", err2, data2);
      return Error;
    }
    return new this.ResponseModal(0, data2);
  }
  async getRecordIdList(orderId) {
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "customer-order/getRecordIdByOrderId",
      data: {
        orderId,
        userId: this.userInfo._id,
        appId: this.appId,
        isDelete: false,
        isEnable: true,
      },
    });
    if (err || data.length < 1) {
      return;
    }
    return data.map((ele) => ele.recordId);
  }
  async updateSub(options) {
    const promiseAll = options.map((ele) =>
      callFunc({
        name: BACK_END,
        action: "customer-order/updateSub",
        data: ele,
      })
    );
    const res = await Promise.all(promiseAll);
    const affectedDocs = res.filter(
      ([err, data]) => data && data.affectedDocs === 1
    );
    this.info("更新子订单-出参", affectedDocs.length, options.length);
    return affectedDocs.length === options.length;
  }
}

module.exports = class OrderOperate extends OrderSend {
  constructor(appId, userInfo) {
    super(appId, userInfo);
    this.customerFundOrder = new CustomerFundOrder(appId, userInfo);
    this.customerVip = new CustomerVip(appId, userInfo);
  }
  /**
   * 确认充值订单
   */
  async confirmFundOrder(options = {}) {
    this.info("(order-operate)确认充值订单-入参", options);
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
   * 购买vip
   */
  async buyVip(options) {
    this.info("(order-operate)购买vip-入参", options);
    if (typeof options.vipId !== "string") {
      return new this.ResponseModal(400, {}, "参数有误");
    }
    // 查询vip价格和时长
    // 查询余额
    const res = await this.customerVip.getSingleById(options);
    if (res.code !== 0) {
      return res;
    }
    const { activityPrice } = res.data;
    if (activityPrice > this.userInfo.balance) {
      return new this.ResponseModal(400, {}, "余额不足，请先充值");
    }
    const [, res2] = await this.updateVip(res.data.days, activityPrice);
    if (!res2) {
      return new this.ResponseModal(500, {}, "开通vip失败，请稍后再试");
    }
    // 新增支出明细
    const [, res3] = await this.addCustomerFund(
      res.data._id,
      23,
      activityPrice
    );
    if (!res3) {
      return new this.ResponseModal(500, {}, "更新支出明细失败");
    }
    return this.processResponseData(res3, "购买vip");
  }
  /**
   * 更新vip日期
   */
  async updateVip(days, activityPrice) {
    const now = Date.now();
    let { vipExpireTime } = this.userInfo;
    vipExpireTime < now && (vipExpireTime = now);
    vipExpireTime += days * 1000 * 60 * 60 * 24;
    // 扣减余额并延长vip时间
    return callFunc({
      name: BACK_END,
      action: "user-anonymous/updateVip",
      data: {
        days,
        vipExpireTime,
        price: -activityPrice,
        appId: this.appId,
        userId: this.userInfo._id,
      },
    });
  }
};
