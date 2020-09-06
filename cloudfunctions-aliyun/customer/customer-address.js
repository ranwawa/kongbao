const uniID = require("uni-id");
const { ResponseModal, request } = require("api");
const { colAgAddress } = require("./db");
module.exports = class AgentAddress {
  constructor(appId = "", uniIdToken = "") {
    this.appId = appId;
    this.uniIdToken = uniIdToken;
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
    if (res.appId === this.appId) {
      uniCloud.logger.warn("验证token", "注册时appId与登录时appId有差异");
    }
    this.userId = res.uid;
    return res;
  }
  /*
   * 查询当前用户所有地址信息
   */
  async getList() {
    const param = {
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
    };
    uniCloud.logger.log("查询当前用户所有地址-入参", param);
    const res = await colAgAddress
      .where(param)
      .field({
        _id: true,
        name: true,
        mobile: true,
        provinceName: true,
        cityName: true,
        areaName: true,
        address: true,
        default: true,
      })
      .get();
    return this.processResponseData(res, "查询当前用户所有地址", false);
  }
  /**
   * 查询一条地址
   */
  async getSingle(option = {}) {
    const param = {
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
      _id: option.addressId,
    };
    uniCloud.logger.log("查询一条地址-入参", param);
    const res = await colAgAddress.where(param).get();
    return this.processResponseData(res, "查询一条地址", true);
  }
  /**
   * 查询默认地址
   * @param option
   * @returns {Promise<ResponseModal>}
   */
  async getDefault(option = {}) {
    const param = {
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
      default: true,
    };
    uniCloud.logger.log("查询默认地址-入参", param);
    const res = await colAgAddress.where(param).get();
    return this.processResponseData(res, "查询默认地址", true);
  }
  /**
   * 添加地址
   * @param param
   */
  async add(param) {
    const now = Date.now();
    const {
      name,
      mobile,
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      areaCode,
      areaName,
      address,
    } = param;
    const paramData = {
      appId: this.appId,
      userId: this.userId,
      name,
      mobile,
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      areaCode,
      areaName,
      address,
      formattedAddress: `${name} ${mobile} ${provinceName}${cityName}${areaName}${address}`,
      default: param.default || false,
      createTime: now,
      updateTime: now,
      isDelete: false,
    };
    uniCloud.logger.log("添加地址-入参", paramData);
    const res = await colAgAddress.add(paramData);
    return this.processResponseData(res, "添加地址");
  }
  /**
   * 删除一条地址
   * @param option
   * @returns {Promise<ResponseModal>}
   */
  async del(option = {}) {
    const param = {
      appId: this.appId,
      userId: this.userId,
      _id: option.addressId,
      isDelete: false,
    };
    uniCloud.logger.log("删除一条地址-入参", param);
    const res = await colAgAddress.where(param).update({
      isDelete: true,
      updateTime: Date.now(),
    });
    return this.processResponseData(res, "删除一条地址", false);
  }
  /**
   * 设置为默认地址
   * @returns {Promise<void>}
   */
  async setDefault(option = { addressId: "" }) {
    const pubParam = {
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
    };
    const param = {
      _id: option.addressId,
    };
    uniCloud.logger.log("设置为默认地址-入参", pubParam, param);
    await colAgAddress.where(pubParam).update({
      default: false,
      updateTime: Date.now(),
    });
    const res = await colAgAddress
      .where({
        ...pubParam,
        ...param,
      })
      .update({
        default: true,
        updateTime: Date.now(),
      });
    return this.processResponseData(res, "设置为默认地址", false);
  }
  /**
   * 修改一条地址
   * @returns {Promise<ResponseModal>}
   */
  async update(option = {}) {
    const {
      name,
      mobile,
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      areaCode,
      areaName,
      address,
    } = option;
    const param = {
      name,
      mobile,
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      areaCode,
      areaName,
      address,
      formattedAddress: `${name} ${mobile} ${provinceName}${cityName}${areaName}${address}`,
      default: option.default || false,
      updateTime: Date.now(),
    };
    uniCloud.logger.log("修改一条地址-入参", param);
    const res = await colAgAddress
      .where({
        appId: this.appId,
        userId: this.userId,
        _id: option.addressId,
      })
      .update(param);
    return this.processResponseData(res, "修改一条地址", false);
  }
  /**
   * 智能解析收货地址
   */
  async resolveAddress(option) {
    const appId = "100687";
    const method = "cloud.address.resolve";
    const ts = Date.now();
    const appKey = "ed51dbd0ffb2a5bbbb8aede0c3bdc1ec40b41de1";
    // 计算签名
    const signStr = appId + method + ts + appKey;
    const crypto = require("crypto");
    const h = crypto.createHash("md5");
    h.update(signStr);
    const sign = h.digest("hex");
    const data = JSON.stringify({
      text: option.addressStr,
      multimode: true,
    });
    return await request({
      url: "https://kop.kuaidihelp.com/api",
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      dataType: "json",
      data: {
        app_id: appId,
        method: method,
        ts: ts,
        sign: sign,
        data,
      },
    });
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
};
