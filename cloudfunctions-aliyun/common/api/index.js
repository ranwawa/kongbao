const db = require("./db");
const utils = require("./utils");
const config = require("./config");
const { request } = require("./request");
const mainFunc = require("./main-func");
const callFunc = require("./call-func");
const apiALHC = require("./api-alhc");
const apiKdHelp = require("./api-kdhelp");
const apiPaysApi = require("./api-paysapi");

class ResponseModal {
  constructor(code, data, msg = "ok") {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

class ControllerBase {
  constructor(appId = "", userInfo = {}) {
    this.appId = appId;
    this.userInfo = userInfo;
    this.userId = userInfo._id;
    this.token = userInfo.token ? userInfo.token[0] : "木有token";
    this.isVip = userInfo.vipExpireTime
      ? userInfo.vipExpireTime > Date.now()
      : false;
    this.ResponseModal = ResponseModal;
    this.baseFields = [
      "updateTime",
      "createTime",
      "isDelete",
      "isEnable",
      "sort",
    ];
  }
  info(title, ...data) {
    uniCloud.logger.log(`\n\n${title}\n\n`, ...data);
  }
  /**
   * 检查是否为md5Id
   */
  checkIsId(id) {
    return typeof id === "string" && id.length === 32;
  }
  /**
   * 获取400响应参数
   */
  get400Error(str) {
    return new this.ResponseModal(400, {}, str);
  }
  /**
   * 加工查询数据
   * 用于按固定格式返回前端
   * @param res 响应数据
   * @param title 输出日志的标题
   * @param isPickFirst 是否转将数据转换成对象
   */
  async processResponseData(res, title = "--", isPickFirst = false) {
    this.info(title + "-出参", res);
    let code = 0;
    let data = {};
    let msg = "ok";
    if (res.id !== undefined) {
      // 新增成功的返回结构 {id: xxx}
      code = 0;
      data = res;
    } else if (res.inserted !== undefined) {
      // 批量插入成功返回 {inserted: 1, result: {0: id}, ids: [id]}
      code = 0;
      data = res;
    } else if (res.affectedDocs !== undefined && res.data !== undefined) {
      // 查询成功的返回结构 {affectedDocs: 1, data: []}
      code = 0;
      data = isPickFirst ? res.data[0] || {} : res.data;
    } else if (res.affectedDocs !== undefined && res.updated !== undefined) {
      // 更新成功的返回结构 {affectedDocs: 1, updated: 1}
      if (res.affectedDocs < 1) {
        code = 500;
        msg = "更新失败";
      }
      data = res;
    } else if (res.affectedDocs !== undefined && res.deleted !== undefined) {
      // 删除成功的返回结构 {affectedDocs: 1, deleted: 1}
      if (res.affectedDocs < 1) {
        code = 500;
        msg = "删除失败";
      }
      data = res;
    } else {
      code = 500;
      data = res;
      msg = "未知异常";
    }
    return new ResponseModal(code, data, msg);
  }
  getTrue(properties = []) {
    const obj = {};
    properties.forEach((ele) => (obj[ele] = true));
    return obj;
  }
  getFalse(properties = []) {
    const obj = {};
    properties.forEach((ele) => (obj[ele] = false));
    return obj;
  }
  getBaseFields(isAuth = false) {
    const now = Date.now();
    const param = {
      updateTime: now,
      createTime: now,
      isDelete: false,
      isEnable: true,
      sort: 0,
    };
    if (isAuth) {
      param.appId = this.appId;
      param.userId = this.userInfo._id;
    }
    return param;
  }
}

class ControllerAuth extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId, userInfo);
  }
  /**
   * 验证token
   */
  async checkToken() {
    if (!this.userInfo._id) {
      return new this.ResponseModal(401, "请登录后访问");
    }
    return new this.ResponseModal(0, "验证通过");
  }
}

module.exports = {
  db,
  utils,
  config,
  mainFunc,
  apiALHC,
  apiKdHelp,
  apiPaysApi,
  request,
  callFunc,
  ResponseModal,
  ControllerBase,
  ControllerAuth,
};
