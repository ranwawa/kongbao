/**
 * @file 用户订单相关数据库操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:08
 */
const { request, ControllerAuth, db } = require("api");
const {
  colCsOrder,
  colCsFund,
  colAgFund,
  colSpInfos,
  $,
} = db;
const uniID = require("uni-id");
const md5 = require("md5");
function isId(id) {
  return typeof id === "string" && id.length === 32;
}
module.exports = class CustomerOrder extends ControllerAuth{
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }

  /**
   * 支付订单
   * @param option
   */
  async pay(option) {
    // 查询订单信息
    // 判断用户金额是否足够
    // 判断分站金额是否足够
    // 更新用户和分站资金明细表
    // 更新订单表
    // 根据收货地址数量跳第3方下单
    // 更新订单表
    const { orderId } = option;
    uniCloud.logger.log("支付订单-入参", option);
    if (!isId(orderId)) {
      return new ResponseModal(400, "订单信息有误");
    }
    const orderInfo = await this.getSingleComplete(orderId);
    if (!orderInfo || !orderInfo._id) {
      return new ResponseModal(400, "订单信息有误");
    }
    const balanceCustomer = await this.getCustomerBalance(orderInfo.csAmount);
    if (balanceCustomer < 0) {
      return new ResponseModal(400, {}, "帐户余额告急,请充值");
    }
    const balanceAgent = await this.getAgentBalance(orderInfo.agAmount);
    if (balanceAgent < 0) {
      return new ResponseModal(400, {}, "库存告急,请联系管理员");
    }
    const updateRes = await this.updateBalance(
      orderInfo,
      balanceCustomer,
      balanceAgent
    );
    if (!updateRes) {
      return new ResponseModal(400, {}, "支付失败,请稍后再试");
    }
    orderInfo.addressInfo.length > 1
      ? this.buyMore(orderInfo)
      : this.buyOne(orderInfo);
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
      .field({
        balance: true,
      })
      .limit(1)
      .get();
    uniCloud.logger.log("查询用户余额-出参", res);
    const balance = res.data[0] ? res.data[0].balance : 0;
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
      .field({
        balance: true,
      })
      .limit(1)
      .get();
    uniCloud.logger.log("查询分站余额-出参", res);
    const balance = res.data[0] ? res.data[0].balance : 0;
    return balance - goodsAmount;
  }
  /**
   * 添加订单
   */
  async add(csAmount, agAmount, orderInfo) {
    uniCloud.logger.log("添加订单-入参", csAmount, agAmount, orderInfo);
    const now = Date.now();
    const orderId = md5(`${this.appId}${this.userId}${csAmount}${now}`);
    orderInfo.addressInfo = orderInfo.addressInfo.map((ele, index) => ({
      ...ele,
      addressId: md5(`${orderId}${index}`),
    }));
    const res = await colCsOrder.add({
      csAmount,
      agAmount,
      ...orderInfo,
      _id: orderId,
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
      createTime: now,
      status: 1, // 1已创建,待支付 2,已支付,待提交到供应商 3,已提交到供应,待供应商响应(待收货) 5,
      // 已收货,待发货(出物流纪录)
    });
    uniCloud.logger.log("添加订单-出参", res);
    return new this.ResponseModal(0, res);
  }
  /**
   * 删除所有订单
   * @returns {Promise<void>}
   */
  async removeAll() {
    // const res = await colCsOrder.where({
    //   _id: dbCmd.exists(true)
    // }).remove();
    // uniCloud.logger.log("删除所有订单-出参", res);
  }
  /**
   * 更新余额
   */
  async updateBalance(orderInfo, balanceCustomer, balanceAgent) {
    const now = Date.now();
    const param = {
      remark: orderInfo._id,
      type: 21,
      isIncome: false,
      isDelete: false,
      createTime: now,
      appId: this.appId,
      userId: this.userId,
    };
    const allPromise = [
      colCsFund.add({
        ...param,
        price: orderInfo.csAmount,
        balance: balanceCustomer,
      }),
      colAgFund.add({
        ...param,
        price: orderInfo.agAmount,
        balance: balanceAgent,
      }),
    ];
    const res = await Promise.all(allPromise);
    uniCloud.logger.log("更新余额-出参", res);
    if (res.length && res.length < 2) {
      return;
    }
    const res2 = await colCsOrder.doc(orderInfo._id).update({
      status: 2,
      payTime: now,
    });
    uniCloud.logger.log("更新余额后更新订单状态-出参", res2);
    return res2.updated;
  }
  /**
   * 查询单条订单
   */
  async getSingle(option) {
    uniCloud.logger.log("查询单条订单-入参", option);
    if (!option.orderId) {
      return new ResponseModal(400, {}, "订单信息有误");
    }
    const res = await colCsOrder
      .aggregate()
      .match({
        appId: this.appId,
        userId: this.userId,
        _id: option.orderId,
        isDelete: false,
      })
      .limit(1)
      .project({
        orderId: "$_id",
        _id: false,
        status: true,
        createTime: true,
        payTime: true,
        storeTime: "$spBuyTime",
        amount: "$csAmount",
        num: $.size("$addressInfo"),
        serviceInfo: "$serviceInfo.formattedAddress",
        addressInfo: $.map({
          input: "$addressInfo",
          as: "this",
          in: { formattedAddress: "$$this.formattedAddress" },
        }),
        goodsInfo: {
          goodsId: "$csGoodsInfo._id",
          expressName: "$spGoodsInfo.expressName",
          goodsName: "$spGoodsInfo.goodsName",
          salePriceNormal: $.divide(["$csAmount", $.size("$addressInfo")]),
          imgList: $.split(["$spGoodsInfo.imgList", "---"]),
        },
      })
      .end();
    return this.processResponseData(res, "查询单条订单", true);
  }
  /**
   * 查询完整的订单信息
   */
  async getSingleComplete(orderId) {
    const orderRes = await colCsOrder
      .where({
        appId: this.appId,
        userId: this.userId,
        _id: orderId,
        status: 1,
        isDelete: false,
      })
      .field({
        _id: true,
        csAmount: true,
        agAmount: true,
        csGoodsInfo: true,
        serviceInfo: true,
        addressInfo: true,
      })
      .limit(1)
      .get();
    uniCloud.logger.log("支付订单,查询订单信息-出参", orderRes);
    return orderRes.data[0];
  }
  /**
   * 根据分类查询订单
   * @param option
   */
  async getList(option) {
    const { currentPage = 1, pageSize = 10, status = -1 } = option;
    uniCloud.logger.log("根据分类查询订单-入参", {
      appId: this.appId,
      userId: this.userId,
      status: status === -1 ? undefined : status,
      isDelete: false,
    });
    const res = await colCsOrder
      .aggregate()
      .match({
        appId: this.appId,
        userId: this.userId,
        status: status === -1 ? undefined : status,
        isDelete: false,
      })
      .sort({
        createTime: -1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .project({
        _id: false,
        status: true,
        createTime: true,
        orderId: "$_id",
        num: $.size("$addressInfo"),
        amount: "$csAmount",
        goodsInfo: {
          goodsId: "$csGoodsInfo._id",
          expressName: "$spGoodsInfo.expressName",
          goodsName: "$spGoodsInfo.goodsName",
          salePriceNormal: $.divide(["$csAmount", $.size("$addressInfo")]),
          imgList: $.split(["$spGoodsInfo.imgList", "---"]),
        },
      })
      .end();
    return this.processResponseData(res, "根据分类查询订单");
  }
  /**
   * 加工传递给供应商的订单信息
   */
  getPostData(csGoodsInfo, addressInfoItem, serviceInfo) {
    return {
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
    };
  }
  /**
   * 多条地址异步下单
   */
  async buyMore(orderInfo) {
    const { csGoodsInfo, serviceInfo, addressInfo } = orderInfo;
    const orderId = orderInfo._id;
    const param = {
      accessToken: this.accessToken,
      datas: JSON.stringify(
        addressInfo.map((ele) =>
          this.getPostData(csGoodsInfo, ele, serviceInfo)
        )
      ),
    };
    uniCloud.logger.log("多条地址异步下单-入参", param);
    const [err, res] = await request({
      url: "http://www.alihuocang.com/api/createOrder/merchantCreateOrderList",
      method: "POST",
      data: param,
    });
    uniCloud.logger.log("多条地址异步下单-出参", [err, res]);
    if (err || res.length < 1) {
      return;
    }
    const res2 = await colCsOrder.doc(orderId).update({
      batchNo: res[0].batchNo,
      spAmount: +res.amount * 100,
      status: 3,
      spBuyTime: Date.now(),
    });
    uniCloud.logger.log("多条地址异步下单成功,更新订单状态-出参", res2);
    return res2.updated;
  }
  /**
   * 单条同步下单
   */
  async buyOne(orderInfo) {
    const { csGoodsInfo, serviceInfo, addressInfo } = orderInfo;
    const [addressInfoOne] = addressInfo;
    const orderId = orderInfo._id;
    const param = this.getPostData(csGoodsInfo, addressInfoOne, serviceInfo);
    uniCloud.logger.log("单条同步下单-入参", param);
    const [err, res] = await request({
      url: "http://www.alihuocang.com/api/createOrder/merchantCreateOrder",
      method: "POST",
      data: {
        accessToken: this.accessToken,
        ...param,
      },
    });
    uniCloud.logger.log("单条同步下单-出参", [err, res]);
    if (err) {
      return;
    }
    const res2 = await colCsOrder.doc(orderId).update({
      addressInfo: [addressInfoOne],
      spAmount: +res.amount * 100,
      status: 3,
      spBuyTime: Date.now(),
    });
    uniCloud.logger.log("下单成功,更新订单状态-出参", res2);
    return res2.updated;
  }


  /**
   * 验证token
   * @returns {Promise<ResponseModal|{msg: string, code: number}|{msg: string,
   *   code: number}|{msg: string, code: number}|*|{msg: string, code: number,
   *   err: *}|{msg: string, code: number, err: *}>}
   */
  async checkToken() {
    if (!this.uniIdToken) {
      return new this.ResponseModal(401, "请登录后访问");
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

