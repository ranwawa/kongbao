const {
  colCsOrder,
  colCsFund,
  colAgGoods,
  colAgFund,
  colSpInfos,
} = require("./db");
const { ResponseModal, request } = require("api");
const _ = require("lodash");
const uniID = require("uni-id");
module.exports = class Order {
  constructor(appId, uniIdToken) {
    this.uniIdToken = uniIdToken;
    this.appId = appId;
  }
  /**
   * 添加一个订单
   */
  async add(option) {
    uniCloud.logger.log("添加一个订单-入参", option);
    // 处理商品信息
    // 根据身份计算金额是否足够
    // 查询分站的余额是否足够
    // 去第3方下单
    // 扣减用户余额
    // 扣减分站余额
    // 新增资金明细
    // 创建订单-已经支付
    // 发起下单请求
    // 改变订单状态-正在出库
    const goodsResult = await this.getGoodsInfo(option.goodsInfo);
    if (!goodsResult) {
      return new ResponseModal(400, {}, "商品数据数据异常");
    }
    const { csGoodsInfo } = goodsResult;
    const goodsAmount =
      +(this.isVip ? csGoodsInfo.salePriceVip : csGoodsInfo.salePriceNormal) *
      100;
    const balanceCustomer = await this.getCustomerBalance(goodsAmount);
    if (balanceCustomer < 0) {
      return new ResponseModal(400, {}, "帐户余额告急,请充值");
    }
    const balanceAgent = await this.getAgentBalance(goodsAmount);
    if (balanceAgent < 0) {
      return new ResponseModal(400, {}, "库存告急,请联系管理员");
    }
    option.goodsInfo = csGoodsInfo;
    const addRes = await this.addOrder(goodsAmount, option);
    if (!addRes) {
      return new ResponseModal(400, {}, "创建订单失败,请稍后再试");
    }
    const { goodsInfo, serviceInfo, addressInfo } = option;
    const updateRes = await this.updateBalance(
      addRes,
      balanceCustomer,
      balanceAgent
    );
    if (!updateRes) {
      return new ResponseModal(400, {}, "扣款失败,请稍后再试");
    }
    const buyRes = await this.buyOne(
      goodsInfo,
      serviceInfo,
      addressInfo,
      addRes.orderId
    );
    if (!buyRes) {
      return new ResponseModal(400, {}, "下单失败,请稍后再试");
    }
    return new ResponseModal(0, {});
  }
  /**
   * 查询用户余额
   */
  async getCustomerBalance(goodsAmount) {
    // 根据用户身份取vip或零售价
    // 对比余额和价格
    const res = await colCsFund
      .where({
        appId: this.appId,
        userId: this.userId,
      })
      .orderBy("createTime", "desc")
      .limit(1)
      .get();
    uniCloud.logger.log("查询用户余额-出参", res);
    const { data } = res;
    const [{ balance = 0 }] = data;
    return balance - goodsAmount;
  }
  /**
   * 查询分站余额
   */
  async getAgentBalance(goodsAmount) {
    // 根据用户身份取vip或零售价
    // 对比余额和价格
    const res = await colAgFund
      .where({
        appId: this.appId,
      })
      .orderBy("createTime", "desc")
      .limit(1)
      .get();
    uniCloud.logger.log("查询分站余额-出参", res);
    const { data } = res;
    const [{ balance = 0 }] = data;
    return balance - goodsAmount;
  }
  /**
   * 添加订单
   */
  async addOrder(goodsAmount, orderInfo) {
    const param = {
      appId: this.appId,
      userId: this.userId,
      price: goodsAmount,
      isDelete: false,
      createTime: Date.now(),
    };
    const res = await colCsOrder.add({
      ...param,
      ...orderInfo,
      status: 1, // 1已创建,待支付 2,已支付,待提交到供应商 3,已提交到供应,待供应商响应(待收货) 4,
      // 已收货,待发货(出物流纪录)
    });
    uniCloud.logger.log("新增订单-出参", res);
    const { id } = res;
    param.orderId = id;
    return id ? param : null;
  }
  /**
   * 更新余额
   */
  async updateBalance(pubParam, balanceCustomer, balanceAgent) {
    const param = {
      ...pubParam,
      remark: pubParam.orderId,
      type: 21,
      isIncome: false,
    };
    const allPromise = [
      colCsFund.add({
        ...param,
        balance: balanceCustomer,
      }),
      colAgFund.add({
        ...param,
        balance: balanceAgent,
      }),
    ];
    const res = await Promise.all(allPromise);
    uniCloud.logger.log("更新余额-出参", res);
    if (res.length && res.length < 2) {
      return;
    }
    const res2 = await colCsOrder.doc(pubParam.orderId).update({
      status: 2,
    });
    uniCloud.logger.log("更新余额后更新订单状态-出参", res2);
    return res2.updated;
  }
  /**
   * 单条同步下单
   * @param goodsInfo
   * @param serviceInfo
   * @param addressInfo
   * @param orderId
   * @returns {Promise<void>}
   */
  async buyOne(goodsInfo, serviceInfo, addressInfo, orderId) {
    const data = {
      accessToken: this.accessToken,
      storehouseCode: goodsInfo.storeCode,
      goodsCode: goodsInfo.goodsCode,
      minSingleGoodsWeight: goodsInfo.min,
      maxSingleGoodsWeight: goodsInfo.max,
      receiver: addressInfo.name,
      receiverPhone: addressInfo.mobile,
      receiverProvinceName: addressInfo.provinceName,
      receiverCityName: addressInfo.cityName,
      receiverAreaName: addressInfo.areaName,
      receiverAddress: addressInfo.address,
      thirdOrderNo: orderId,
      goodsNum: 1,
      shipperName: serviceInfo.name,
      shipperPhone: serviceInfo.mobile,
    };
    uniCloud.logger.log("单条同步下单-入参", data);
    const [err, res] = await request({
      url: "http://www.alihuocang.com/api/createOrder/merchantCreateOrder",
      method: "POST",
      data,
    });
    uniCloud.logger.log("单条同步下单-出参", [err, res]);
    if (err) {
      return;
    }
    const res2 = await colCsOrder.doc(orderId).update({
      remark: "供应商单号:" + data.recordId,
      type: 3,
    });
    uniCloud.logger.log("下单成功,更新订单状态-出参", res2);
    return res2.updated;
  }
  /**
   * 获取商品的完整信息,用来做快照
   */
  async getGoodsInfo(option) {
    const res = await colAgGoods
      .aggregate()
      .match({
        _id: option._id,
      })
      .lookup({
        from: "kb-sp-goods",
        localField: "spGoodsId",
        foreignField: "_id",
        as: "spGoodsInfo",
      })
      .lookup({
        from: "kb-sp-stores",
        localField: "spGoodsInfo.storeId",
        foreignField: "_id",
        as: "spStoreInfo",
      })
      .end();
    uniCloud.logger.log("获取商品的完整信息-出参", res);
    const { affectedDocs, data } = res;
    const [goodsInfo] = data;
    if (affectedDocs !== 1) {
      uniCloud.logger.log(
        "加工添加订单的请求参数",
        "商品信息异常,一个商品id必须要对应一个商品的"
      );
      return;
    }
    const [spGoodsInfo] = goodsInfo.spGoodsInfo;
    const [spStoreInfo] = goodsInfo.spStoreInfo;
    if (!spGoodsInfo || !spStoreInfo) {
      uniCloud.logger.log(
        "加工添加订单的请求参数",
        "商品信息异常,商品必须对应供应商商品和仓库信息"
      );
      return;
    }
    // 只有vip才可以自定义重量
    goodsInfo.min = this.isVip ? goodsInfo.minWeight || 0.6 : 0.6;
    goodsInfo.max = this.isVip ? goodsInfo.maxWeight || 0.8 : 0.8;
    goodsInfo.storeCode = spGoodsInfo.storeCode;
    goodsInfo.goodsCode = spGoodsInfo.goodsCode;
    return {
      spGoodsInfo,
      spStoreInfo,
      csGoodsInfo: _.pick(goodsInfo, [
        "_id",
        "spGoodsId",
        "expressCostPrice",
        "goodsCostPrice",
        "costPrice",
        "isEnable",
        "salePriceVip",
        "salePriceNormal",
        "min",
        "max",
        "storeCode",
        "goodsCode",
      ]),
    };
  }
  /**
   * 加工查询数据
   * 用于按固定格式返回前端
   * @param res
   * @param title
   * @param isPickFirst
   */
  async processResponseData(res, title = "--", isPickFirst = false) {
    uniCloud.logger.log(title + "-出参", res);
    let data = res.affectedDocs ? res.data || [] : [];
    isPickFirst && (data = data[0] || {});
    return new ResponseModal(0, data);
  }
  /**
   * 验证token
   * @returns {Promise<ResponseModal|{msg: string, code: number}|{msg: string,
   *   code: number}|{msg: string, code: number}|*|{msg: string, code: number,
   *   err: *}|{msg: string, code: number, err: *}>}
   */
  async checkToken() {
    if (!this.uniIdToken) {
      return new ResponseModal(30010, "请登录后访问");
    }
    const res = await uniID.checkToken(this.uniIdToken);
    uniCloud.logger.log("验证token-出参", res);
    if (res.code !== 0) {
      return res;
    }
    if (res.appId !== this.appId) {
      uniCloud.logger.warn("验证token", "注册时appId与登录时appId有差异");
    }
    const spRes = await this.getAccessToken();
    if (!spRes) {
      return new ResponseModal(30011, "系统异常,请联系管理员");
    }
    this.userId = res.uid;
    this.isVip = res.userInfo.isVip;
    return res;
  }
  /**
   * 获取供应商的accessToken
   */
  async getAccessToken() {
    const res = await colSpInfos
      .where({
        appId: this.appId,
        isDelete: false,
        isEnable: true,
      })
      .limit(1)
      .get();
    uniCloud.logger.log("获取供应商的accessToken-出参", res);
    const {
      data: [spInfo],
    } = res;
    const accessToken = spInfo && spInfo.accessToken;
    return (this.accessToken = accessToken);
  }
};
