const { db, ControllerAuth, apiKdHelp } = require("api");
const { colCsAddress } = db;
module.exports = class AgentAddress extends ControllerAuth{
  constructor(appId = "", uniIdToken = "") {
    super(appId, uniIdToken);
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
    const res = await colCsAddress.add(paramData);
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
    const res = await colCsAddress.where(param).update({
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
    await colCsAddress.where(pubParam).update({
      default: false,
      updateTime: Date.now(),
    });
    const res = await colCsAddress
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
    const res = await colCsAddress
      .where({
        appId: this.appId,
        userId: this.userId,
        _id: option.addressId,
      })
      .update(param);
    return this.processResponseData(res, "修改一条地址", false);
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
    const res = await colCsAddress
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
    const res = await colCsAddress.where(param).get();
    return this.processResponseData(res, "查询一条地址", true);
  }
  /**
   * 查询默认地址
   */
  async getDefault() {
    const param = {
      appId: this.appId,
      userId: this.userId,
      isDelete: false,
      default: true,
    };
    uniCloud.logger.log("查询默认地址-入参", param);
    const res = await colCsAddress
      .aggregate()
      .match(param).limit(1)
      .addFields({
        addressId: '$_id',
      })
      .project({
        _id: false,
        appId: false,
        userId: false,
        createTime: false,
        updateTime: false,
        isDelete: false,
      })
      .end();
    return this.processResponseData(res, "查询默认地址", true);
  }
  /**
   * 智能解析收货地址
   */
  async resolveAddress(options) {
    uniCloud.logger.log("智能解析收货地址-入参", options);
    let [err, data] = await apiKdHelp.resolveAddress(options.addressStr);
    if (err) {
      uniCloud.logger.log("智能解析收货地址异常-报错", err);
      return new this.ResponseModal(500, err, "服务器异常");
    } else {
      data = data.map((ele) => ({
        name: ele.name,
        mobile: ele.mobile,
        provinceName: ele.province_name,
        cityName: ele.city_name,
        areaName: ele.county_name,
        address: ele.detail,
        formattedAddress: ele.original,
        isDefault: false,
      }));
      return new this.ResponseModal(0, data, "解析成功");
    }
  }
};
