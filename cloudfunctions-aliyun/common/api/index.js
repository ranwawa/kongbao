const db = require("./db");
const utils = require("./utils");
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
  constructor(appId) {
    this.appId = appId;
    this.ResponseModal = ResponseModal;
  }
  /**
   * 加工查询数据
   * 用于按固定格式返回前端
   * @param res 响应数据
   * @param title 输出日志的标题
   * @param isPickFirst 是否转将数据转换成对象
   */
  async processResponseData(res, title = "--", isPickFirst = false) {
    uniCloud.logger.log(title + "-出参", res);
    // 新增成功的返回结构 {id: xxx}
    let code = 0;
    let data = {};
    let msg = "ok";
    if (res.id !== undefined) {
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
    } else {
      code = 500;
      data = res;
      msg = "未知异常";
    }
    return new ResponseModal(code, data, msg);
  }
}

class ControllerAuth extends ControllerBase {
  constructor(appId, userInfo) {
    super(appId);
    this.userInfo = userInfo;
    this.token = userInfo.token ? userInfo.token[0] : "木有token";
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
